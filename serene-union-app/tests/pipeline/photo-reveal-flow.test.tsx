import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChatScreen } from '../../src/components/ChatScreen';
import { dbService } from '../../src/services/dbService';
import type { UserProfile, Conversation } from '../../src/types';

describe('Real-World Pipeline: 1-to-1 Modesty Photo Reveal Flow (Cloudflare D1 Live Source of Truth)', () => {
  const mockCurrentUser: UserProfile = {
    id: 'usr_brother_ahmed',
    fullName: 'Ahmed Tariq',
    email: 'ahmed@example.com',
    gender: 'male',
    dob: '1995-04-10',
    age: 31,
    location: 'London, UK',
    city: 'London',
    country: 'United Kingdom',
    profession: 'Software Engineer',
    education: 'BSc Computer Science',
    marriageTimeline: 'within_1_year',
    bio: 'Practicing Sunnah.',
    photos: ['https://example.com/ahmed.jpg']
  };

  const mockPartner: UserProfile = {
    id: 'usr_sister_fatima',
    fullName: 'Fatima Al-Zahra',
    email: 'fatima@example.com',
    gender: 'female',
    dob: '1998-09-15',
    age: 28,
    location: 'London, UK',
    city: 'London',
    country: 'United Kingdom',
    profession: 'Architect',
    education: 'M.Arch',
    marriageTimeline: 'within_1_year',
    bio: 'Seeking pious partner.',
    blurPhotosByDefault: true,
    isPhotoRevealed: false,
    hasRevealedToPartner: false,
    photos: ['https://example.com/fatima_photo.jpg']
  };

  const testConvId = 'conv_usr_brother_ahmed_usr_sister_fatima';

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    dbService.setCurrentUser(mockCurrentUser);
    dbService.createMatchConversation(mockPartner);
  });

  it('1. Toggling Reveal Photos triggers live togglePhotoRevealLive API call and updates quick bar text', async () => {
    const liveRevealSpy = vi.spyOn(dbService, 'togglePhotoRevealLive').mockResolvedValue(true);

    render(
      <ChatScreen
        currentUser={mockCurrentUser}
        initialConvId={testConvId}
      />
    );

    // Initial state: Blurred
    expect(screen.getByText(/Modesty Shield: Your photos are blurred/i)).toBeDefined();
    const revealBtn = screen.getByRole('button', { name: /reveal photos/i });
    expect(revealBtn).toBeDefined();

    // Click "Reveal Photos"
    fireEvent.click(revealBtn);

    // Verify togglePhotoRevealLive was called with true
    expect(liveRevealSpy).toHaveBeenCalledWith(
      expect.stringContaining('conv_'),
      mockCurrentUser.id,
      mockPartner.id,
      true
    );

    // Quick bar should now indicate photos are unblurred
    await waitFor(() => {
      expect(screen.getByText(/Your photos are unblurred for Fatima/i)).toBeDefined();
    });
  });

  it('2. Partner avatar photo is blurred when isPhotoRevealed is false and blurPhotosByDefault is true', () => {
    const blurredPartner: UserProfile = {
      ...mockPartner,
      blurPhotosByDefault: true,
      isPhotoRevealed: false
    };

    render(
      <ChatScreen
        currentUser={mockCurrentUser}
        initialConvId={testConvId}
      />
    );

    const partnerAvatarImg = screen.getByAltText(blurredPartner.fullName);
    expect(partnerAvatarImg).toBeDefined();
    expect(partnerAvatarImg.className).toContain('blur-xs');
  });

  it('3. Partner avatar photo is unblurred when live conversation reports isPhotoRevealed = true', () => {
    const revealedPartner: UserProfile = {
      ...mockPartner,
      blurPhotosByDefault: true,
      isPhotoRevealed: true
    };

    // Pre-seed conversation with partner having isPhotoRevealed = true
    const conv: Conversation = {
      id: testConvId,
      participantOne: mockCurrentUser.id,
      participantTwo: mockPartner.id,
      lastMessageText: 'Photos revealed',
      lastMessageSenderId: 'system',
      lastMessageTime: new Date().toLocaleTimeString(),
      unreadCount: 0,
      status: 'active',
      messages: [],
      hasRevealedToPartner: false,
      isPhotoRevealed: true,
      otherUser: revealedPartner
    };

    localStorage.setItem('serene_conversations_v1', JSON.stringify([conv]));
    localStorage.setItem('serene_real_conversations_v3', JSON.stringify([conv]));

    render(
      <ChatScreen
        currentUser={mockCurrentUser}
        initialConvId={testConvId}
      />
    );

    const partnerAvatarImg = screen.getByAltText(revealedPartner.fullName);
    expect(partnerAvatarImg).toBeDefined();
    expect(partnerAvatarImg.className).not.toContain('blur-xs');
    expect(partnerAvatarImg.className).toContain('scale-100');
  });
});
