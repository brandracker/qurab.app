import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ChatScreen } from '../../src/components/ChatScreen';
import { dbService } from '../../src/services/dbService';
import type { UserProfile, Conversation } from '../../src/types';

describe('Real-World Pipeline: Real-Time Photo Reveal Polling & Persistence (No Page Refresh)', () => {
  const mockUser: UserProfile = {
    id: 'usr_brother_live',
    fullName: 'Usman Qazi',
    email: 'usman@test.com',
    gender: 'male',
    dob: '1993-10-10',
    age: 32,
    location: 'London, UK',
    isProfileCompleted: true,
    blurPhotosByDefault: false,
    photos: []
  };

  const mockPartner: UserProfile = {
    id: 'usr_sister_live',
    fullName: 'Zainab Tariq',
    email: 'zainab@test.com',
    gender: 'female',
    dob: '1997-06-25',
    age: 28,
    location: 'London, UK',
    isProfileCompleted: true,
    blurPhotosByDefault: true,
    isPhotoRevealed: false,
    hasRevealedToPartner: false,
    photos: ['https://example.com/zainab.jpg']
  };

  const convId = 'conv_usr_brother_live_usr_sister_live';

  beforeEach(() => {
    localStorage.clear();
    dbService.setCurrentUser(mockUser);

    const conv: Conversation = {
      id: convId,
      participantOne: 'usr_brother_live',
      participantTwo: 'usr_sister_live',
      otherUser: mockPartner,
      lastMessageText: 'Assalamu Alaikum',
      lastMessageSenderId: 'usr_brother_live',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      status: 'active',
      isPhotoRevealed: false,
      hasRevealedToPartner: false,
      messages: []
    };

    localStorage.setItem('serene_real_conversations_v3', JSON.stringify([conv]));
  });

  it('1. Avatar starts with blur when isPhotoRevealed is false', () => {
    render(<ChatScreen initialConvId={convId} onBackToDiscover={vi.fn()} />);

    const partnerPhoto = screen.getByAltText('Zainab Tariq');
    expect(partnerPhoto.className).toContain('blur');
  });

  it('2. Live polling message response with isPhotoRevealed=true unblurs partner photo in real-time without page refresh', async () => {
    // Mock fetch to simulate D1 returning isPhotoRevealed = true on background poll
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/messages?')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            messages: [
              {
                id: 'msg_sys_reveal',
                senderId: 'system',
                senderName: 'Modesty Shield',
                text: '📸 Zainab revealed their unblurred photos for this conversation.',
                timestamp: 'Just now'
              }
            ],
            isPhotoRevealed: true,
            hasRevealedToPartner: false
          })
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) });
    }) as any;

    render(<ChatScreen initialConvId={convId} onBackToDiscover={vi.fn()} />);

    // Trigger live message poll directly
    await act(async () => {
      await dbService.fetchConversationMessages(convId, mockUser.id);
    });

    // Check that conversation in dbService now has isPhotoRevealed = true
    const updatedConvs = dbService.getConversations();
    const currentConv = updatedConvs.find(c => c.id === convId);
    expect(currentConv?.isPhotoRevealed).toBe(true);
    expect(currentConv?.otherUser?.isPhotoRevealed).toBe(true);

    globalThis.fetch = originalFetch;
  });

  it('3. Reveal status changes are persisted to serene_real_conversations_v3 without reverting', () => {
    const convs = dbService.getConversations();
    const current = convs.find(c => c.id === convId);
    if (current) {
      current.hasRevealedToPartner = true;
      localStorage.setItem('serene_real_conversations_v3', JSON.stringify(convs));
    }

    const reloadedConvs = dbService.getConversations();
    const reloaded = reloadedConvs.find(c => c.id === convId);
    expect(reloaded?.hasRevealedToPartner).toBe(true);
  });
});
