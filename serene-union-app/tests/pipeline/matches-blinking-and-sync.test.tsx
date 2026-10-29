import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { MatchesLikedYouScreen } from '../../src/components/MatchesLikedYouScreen';
import { dbService } from '../../src/services/dbService';

describe('Matches Blinking Elimination, Silent Sync, Auto-Match & Guest Migration Tests', () => {
  const mockUser = {
    id: 'usr_active_member',
    fullName: 'Hamza Khan',
    email: 'hamza@test.com',
    gender: 'male' as const,
    dob: '1995-01-01',
    location: 'Manchester, UK',
    profession: 'Software Engineer',
    education: 'MSc',
    marriageTimeline: 'within_1_year' as const,
    bio: 'Practicing Muslim engineer',
    photos: []
  };

  const mockCandidate = {
    id: 'usr_suitor_candidate_1',
    fullName: 'Amina Tariq',
    email: 'amina@test.com',
    gender: 'female' as const,
    dob: '1997-01-01',
    age: 27,
    location: 'London, UK',
    profession: 'Doctor',
    education: 'MBBS',
    marriageTimeline: 'within_1_year' as const,
    bio: 'Seeking pious partner',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'],
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
    dbService.setCurrentUser(mockUser);
    vi.restoreAllMocks();
  });

  it('1. Silent background sync does not show full-screen spinner or blink existing cards', async () => {
    // Seed incoming like in dbService
    vi.spyOn(dbService, 'fetchLikedYouCandidates').mockResolvedValue([mockCandidate as any]);
    vi.spyOn(dbService, 'fetchMutualMatches').mockResolvedValue([]);
    vi.spyOn(dbService, 'fetchActivityHub').mockResolvedValue({ sentLikes: [], passed: [], blocked: [] });

    render(
      <MatchesLikedYouScreen
        currentUser={mockUser}
        onOpenChat={vi.fn()}
        initialTab="received"
      />
    );

    // Initial load should display candidate card
    await waitFor(() => {
      expect(screen.getByText(/Amina/i)).toBeDefined();
    });

    // Simulate background event sync (serene_activity_updated)
    await act(async () => {
      window.dispatchEvent(new CustomEvent('serene_activity_updated'));
    });

    // Cards must remain rendered without being replaced by full-screen spinner
    expect(screen.getByText(/Amina/i)).toBeDefined();
    expect(screen.queryByText('Checking incoming likes...')).toBeNull();
  });

  it('2. Match & Chat (Instant Match) immediately moves candidate to Mutual and opens chat', async () => {
    vi.spyOn(dbService, 'fetchLikedYouCandidates').mockResolvedValue([mockCandidate as any]);
    vi.spyOn(dbService, 'fetchMutualMatches').mockResolvedValue([]);
    vi.spyOn(dbService, 'fetchActivityHub').mockResolvedValue({ sentLikes: [], passed: [], blocked: [] });
    const sendMatchActionSpy = vi.spyOn(dbService, 'sendMatchAction').mockResolvedValue({
      isMutual: true,
      conversationId: 'conv_usr_active_member_usr_suitor_candidate_1'
    });

    const handleOpenChat = vi.fn();

    render(
      <MatchesLikedYouScreen
        currentUser={mockUser}
        onOpenChat={handleOpenChat}
        initialTab="received"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Amina/i)).toBeDefined();
    });

    // Click "Match & Chat"
    const matchBtn = screen.getByRole('button', { name: /Match & Chat/i });
    await act(async () => {
      fireEvent.click(matchBtn);
    });

    // Verify sendMatchAction was called with isMutualMatch = true
    expect(sendMatchActionSpy).toHaveBeenCalledWith(
      mockCandidate.id,
      'liked',
      undefined,
      expect.objectContaining({ id: mockCandidate.id }),
      true
    );

    // Verify onOpenChat was called with the conversation ID
    expect(handleOpenChat).toHaveBeenCalledWith('conv_usr_active_member_usr_suitor_candidate_1');

    // Verify candidate is removed from "Liked You"
    expect(screen.queryByRole('button', { name: /Match & Chat/i })).toBeNull();
  });

  it('3. Guest activity migration merges sent likes, passes and blocks upon login', () => {
    // Populate activities as guest
    localStorage.setItem('serene_likes_sent_usr_guest', JSON.stringify([
      { id: 'cand_1', fullName: 'Candidate 1', action: 'liked', actionTime: '2026-10-13T10:00:00Z' }
    ]));
    localStorage.setItem('serene_passed_usr_guest', JSON.stringify([
      { id: 'cand_2', fullName: 'Candidate 2', action: 'passed', actionTime: '2026-10-13T10:00:00Z' }
    ]));
    localStorage.setItem('serene_blocked_usr_guest', JSON.stringify([
      { id: 'cand_3', fullName: 'Candidate 3', reason: 'Spam', actionTime: '2026-10-13T10:00:00Z' }
    ]));

    // Authenticated user logs in
    dbService.setCurrentUser(mockUser);

    // Verify activities were migrated to mockUser.id
    const userLikes = dbService.getUserLikesSent(mockUser.id);
    expect(userLikes.length).toBe(1);
    expect(userLikes[0].id).toBe('cand_1');

    const userPassed = dbService.getUserPassed(mockUser.id);
    expect(userPassed.length).toBe(1);
    expect(userPassed[0].id).toBe('cand_2');

    const userBlocked = dbService.getUserBlocked(mockUser.id);
    expect(userBlocked.length).toBe(1);
    expect(userBlocked[0].id).toBe('cand_3');

    // Verify guest keys were cleaned up
    expect(localStorage.getItem('serene_likes_sent_usr_guest')).toBeNull();
    expect(localStorage.getItem('serene_passed_usr_guest')).toBeNull();
    expect(localStorage.getItem('serene_blocked_usr_guest')).toBeNull();
  });
});
