import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatScreen } from '../../src/components/ChatScreen';
import { dbService } from '../../src/services/dbService';
import type { UserProfile, Conversation } from '../../src/types';

describe('Real-World Pipeline: Chat Sorting & Unread Highlights', () => {
  const mockCurrentUser: UserProfile = {
    id: 'usr_me_1',
    fullName: 'Bilal Ahmed',
    email: 'bilal@test.com',
    gender: 'male',
    dob: '1995-01-01',
    age: 31,
    location: 'London, UK',
    isProfileCompleted: true,
    blurPhotosByDefault: false,
    photos: ['https://example.com/bilal.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  };

  const candidate1: UserProfile = {
    id: 'usr_cand_1',
    fullName: 'Aisha Al-Mansoor',
    email: 'aisha@test.com',
    gender: 'female',
    dob: '1998-04-15',
    age: 28,
    location: 'London, UK',
    isProfileCompleted: true,
    blurPhotosByDefault: true,
    photos: ['https://example.com/aisha.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  };

  const candidate2: UserProfile = {
    id: 'usr_cand_2',
    fullName: 'Maryam Khan',
    email: 'maryam@test.com',
    gender: 'female',
    dob: '1999-01-10',
    age: 27,
    location: 'Dubai, UAE',
    isProfileCompleted: true,
    blurPhotosByDefault: true,
    photos: ['https://example.com/maryam.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  };

  beforeEach(() => {
    localStorage.clear();
    dbService.setCurrentUser(mockCurrentUser);

    // Seed two conversations:
    // Conv 1: Older message (timestamp: 1000)
    // Conv 2: Newer message with unread reply (timestamp: 5000, unreadCount: 1, sender: candidate2)
    const conv1: Conversation = {
      id: 'conv_usr_me_1_usr_cand_1',
      participantOne: 'usr_me_1',
      participantTwo: 'usr_cand_1',
      otherUser: candidate1,
      lastMessageText: 'Earlier message with Aisha',
      lastMessageSenderId: 'usr_me_1',
      lastMessageTime: '10:00 AM',
      lastMessageTimestamp: 1000,
      unreadCount: 0,
      status: 'active',
      messages: []
    };

    const conv2: Conversation = {
      id: 'conv_usr_me_1_usr_cand_2',
      participantOne: 'usr_me_1',
      participantTwo: 'usr_cand_2',
      otherUser: candidate2,
      lastMessageText: 'New reply from Maryam',
      lastMessageSenderId: 'usr_cand_2',
      lastMessageTime: '11:30 AM',
      lastMessageTimestamp: 5000,
      unreadCount: 1,
      status: 'active',
      messages: []
    };

    // Stored in default key
    localStorage.setItem('serene_real_conversations_v3', JSON.stringify([conv1, conv2]));
  });

  it('1. Conversations list dynamically sorts with the most recently active conversation at the top', () => {
    render(<ChatScreen onBackToDiscover={vi.fn()} />);

    // Maryam has timestamp 5000, Aisha has 1000 -> Maryam must appear before Aisha in the DOM
    const conversationTitles = screen.getAllByRole('heading', { level: 3 });
    expect(conversationTitles[0].textContent).toContain('Maryam Khan');
    expect(conversationTitles[1].textContent).toContain('Aisha Al-Mansoor');
  });

  it('2. Unread incoming messages display the unread badge, "New Reply" pill, and card highlight', () => {
    render(<ChatScreen onBackToDiscover={vi.fn()} />);

    // Maryam has unread reply
    expect(screen.getByText('New Reply')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('New reply from Maryam')).toBeDefined();
  });

  it('3. Selecting an unread conversation marks it as read and clears unread indicators', () => {
    render(<ChatScreen onBackToDiscover={vi.fn()} />);

    const messagePreview = screen.getByText('New reply from Maryam');
    fireEvent.click(messagePreview);

    // After clicking, conversation opens and unreadCount should be cleared in storage
    const updatedConvs = dbService.getConversations();
    const maryamConv = updatedConvs.find(c => c.id === 'conv_usr_me_1_usr_cand_2');
    expect(maryamConv?.unreadCount).toBe(0);
  });
});
