import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ChatScreen } from '../../src/components/ChatScreen';
import { dbService } from '../../src/services/dbService';
import type { UserProfile, ChatMessage } from '../../src/types';

describe('Real-World Pipeline: Cloudflare D1 Chat Message Integration Flow', () => {
  const mockCurrentUser: UserProfile = {
    id: 'usr_me_101',
    fullName: 'Zayd Al-Ansari',
    email: 'zayd@example.com',
    gender: 'male',
    dob: '1995-03-15',
    age: 31,
    location: 'London, UK',
    city: 'London',
    country: 'UK',
    profession: 'Software Architect',
    education: 'MSc Computer Science',
    marriageTimeline: 'within_1_year',
    bio: 'Dedicated Muslim practicing Sunnah.',
    photos: ['https://example.com/zayd.jpg']
  };

  const mockPartner: UserProfile = {
    id: 'usr_partner_202',
    fullName: 'Fatima Al-Rashid',
    email: 'fatima@example.com',
    gender: 'female',
    dob: '1997-06-20',
    age: 29,
    location: 'Houston, USA',
    city: 'Houston',
    country: 'USA',
    profession: 'Data Analyst',
    education: 'BSc Statistics',
    marriageTimeline: 'within_1_year',
    bio: 'Seeking someone committed to faith.',
    photos: ['https://example.com/fatima.jpg']
  };

  const testConvId = 'conv_usr_me_101_usr_partner_202';

  const mockD1Messages: ChatMessage[] = [
    {
      id: 'msg_d1_001',
      senderId: mockPartner.id,
      senderName: mockPartner.fullName,
      text: 'As-salamu alaykum wa Rahmatullah',
      timestamp: '10:00 AM',
      isRead: true,
      waliNotified: true
    },
    {
      id: 'msg_d1_002',
      senderId: mockCurrentUser.id,
      senderName: mockCurrentUser.fullName,
      text: 'Wa alaykum as-salam, nice to connect with you!',
      timestamp: '10:05 AM',
      isRead: true,
      waliNotified: true
    }
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    dbService.setCurrentUser(mockCurrentUser);
    dbService.createMatchConversation(mockPartner);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1. dbService.fetchConversationMessages fetches messages from Cloudflare D1 endpoint', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        messages: [
          {
            id: 'msg_remote_999',
            sender_id: mockPartner.id,
            sender_name: mockPartner.fullName,
            message_text: 'Live D1 message direct from database',
            created_at: new Date().toISOString()
          }
        ]
      })
    } as Response);

    const messages = await dbService.fetchConversationMessages(testConvId);

    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining(`/conversations/${testConvId}/messages`));
    expect(messages.length).toBe(1);
    expect(messages[0].text).toBe('Live D1 message direct from database');
    expect(messages[0].senderId).toBe(mockPartner.id);
  });

  it('2. ChatScreen renders live messages returned from Cloudflare D1 without depending on local storage messages', async () => {
    vi.spyOn(dbService, 'fetchConversationMessages').mockResolvedValue(mockD1Messages);

    render(<ChatScreen currentUser={mockCurrentUser} initialConvId={testConvId} />);

    // Wait for the live D1 messages to render
    await waitFor(() => {
      expect(screen.getByText('As-salamu alaykum wa Rahmatullah')).toBeDefined();
      expect(screen.getByText('Wa alaykum as-salam, nice to connect with you!')).toBeDefined();
    });

    // Partner name should be clearly visible in header
    expect(screen.getByText(/Fatima/i)).toBeDefined();
  });

  it('3. Sending a message in ChatScreen dispatches to live API and displays immediately', async () => {
    vi.spyOn(dbService, 'fetchConversationMessages').mockResolvedValue(mockD1Messages);

    const postSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: {
          id: 'msg_new_sent',
          sender_id: mockCurrentUser.id,
          sender_name: mockCurrentUser.fullName,
          message_text: 'Looking forward to our respectful matrimonial discussion',
          created_at: new Date().toISOString()
        }
      })
    } as Response);

    render(<ChatScreen currentUser={mockCurrentUser} initialConvId={testConvId} />);

    await waitFor(() => {
      expect(screen.getByText('As-salamu alaykum wa Rahmatullah')).toBeDefined();
    });

    const input = screen.getByPlaceholderText(/Write a respectful message/i);
    fireEvent.change(input, { target: { value: 'Looking forward to our respectful matrimonial discussion' } });

    const buttons = screen.getAllByRole('button');
    const sendBtn = buttons[buttons.length - 1];
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText('Looking forward to our respectful matrimonial discussion')).toBeDefined();
    });

    // Verify POST was dispatched to messages endpoint
    expect(postSpy).toHaveBeenCalledWith(
      expect.stringContaining(`/conversations/${testConvId}/messages`),
      expect.objectContaining({
        method: 'POST'
      })
    );
  });
});
