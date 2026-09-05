import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DiscoverFeed } from '../../src/components/DiscoverFeed';
import { dbService } from '../../src/services/dbService';
import { notificationService } from '../../src/services/notificationService';
import type { UserProfile } from '../../src/types';

describe('Real-World Pipeline: Discover Swipe Deck Clamping & Stability', () => {
  const mockCurrentUser: UserProfile = {
    id: 'usr_viewer_999',
    fullName: 'Hamza Farooqi',
    email: 'hamza@example.com',
    gender: 'male',
    dob: '1992-01-01',
    age: 34,
    location: 'London, UK',
    city: 'London',
    country: 'UK',
    profession: 'Software Engineer',
    education: 'BSc Computer Science',
    marriageTimeline: 'within_1_year',
    bio: 'Looking for a pious spouse.',
    photos: []
  };

  const createMockCandidate = (id: string, name: string, profession: string): UserProfile => ({
    id,
    fullName: name,
    email: `${id}@example.com`,
    gender: 'female',
    dob: '1996-05-10',
    age: 30,
    location: 'London, UK',
    city: 'London',
    country: 'UK',
    profession,
    education: 'BSc',
    marriageTimeline: 'within_1_year',
    bio: 'Committed to Islamic values and growth.',
    photos: [`https://example.com/${id}.jpg`],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  });

  const candidates: UserProfile[] = [
    createMockCandidate('c1', 'Amina Sheikh', 'Pharmacist'),
    createMockCandidate('c2', 'Layla Mahmoud', 'Graphic Designer'),
    createMockCandidate('c3', 'Zainab Qureshi', 'Consultant')
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    dbService.setCurrentUser(mockCurrentUser);
    localStorage.setItem('serene_real_profiles_v3', JSON.stringify(candidates));
    vi.spyOn(dbService, 'fetchLiveProfiles').mockResolvedValue(candidates);
    vi.spyOn(notificationService, 'syncLiveNotifications').mockImplementation(() => {});
  });

  it('1. Swiping or liking removes card and clamps index without causing out-of-bounds error', async () => {
    const handleOpenChat = vi.fn();
    const handleOpenMatches = vi.fn();

    render(
      <DiscoverFeed
        onOpenChat={handleOpenChat}
        onOpenMatches={handleOpenMatches}
      />
    );

    // Initial candidate Amina should be displayed
    expect(await screen.findByText(/Amina, 30/i)).toBeDefined();

    // Find Like button (aria-label="Connect")
    const likeBtn = screen.getByRole('button', { name: /Connect/i });
    fireEvent.click(likeBtn);

    // Deck advances to candidate 2: Layla
    expect(await screen.findByText(/Layla, 30/i)).toBeDefined();

    // Like candidate 2
    fireEvent.click(screen.getByRole('button', { name: /Connect/i }));

    // Deck advances to candidate 3: Zainab
    expect(await screen.findByText(/Zainab, 30/i)).toBeDefined();

    // Like candidate 3 (last candidate in array)
    fireEvent.click(screen.getByRole('button', { name: /Connect/i }));

    // Gracefully shows catch up empty state without throw
    await waitFor(() => {
      expect(screen.getByText(/No Profiles Found/i)).toBeDefined();
    });
  });

  it('2. Pass button advances the candidate queue gracefully', async () => {
    const handleOpenChat = vi.fn();
    const handleOpenMatches = vi.fn();

    render(
      <DiscoverFeed
        onOpenChat={handleOpenChat}
        onOpenMatches={handleOpenMatches}
      />
    );

    expect(await screen.findByText(/Amina, 30/i)).toBeDefined();

    // Find Pass button (aria-label="Pass")
    const passBtn = screen.getByRole('button', { name: /Pass/i });
    fireEvent.click(passBtn);

    // Candidate 2 is now shown
    expect(await screen.findByText(/Layla, 30/i)).toBeDefined();
  });
});
