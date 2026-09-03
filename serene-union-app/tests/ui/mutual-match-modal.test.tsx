import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MutualMatchModal } from '../../src/components/MutualMatchModal';
import type { UserProfile } from '../../src/types';

describe('UI & Button Interactions: Mutual Match Celebration Modal', () => {
  const mockPartner: UserProfile = {
    id: 'usr_partner_1',
    fullName: 'Zainab Al-Hassan',
    email: 'zainab@test.com',
    gender: 'female',
    dob: '1998-05-15',
    location: 'Birmingham, UK',
    city: 'Birmingham',
    country: 'UK',
    profession: 'Architect',
    education: 'BSc Architecture',
    marriageTimeline: 'within_1_year',
    bio: 'Practicing Muslimah looking for a pious and caring spouse.',
    photos: ['https://example.com/zainab.jpg'],
    blurPhotosByDefault: false
  };

  const mockCurrentUser: UserProfile = {
    id: 'usr_me_1',
    fullName: 'Bilal Khan',
    email: 'bilal@test.com',
    gender: 'male',
    dob: '1995-02-10',
    location: 'London, UK',
    city: 'London',
    country: 'UK',
    profession: 'Software Engineer',
    education: 'MSc Computer Science',
    marriageTimeline: 'within_1_year',
    bio: 'Dedicated to deen and personal growth.',
    photos: ['https://example.com/bilal.jpg']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Renders blessed match celebration with Arabic Dua and partner name', () => {
    const handleStartChat = vi.fn();
    const handleClose = vi.fn();

    render(
      <MutualMatchModal
        profile={mockPartner}
        currentUser={mockCurrentUser}
        onStartChat={handleStartChat}
        onClose={handleClose}
      />
    );

    // Verify Title and Subheadings
    expect(screen.getByText(/Blessed Connection/i)).toBeDefined();
    expect(screen.getByText(/بَارَكَ اللَّهُ لَكُمَا/i)).toBeDefined();
    expect(screen.getByText(/Zainab/i)).toBeDefined();

    // Verify Action CTA
    expect(screen.getByRole('button', { name: /Begin Chaperoned Halal Conversation/i })).toBeDefined();
  });

  it('2. Clicking conversation button dispatches onStartChat callback', () => {
    const handleStartChat = vi.fn();
    const handleClose = vi.fn();

    render(
      <MutualMatchModal
        profile={mockPartner}
        currentUser={mockCurrentUser}
        onStartChat={handleStartChat}
        onClose={handleClose}
      />
    );

    const chatBtn = screen.getByRole('button', { name: /Begin Chaperoned Halal Conversation/i });
    fireEvent.click(chatBtn);

    expect(handleStartChat).toHaveBeenCalledTimes(1);
  });

  it('3. Clicking keep exploring dismisses the modal', () => {
    const handleStartChat = vi.fn();
    const handleClose = vi.fn();

    render(
      <MutualMatchModal
        profile={mockPartner}
        currentUser={mockCurrentUser}
        onStartChat={handleStartChat}
        onClose={handleClose}
      />
    );

    const exploreBtn = screen.getByRole('button', { name: /Keep Exploring Discover/i });
    fireEvent.click(exploreBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
