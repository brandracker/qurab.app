import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatchesLikedYouScreen } from '../../src/components/MatchesLikedYouScreen';
import { dbService } from '../../src/services/dbService';
import type { UserProfile } from '../../src/types';

describe('Real-World Pipeline: Mutual Matches to Active Chat Flow', () => {
  const mockCurrentUser: UserProfile = {
    id: 'usr_me_777',
    fullName: 'Bilal Ahmad',
    email: 'bilal@example.com',
    gender: 'male',
    dob: '1992-05-10',
    age: 34,
    location: 'London, UK',
    city: 'London',
    country: 'UK',
    profession: 'Civil Engineer',
    education: 'BEng Civil Engineering',
    marriageTimeline: 'within_1_year',
    bio: 'Looking for a pious partner.',
    photos: []
  };

  const mockMutualPartner: UserProfile = {
    id: 'usr_mutual_888',
    fullName: 'Safiyyah Al-Mansoor',
    email: 'safiyyah@example.com',
    gender: 'female',
    dob: '1996-08-15',
    age: 30,
    location: 'Manchester, UK',
    city: 'Manchester',
    country: 'UK',
    profession: 'Architect',
    education: 'MArch Architecture',
    marriageTimeline: 'within_1_year',
    bio: 'Dedicated to faith, family, and art.',
    photos: ['https://example.com/safiyyah.jpg']
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    dbService.setCurrentUser(mockCurrentUser);

    // Mock dbService methods for match hub
    vi.spyOn(dbService, 'fetchLikedYouCandidates').mockResolvedValue([]);
    vi.spyOn(dbService, 'fetchMutualMatches').mockResolvedValue([mockMutualPartner]);
    vi.spyOn(dbService, 'fetchActivityHub').mockResolvedValue({
      sentLikes: [],
      passed: [],
      blocked: []
    });
  });

  it('1. Mutual match card click directly triggers createMatchConversation and routes to active chat', async () => {
    const handleOpenChat = vi.fn();
    const handleOpenDiscover = vi.fn();

    render(
      <MatchesLikedYouScreen
        onOpenChat={handleOpenChat}
        onOpenDiscover={handleOpenDiscover}
      />
    );

    // Switch to Mutual Matches tab
    await waitFor(() => {
      expect(screen.getByText(/Mutual/i)).toBeDefined();
    });

    const mutualTabBtn = screen.getByRole('button', { name: /Mutual/i });
    fireEvent.click(mutualTabBtn);

    // Verify mutual partner card is displayed
    await waitFor(() => {
      expect(screen.getByText('Safiyyah Al-Mansoor')).toBeDefined();
    });

    // Click anywhere on the mutual card
    const cardText = screen.getByText('Safiyyah Al-Mansoor');
    fireEvent.click(cardText);

    // Expect onOpenChat to have been called with conversation ID
    expect(handleOpenChat).toHaveBeenCalledWith(
      expect.stringContaining('conv_')
    );
  });

  it('2. Clicking the Eye icon on mutual match card opens biodata modal without opening chat', async () => {
    const handleOpenChat = vi.fn();
    const handleOpenDiscover = vi.fn();

    render(
      <MatchesLikedYouScreen
        onOpenChat={handleOpenChat}
        onOpenDiscover={handleOpenDiscover}
      />
    );

    const mutualTabBtn = screen.getByRole('button', { name: /Mutual/i });
    fireEvent.click(mutualTabBtn);

    await waitFor(() => {
      expect(screen.getByText('Safiyyah Al-Mansoor')).toBeDefined();
    });

    // Find Eye button
    const eyeBtn = screen.getByTitle('View Full Profile');
    fireEvent.click(eyeBtn);

    // Biodata detail should open, onOpenChat should NOT have been called
    expect(handleOpenChat).not.toHaveBeenCalled();
    // Profile modal details are rendered
    await waitFor(() => {
      expect(screen.getByText(/Matrimonial Profile/i)).toBeDefined();
    });
  });

  it('3. Clicking Chat button directly invokes onOpenChat', async () => {
    const handleOpenChat = vi.fn();
    const handleOpenDiscover = vi.fn();

    render(
      <MatchesLikedYouScreen
        onOpenChat={handleOpenChat}
        onOpenDiscover={handleOpenDiscover}
      />
    );

    const mutualTabBtn = screen.getByRole('button', { name: /Mutual/i });
    fireEvent.click(mutualTabBtn);

    await waitFor(() => {
      expect(screen.getByText('Safiyyah Al-Mansoor')).toBeDefined();
    });

    const chatBtn = screen.getByRole('button', { name: /Chat/i });
    fireEvent.click(chatBtn);

    expect(handleOpenChat).toHaveBeenCalledWith(
      expect.stringContaining('conv_')
    );
  });
});
