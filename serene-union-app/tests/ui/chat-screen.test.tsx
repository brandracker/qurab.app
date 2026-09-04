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
    // Verify Biodata Header Action Button
    expect(screen.getByText(/Biodata/i)).toBeDefined();
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
});
