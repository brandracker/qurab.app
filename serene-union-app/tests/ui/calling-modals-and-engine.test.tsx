import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IncomingCallModal } from '../../src/components/calling/IncomingCallModal';
import { ActiveCallModal } from '../../src/components/calling/ActiveCallModal';
import { webRtcService, type CallerInfo } from '../../src/services/webRtcService';

describe('Calling Modals & WebRTC Control Suite', () => {
  const mockCaller: CallerInfo = {
    id: 'usr_partner_1',
    fullName: 'Zainab Fatima',
    gender: 'female',
    city: 'Islamabad',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    isVip: true
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('IncomingCallModal UI & Action Wiring', () => {
    it('1. Renders caller profile, VIP badge, and Islamic modesty tag', () => {
      render(
        <IncomingCallModal
          isOpen={true}
          caller={mockCaller}
          callType="audio"
        />
      );

      expect(screen.getByText('Zainab Fatima')).toBeTruthy();
      expect(screen.getByText('Islamabad')).toBeTruthy();
      expect(screen.getByText('VIP')).toBeTruthy();
      expect(screen.getByText(/Incoming HD Voice Call/i)).toBeTruthy();
      expect(screen.getByText(/Wali & Modesty Protected Connection/i)).toBeTruthy();
    });

    it('2. Clicking Decline button triggers rejectCall with declined reason', () => {
      const rejectSpy = vi.spyOn(webRtcService, 'rejectCall').mockImplementation(() => {});

      render(
        <IncomingCallModal
          isOpen={true}
          caller={mockCaller}
          callType="audio"
        />
      );

      const declineBtn = screen.getByTestId('decline-call-btn');
      fireEvent.click(declineBtn);

      expect(rejectSpy).toHaveBeenCalledWith('declined');
    });

    it('3. Clicking Voice Accept button triggers acceptCall with false for video', () => {
      const acceptSpy = vi.spyOn(webRtcService, 'acceptCall').mockImplementation(async () => {});

      render(
        <IncomingCallModal
          isOpen={true}
          caller={mockCaller}
          callType="audio"
        />
      );

      const acceptBtn = screen.getByTestId('accept-call-btn');
      fireEvent.click(acceptBtn);

      expect(acceptSpy).toHaveBeenCalledWith(false);
    });

    it('4. Renders Accept Video button when callType is video and triggers acceptCall(true)', () => {
      const acceptSpy = vi.spyOn(webRtcService, 'acceptCall').mockImplementation(async () => {});

      render(
        <IncomingCallModal
          isOpen={true}
          caller={mockCaller}
          callType="video"
        />
      );

      expect(screen.getByText(/Incoming HD Video Call/i)).toBeTruthy();
      const acceptVideoBtn = screen.getByTestId('accept-video-call-btn');
      fireEvent.click(acceptVideoBtn);

      expect(acceptSpy).toHaveBeenCalledWith(true);
    });

    it('5. Does not render when isOpen is false', () => {
      const { container } = render(
        <IncomingCallModal
          isOpen={false}
          caller={mockCaller}
          callType="audio"
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('ActiveCallModal UI & Dock Button Wiring', () => {
    it('1. Renders partner details, Ringing state, and luxury dock buttons in outgoing call', () => {
      render(
        <ActiveCallModal
          isOpen={true}
          callState="outgoing_calling"
          callType="audio"
          partner={mockCaller}
        />
      );

      expect(screen.getAllByText('Zainab Fatima').length).toBeGreaterThan(0);
      expect(screen.getByText(/Ringing.../i)).toBeTruthy();
      expect(screen.getByTestId('mute-btn')).toBeTruthy();
      expect(screen.getByTestId('speaker-btn')).toBeTruthy();
      expect(screen.getByTestId('end-call-btn')).toBeTruthy();
    });

    it('2. Clicking Mute button triggers toggleMute on webRtcService', () => {
      const toggleMuteSpy = vi.spyOn(webRtcService, 'toggleMute').mockReturnValue(true);

      render(
        <ActiveCallModal
          isOpen={true}
          callState="connected"
          callType="audio"
          partner={mockCaller}
        />
      );

      const muteBtn = screen.getByTestId('mute-btn');
      fireEvent.click(muteBtn);

      expect(toggleMuteSpy).toHaveBeenCalled();
    });

    it('3. Clicking Speaker button toggles speakerphone state', () => {
      const speakerSpy = vi.spyOn(webRtcService, 'setSpeakerphoneOn').mockImplementation(() => {});

      render(
        <ActiveCallModal
          isOpen={true}
          callState="connected"
          callType="audio"
          partner={mockCaller}
        />
      );

      const speakerBtn = screen.getByTestId('speaker-btn');
      fireEvent.click(speakerBtn);

      expect(speakerSpy).toHaveBeenCalledWith(true);
    });

    it('4. Clicking End Call button triggers webRtcService.endCall with user_hung_up', () => {
      const endCallSpy = vi.spyOn(webRtcService, 'endCall').mockImplementation(() => {});

      render(
        <ActiveCallModal
          isOpen={true}
          callState="connected"
          callType="audio"
          partner={mockCaller}
        />
      );

      const endBtn = screen.getByTestId('end-call-btn');
      fireEvent.click(endBtn);

      expect(endCallSpy).toHaveBeenCalledWith('user_hung_up');
    });

    it('5. Renders Switch Camera and Toggle Video buttons on video call', async () => {
      const switchCamSpy = vi.spyOn(webRtcService, 'switchCamera').mockImplementation(async () => {});
      const toggleVidSpy = vi.spyOn(webRtcService, 'toggleVideo').mockImplementation(async () => false);

      render(
        <ActiveCallModal
          isOpen={true}
          callState="connected"
          callType="video"
          partner={mockCaller}
        />
      );

      const switchCamBtn = screen.getByTestId('switch-cam-btn');
      const toggleVidBtn = screen.getByTestId('toggle-video-btn');

      expect(switchCamBtn).toBeTruthy();
      expect(toggleVidBtn).toBeTruthy();

      await act(async () => {
        fireEvent.click(switchCamBtn);
      });
      expect(switchCamSpy).toHaveBeenCalled();

      await act(async () => {
        fireEvent.click(toggleVidBtn);
      });
      expect(toggleVidSpy).toHaveBeenCalled();
    });

    it('6. Renders Call Ended overlay with duration when callState is ended', () => {
      render(
        <ActiveCallModal
          isOpen={true}
          callState="ended"
          callType="audio"
          partner={mockCaller}
        />
      );

      const overlay = screen.getByTestId('call-ended-overlay');
      expect(overlay).toBeTruthy();
      expect(screen.getByText('Call Ended')).toBeTruthy();
    });
  });

  describe('WebRtcService Signaling Robustness', () => {
    it('1. Does not auto-reject duplicate initiate signal when already incoming_ringing from same partner', async () => {
      webRtcService.init('usr_receiver_1');
      const sendSignalSpy = vi.fn();
      webRtcService.init('usr_receiver_1', sendSignalSpy);

      // First initiate signal arrives
      await webRtcService.handleIncomingSignal({
        type: 'call_signal',
        signal: 'initiate',
        senderId: 'usr_partner_1',
        targetUserId: 'usr_receiver_1',
        callType: 'audio',
        callerInfo: mockCaller
      });

      expect(webRtcService.getState()).toBe('incoming_ringing');
      // Should have sent ringing acknowledgment, NOT reject
      expect(sendSignalSpy).toHaveBeenCalledWith(expect.objectContaining({ signal: 'ringing' }));
      expect(sendSignalSpy).not.toHaveBeenCalledWith(expect.objectContaining({ signal: 'reject' }));

      // Clear spy calls and send duplicate initiate (simulating multi-stage push or polling)
      sendSignalSpy.mockClear();
      await webRtcService.handleIncomingSignal({
        type: 'call_signal',
        signal: 'initiate',
        senderId: 'usr_partner_1',
        targetUserId: 'usr_receiver_1',
        callType: 'audio',
        callerInfo: mockCaller
      });

      // Crucial assertion: Duplicate MUST NOT send reject signal!
      expect(sendSignalSpy).not.toHaveBeenCalledWith(expect.objectContaining({ signal: 'reject' }));
      expect(webRtcService.getState()).toBe('incoming_ringing');

      // Cleanup
      webRtcService.endCall();
    });

    it('2. Ignores reject signal from stranger or third party', async () => {
      webRtcService.init('usr_caller_1');
      const triggerLogSpy = vi.spyOn(webRtcService as any, 'triggerCallHistoryLog');

      // Caller places call to mockCaller
      vi.spyOn(webRtcService as any, 'setupLocalMedia').mockResolvedValue(null);
      await webRtcService.startCall('usr_partner_1', mockCaller, 'audio', {
        id: 'usr_caller_1',
        fullName: 'Waleed Khan',
        gender: 'male',
        city: 'Lahore'
      });

      expect(webRtcService.getState()).toBe('outgoing_calling');

      // Stale reject arrives from unknown user
      await webRtcService.handleIncomingSignal({
        type: 'call_signal',
        signal: 'reject',
        senderId: 'usr_stranger_999',
        targetUserId: 'usr_caller_1',
        callType: 'audio',
        payload: { reason: 'busy' }
      });

      // Call state must REMAIN outgoing_calling, not ended
      expect(webRtcService.getState()).toBe('outgoing_calling');

      // Cleanup
      webRtcService.endCall();
    });
  });
});
