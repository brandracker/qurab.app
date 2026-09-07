import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { App } from '../../src/App';
import { dbService } from '../../src/services/dbService';
import { notificationService } from '../../src/services/notificationService';
import type { UserProfile, Conversation } from '../../src/types';

describe('ISS-013 & ISS-014: Real-time Chat Sync & Distinct Navigation Badges', () => {
  const mockUser: UserProfile = {
    id: 'usr_me_active',
    phone: '+1555123456',
    fullName: 'Active Brother',
    dob: '1995-02-14',
    age: 31,
    gender: 'male',
    location: 'London, UK',
    city: 'London',
    country: 'United Kingdom',
    profession: 'Software Architect',
    education: 'MSc',
    height: "6'0\"",
    ethnicity: 'South Asian',
    marriageTimeline: 'within_1_year',
    bio: 'Practicing deen',
    blurPhotosByDefault: false,
    profileVisibility: 'all_users',
    photos: ['https://example.com/me.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    },
    isProfileCompleted: true
  };

  const mockCandidate: UserProfile = {
    id: 'usr_partner_msg',
    phone: '+1555987654',
    fullName: 'Sister Mariam',
    dob: '1998-07-20',
    age: 28,
    gender: 'female',
    location: 'London, UK',
    city: 'London',
    country: 'United Kingdom',
    profession: 'Pharmacist',
    education: 'PharmD',
    height: "5'5\"",
    ethnicity: 'Arab',
    marriageTimeline: 'within_1_year',
    bio: 'Seeking pious partner',
    blurPhotosByDefault: true,
    profileVisibility: 'all_users',
    photos: ['https://example.com/mariam.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    },
    isProfileCompleted: true
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/conversations')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, conversations: [] })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
    });
    dbService.setCurrentUser(mockUser);
    notificationService.clearAll();
  });

  afterEach(() => {
    cleanup();
  });

  it('1. Chat navigation tab renders real unread message count badge distinct from Matches tab', async () => {
    // 1. Create conversation with 2 unread messages
    const conv: Conversation = {
      id: 'conv_usr_me_active_usr_partner_msg',
      participantOne: mockUser.id,
      participantTwo: mockCandidate.id,
      otherUser: mockCandidate,
      lastMessageText: 'As-salamu alaykum!',
      lastMessageSenderId: mockCandidate.id,
      lastMessageTime: '10:00 AM',
      lastMessageTimestamp: Date.now(),
      unreadCount: 2,
      status: 'active',
      messages: []
    };
    localStorage.setItem('serene_real_conversations_v3', JSON.stringify([conv]));

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/conversations')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, conversations: [conv] })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
    });

    render(<App />);

    // Discover tab should be open by default for completed profile
    expect(screen.getByText(/Discover/i)).toBeTruthy();

    // Verify Chat navigation item displays unread badge "2"
    const chatBadge = await screen.findByText('2');
    expect(chatBadge).toBeTruthy();
    expect(chatBadge.className).toContain('bg-emerald-600');
  });

  it('2. Matches notification dot does not trigger Chat badge if there are no unread chats', async () => {
    // Zero unread chats
    localStorage.setItem('serene_real_conversations_v3', JSON.stringify([]));

    // Simulate Match notification
    notificationService.addNotification({
      id: 'notif_match_1',
      type: 'match',
      title: 'New Match!',
      message: 'You matched with Mariam',
      time: 'Just now',
      timestamp: Date.now(),
      read: false
    });

    render(<App />);

    // Unread count '1' or '2' should NOT appear on chat tab
    expect(screen.queryByText('1')).toBeNull();
    expect(screen.queryByText('2')).toBeNull();
  });
});
