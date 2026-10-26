import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChatScreen } from '../../src/components/ChatScreen';
import { dbService } from '../../src/services/dbService';

describe('Call History in Chat Messages', () => {
  const mockUser = {
    id: 'usr_me',
    fullName: 'Farhan Ahmad',
    gender: 'male',
    location: 'Lahore',
    isVip: true,
    blurPhotosByDefault: false,
    photos: []
  };

  const mockPartner = {
    id: 'usr_partner',
    fullName: 'Ayesha Khan',
    gender: 'female',
    location: 'Karachi',
    isVip: false,
    blurPhotosByDefault: false,
    photos: []
  };

  beforeEach(() => {
    localStorage.clear();
    dbService.setCurrentUser(mockUser as any);
  });

  it('1. dbService.recordCallMessage correctly formats completed audio call and persists to conversation', async () => {
    const conv = dbService.createMatchConversation(mockPartner as any);
    const msg = await dbService.recordCallMessage(
      conv.id,
      mockUser.id,
      mockUser.fullName,
      'audio',
      'completed',
      125 // 2m 5s
    );

    expect(msg.mediaType).toBe('call_log');
    expect(msg.mediaDuration).toBe(125);
    expect(msg.text).toContain('📞 Audio Call (2m 5s)');

    const updatedConvs = dbService.getConversations();
    const updated = updatedConvs.find(c => c.id === conv.id);
    expect(updated?.lastMessageText).toContain('📞 Audio Call (2m 5s)');
    expect(updated?.messages.some(m => m.id === msg.id)).toBe(true);
  });

  it('2. dbService.recordCallMessage correctly formats missed video call', async () => {
    const conv = dbService.createMatchConversation(mockPartner as any);
    const msg = await dbService.recordCallMessage(
      conv.id,
      mockUser.id,
      mockUser.fullName,
      'video',
      'missed',
      0
    );

    expect(msg.mediaType).toBe('call_log');
    expect(msg.text).toContain('📹 Missed Video Call');
  });

  it('3. ChatScreen renders the WhatsApp-style call bubble and call-back button', async () => {
    const conv = dbService.createMatchConversation(mockPartner as any);
    await dbService.recordCallMessage(
      conv.id,
      mockUser.id,
      mockUser.fullName,
      'audio',
      'completed',
      90
    );

    render(<ChatScreen initialConvId={conv.id} onBackToDiscover={vi.fn()} />);

    // Outgoing call text for the caller
    expect(screen.getByText(/Outgoing Audio Call/i)).toBeTruthy();
    expect(screen.getByText(/1:30/i)).toBeTruthy();
    expect(screen.getByTitle(/Call back/i)).toBeTruthy();
  });
});
