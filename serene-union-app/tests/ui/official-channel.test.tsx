import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ChatScreen } from '../../src/components/ChatScreen';
import { dbService } from '../../src/services/dbService';

describe('UI & Behavioral Flow: Qurb Official Channel & Broadcasts', () => {
  const currentUser = {
    id: 'usr_me',
    fullName: 'Ahmed Farooq',
    gender: 'male' as const,
    dob: '1995-01-01',
    location: 'Lahore, Pakistan',
    profession: 'Software Engineer',
    education: 'BS',
    marriageTimeline: 'within_1_year' as const,
    bio: 'Test bio',
    photos: []
  };

  beforeEach(() => {
    localStorage.clear();
    dbService.setCurrentUser(currentUser);
  });

  it('1. Renders Qurb Official Channel in conversation list with verified badge', async () => {
    const officialConv = {
      id: 'conv_qurb_official_usr_me',
      participantOne: 'usr_me',
      participantTwo: 'usr_qurb_official',
      otherUser: {
        id: 'usr_qurb_official',
        fullName: 'Qurb Team ✓',
        photos: ['/icon.svg'],
        isVerified: true,
        isOfficial: true
      } as any,
      lastMessageText: '🚀 Update Alert: Qurb v1.0.37 is now live on Google Play Store!',
      lastMessageSenderId: 'usr_qurb_official',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      status: 'active' as const,
      isOfficial: true,
      messages: []
    };

    localStorage.setItem('serene_real_conversations_v3', JSON.stringify([officialConv]));

    render(
      <ChatScreen
        onBackToDiscover={vi.fn()}
      />
    );

    expect(screen.getByText(/Qurb Team/i)).toBeDefined();
    expect(screen.getByText(/Update Alert: Qurb v1.0.37/i)).toBeDefined();
  });

  it('2. Opening official channel hides call buttons, renders verified pill, Play Store CTA, and broadcast footer', async () => {
    const officialConv = {
      id: 'conv_qurb_official_usr_me',
      participantOne: 'usr_me',
      participantTwo: 'usr_qurb_official',
      otherUser: {
        id: 'usr_qurb_official',
        fullName: 'Qurb Team ✓',
        photos: ['/icon.svg'],
        isVerified: true,
        isOfficial: true
      } as any,
      lastMessageText: 'Official Announcements',
      lastMessageSenderId: 'usr_qurb_official',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      status: 'active' as const,
      isOfficial: true,
      messages: [
        {
          id: 'msg_ann_1',
          senderId: 'usr_qurb_official',
          senderName: 'Qurb Team ✓',
          text: 'Welcome to Qurb! Update to v1.0.37 on Google Play: https://play.google.com/store/apps/details?id=app.qurb.serene&pcampaignid=web_share',
          timestamp: 'Just now',
          isRead: true,
          waliNotified: false
        }
      ]
    };

    localStorage.setItem('serene_real_conversations_v3', JSON.stringify([officialConv]));
    localStorage.setItem('serene_msgs_conv_qurb_official_usr_me', JSON.stringify(officialConv.messages));

    render(
      <ChatScreen
        initialConvId="conv_qurb_official_usr_me"
        onBackToDiscover={vi.fn()}
      />
    );

    // Verify Verified Channel pill is displayed in header
    expect(screen.getByText(/Verified Channel/i)).toBeDefined();

    // Verify Call buttons and candidate Biodata action are NOT rendered
    expect(screen.queryByTitle(/Audio Call/i)).toBeNull();
    expect(screen.queryByTitle(/Video Call/i)).toBeNull();
    expect(screen.queryByTitle(/View Full Biodata/i)).toBeNull();

    // Verify Google Play Store button is rendered
    expect(screen.getByText(/Update on Google Play Store/i)).toBeDefined();

    // Verify official broadcast footer is displayed instead of standard chat input
    expect(screen.getByText(/This is an official announcement channel/i)).toBeDefined();
  });
});
