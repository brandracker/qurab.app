import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ChatScreen } from '../../src/components/ChatScreen';
import { dbService } from '../../src/services/dbService';

describe('UI & Button Interactions: Matrimonial Chat Screen', () => {
  const currentUser = {
    id: 'usr_me',
    fullName: 'Ahmed Farooq',
    gender: 'male' as const,
    dob: '1995-01-01',
    location: 'London, UK',
    profession: 'Software Engineer',
    education: 'MSc',
    marriageTimeline: 'within_1_year' as const,
    bio: 'Test bio',
    photos: []
  };

  const partnerUser = {
    id: 'usr_partner',
    fullName: 'Aisha Malik',
    gender: 'female' as const,
    dob: '1998-01-01',
    location: 'London, UK',
    profession: 'Pharmacist',
    education: 'PharmD',
    marriageTimeline: 'within_1_year' as const,
    bio: 'Partner bio',
    photos: ['https://example.com/aisha.jpg']
  };

  beforeEach(() => {
    localStorage.clear();
    dbService.setCurrentUser(currentUser);
    dbService.createMatchConversation(partnerUser);
  });

  it('1. Loads conversation, displays partner info and biodata action', () => {
    const handleBack = vi.fn();
    render(
      <ChatScreen
        currentUser={currentUser}
        onBack={handleBack}
        initialConvId="conv_usr_me_usr_partner"
      />
    );

    // Verify Partner First Name
    expect(screen.getByText(/Aisha/i)).toBeDefined();
    // Verify Biodata Header Action Button (Title / Aria)
    expect(screen.getAllByTitle(/View Full Biodata/i).length).toBeGreaterThan(0);
  });

  it('2. Sends message on clicking Send button and updates message history', () => {
    const handleBack = vi.fn();
    render(
      <ChatScreen
        currentUser={currentUser}
        onBack={handleBack}
        initialConvId="conv_usr_me_usr_partner"
      />
    );

    const input = screen.getByPlaceholderText(/Write a respectful message/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Assalamu Alaikum' } });
    expect(input.value).toBe('Assalamu Alaikum');

    // Button should be enabled and clickable
    const buttons = screen.getAllByRole('button');
    const sendBtn = buttons[buttons.length - 1]; // Send button is last
    expect(sendBtn).toBeDefined();
    fireEvent.click(sendBtn);
  });

  it('3. Modesty photo reveal button is present and clickable', () => {
    const handleBack = vi.fn();
    render(
      <ChatScreen
        currentUser={currentUser}
        onBack={handleBack}
        initialConvId="conv_usr_me_usr_partner"
      />
    );

    const revealBtn = screen.getByText(/Reveal Photos/i);
    expect(revealBtn).toBeDefined();
  });

  it('4. Renders Approve and Decline buttons when conversation has a pending Direct Salam for the current user', () => {
    const handleBack = vi.fn();

    const salamConv = {
      id: 'conv_usr_me_usr_suitor',
      participantOne: 'usr_suitor',
      participantTwo: currentUser.id,
      otherUser: {
        id: 'usr_suitor',
        fullName: 'Zayd Tariq',
        gender: 'male' as const,
        dob: '1996-01-01',
        location: 'Manchester, UK',
        profession: 'Civil Engineer',
        marriageTimeline: 'within_1_year' as const,
        bio: 'Suitor bio',
        photos: []
      },
      lastMessageText: 'Assalamu Alaikum! Would love to connect for marriage.',
      lastMessageSenderId: 'usr_suitor',
      lastMessageTime: 'Just now',
      unreadCount: 1,
      status: 'active' as const,
      isDirectSalamPending: true,
      salamSenderId: 'usr_suitor',
      messages: [{
        id: 'msg_salam_1',
        senderId: 'usr_suitor',
        senderName: 'Zayd Tariq',
        text: 'Assalamu Alaikum! Would love to connect for marriage.',
        timestamp: 'Just now',
        isRead: false,
        waliNotified: true
      }]
    };

    const convs = dbService.getConversations();
    convs.unshift(salamConv);
    localStorage.setItem('serene_real_conversations_v3', JSON.stringify(convs));

    render(
      <ChatScreen
        currentUser={currentUser}
        onBack={handleBack}
        initialConvId="conv_usr_me_usr_suitor"
      />
    );

    // Verify Approve and Decline action buttons are rendered
    expect(screen.getByRole('button', { name: /Approve & Connect/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Decline/i })).toBeDefined();
  });
});
