import { describe, it, expect, vi, beforeEach } from 'vitest';
import { webRtcService, type CallerInfo } from '../../src/services/webRtcService';

describe('Calling Bug Fixes Suite (10 Reported Bugs Verification)', () => {
  const mockCaller: CallerInfo = {
    id: 'usr_caller_1',
    fullName: 'Hamza Khan',
    gender: 'male',
    city: 'Lahore',
    isVip: true
  };

  const mockReceiver: CallerInfo = {
    id: 'usr_receiver_1',
    fullName: 'Ayesha Bibi',
    gender: 'female',
    city: 'Islamabad'
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    webRtcService.endCall();
  });

  it('Bug #1 & #9: acceptCall transitions to connecting (NOT premature connected) until media/ICE establishes', async () => {
    webRtcService.init(mockReceiver.id);
    vi.spyOn(webRtcService as any, 'setupLocalMedia').mockResolvedValue(null);

    // Simulate incoming call
    await webRtcService.handleIncomingSignal({
      type: 'call_signal',
      signal: 'initiate',
      senderId: mockCaller.id,
      targetUserId: mockReceiver.id,
      callType: 'audio',
      callerInfo: mockCaller
    });

    expect(webRtcService.getState()).toBe('incoming_ringing');

    // Receiver accepts call
    await webRtcService.acceptCall(false);

    // CRITICAL FIX ASSERTION: State must be 'connecting', NEVER premature 'connected' before SDP exchange!
    expect(webRtcService.getState()).toBe('connecting');

    // Simulating media connection (ontrack / ICE connection)
    (webRtcService as any).transitionToConnected();

    expect(webRtcService.getState()).toBe('connected');

    webRtcService.endCall();
  });

  it('Bug #3: video_toggle signal updates partnerVideoEnabled on receiver side', async () => {
    webRtcService.init(mockReceiver.id);
    let lastPartnerVideoState: boolean | undefined = undefined;

    const unsub = webRtcService.subscribe((_state, data) => {
      if (typeof data?.partnerVideoEnabled === 'boolean') {
        lastPartnerVideoState = data.partnerVideoEnabled;
      }
    });

    // Receive video_toggle signal from partner (camera turned off)
    await webRtcService.handleIncomingSignal({
      type: 'call_signal',
      signal: 'video_toggle',
      senderId: mockCaller.id,
      targetUserId: mockReceiver.id,
      callType: 'video',
      payload: { isVideoEnabled: false }
    });

    expect(lastPartnerVideoState).toBe(false);

    // Partner turns camera back on
    await webRtcService.handleIncomingSignal({
      type: 'call_signal',
      signal: 'video_toggle',
      senderId: mockCaller.id,
      targetUserId: mockReceiver.id,
      callType: 'video',
      payload: { isVideoEnabled: true }
    });

    expect(lastPartnerVideoState).toBe(true);

    unsub();
  });

  it('Bug #6: stopSignalingPoll does not clear processedSignals cache', async () => {
    webRtcService.init(mockCaller.id);
    const processedSet: Set<string> = (webRtcService as any).processedSignals;
    processedSet.add('test_signal_key_123');

    // Stopping signaling poll should not wipe out the processed deduplication set
    (webRtcService as any).stopSignalingPoll();

    expect(processedSet.has('test_signal_key_123')).toBe(true);
  });

  it('Bug #10: Glare protection prevents offer creation during unstable signaling state', async () => {
    webRtcService.init(mockCaller.id);
    (webRtcService as any).currentCallState = 'connected';
    (webRtcService as any).currentPartnerId = mockReceiver.id;
    (webRtcService as any).peerConnection = {
      signalingState: 'have-local-offer',
      createOffer: vi.fn()
    };

    // Toggle video when peerConnection is not stable
    const result = await webRtcService.toggleVideo();

    // Since peerConnection.signalingState !== 'stable', createOffer must NOT be invoked (glare prevented)
    expect((webRtcService as any).peerConnection.createOffer).not.toHaveBeenCalled();
    expect(typeof result).toBe('boolean');
  });
});
