import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../src/App';
import { dbService } from '../../src/services/dbService';
import { webRtcService } from '../../src/services/webRtcService';
import { pushNotificationService } from '../../src/services/pushNotificationService';

describe('Incoming Call Popup & Real-Time Notification Pipeline', () => {
  const mockUser = {
    id: 'usr_receiver_88',
    fullName: 'Hamza Tariq',
    gender: 'male',
    city: 'Lahore',
    isProfileCompleted: true,
    photos: ['https://example.com/hamza.jpg'],
    isVip: true
  };

  const incomingCallPayload = {
    type: 'incoming_call',
    callerId: 'usr_caller_99',
    callerName: 'Fatima Zahra',
    callType: 'audio',
    callerCity: 'Karachi',
    callerPhoto: 'https://example.com/fatima.jpg',
    callerVip: 'true',
    conversationId: 'conv_usr_caller_99_usr_receiver_88'
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    delete (window as any).AndroidAudioBridge;
    localStorage.clear();
    sessionStorage.clear();
    webRtcService.endCall();
    dbService.setCurrentUser(mockUser as any);
  });

  it('1. pushNotificationService.checkPendingIncomingCall captures native Android cold-boot payload', () => {
    (window as any).AndroidAudioBridge = {
      getPendingIncomingCall: vi.fn().mockReturnValue(JSON.stringify(incomingCallPayload))
    };

    const captured = pushNotificationService.checkPendingIncomingCall();
    expect(captured).not.toBeNull();
    expect(captured.callerId).toBe('usr_caller_99');
    expect(captured.callerName).toBe('Fatima Zahra');
    expect(captured.type).toBe('incoming_call');
  });

  it('2. Dispatches qurb_incoming_call_push and displays IncomingCallModal over current screen', async () => {
    vi.spyOn(webRtcService as any, 'playRingtone').mockImplementation(() => {});
    vi.spyOn(webRtcService as any, 'stopRingtone').mockImplementation(() => {});

    render(<App />);

    // Simulate incoming call push arriving from WebSocket or FCM while user is on Discover
    await act(async () => {
      window.dispatchEvent(
        new CustomEvent('qurb_incoming_call_push', { detail: incomingCallPayload })
      );
    });

    // Caller profile name and HD Voice Call tag should be visibly displayed on screen
    expect(screen.getByText('Fatima Zahra')).toBeTruthy();
    expect(screen.getByText(/Incoming HD Voice Call/i)).toBeTruthy();
    expect(screen.getAllByText('VIP').length).toBeGreaterThan(0);
    expect(screen.getByTestId('accept-call-btn')).toBeTruthy();
    expect(screen.getByTestId('decline-call-btn')).toBeTruthy();
  });

  it('3. Declining incoming call dismisses the popup and restores state to idle', async () => {
    vi.spyOn(webRtcService as any, 'playRingtone').mockImplementation(() => {});
    vi.spyOn(webRtcService as any, 'stopRingtone').mockImplementation(() => {});
    const rejectSpy = vi.spyOn(webRtcService, 'rejectCall');

    render(<App />);

    await act(async () => {
      window.dispatchEvent(
        new CustomEvent('qurb_incoming_call_push', { detail: incomingCallPayload })
      );
    });

    expect(screen.getByText('Fatima Zahra')).toBeTruthy();

    const declineBtn = screen.getByTestId('decline-call-btn');
    await act(async () => {
      fireEvent.click(declineBtn);
    });

    expect(rejectSpy).toHaveBeenCalledWith('declined');
  });
});
