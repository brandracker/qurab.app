import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dbService } from '../../src/services/dbService';
import { DiscoverFeed } from '../../src/components/DiscoverFeed';
import type { UserProfile } from '../../src/types';

describe('Unblock to Fresh Discover Candidate Flow', () => {
  const mockCurrentUser: UserProfile = {
    id: 'usr_me_555',
    fullName: 'Haris Khan',
    email: 'haris@example.com',
    gender: 'male',
    dob: '1992-07-20',
    age: 33,
    location: 'London, UK',
    city: 'London',
    country: 'UK',
    profession: 'Software Architect',
    education: 'BSc Computer Science',
    marriageTimeline: 'within_1_year',
    bio: 'Pious, practicing brother looking for spouse.',
    photos: []
  };

  const mockCandidate: UserProfile = {
    id: 'usr_candidate_unblock_999',
    fullName: 'Zaynab Al-Husseini',
    email: 'zaynab@example.com',
    gender: 'female',
    dob: '1996-03-15',
    age: 30,
    location: 'London, UK',
    city: 'London',
    country: 'UK',
    profession: 'Biomedical Scientist',
    education: 'MSc Biomedicine',
    marriageTimeline: 'within_1_year',
    bio: 'Practicing Muslimah, passionate about deen and healthcare.',
    photos: ['https://example.com/zaynab.jpg'],
    accountStatus: 'active',
    profileVisibility: 'all_users'
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    dbService.setCurrentUser(mockCurrentUser);

    vi.spyOn(dbService, 'fetchLiveProfiles').mockResolvedValue([mockCandidate]);

    // Mock fetch for network calls
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/matches/unblock')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Unblocked' })
        });
      }
      if (url.includes('/wallet/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, likesRemaining: 10, isVip: false, directSalams: 2 })
        });
      }
      if (url.includes('/notifications')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, count: 0, notifications: [] })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
    }) as any;
  });

  it('1. Candidate who was previously liked and blocked is excluded from Discover feed', () => {
    // Simulate user previously liking the candidate
    const likesSent = [{ id: mockCandidate.id, fullName: mockCandidate.fullName }];
    localStorage.setItem(`serene_likes_sent_${mockCurrentUser.id}`, JSON.stringify(likesSent));

    // Simulate user subsequently blocking the candidate
    const blockedList = [{ id: mockCandidate.id, fullName: mockCandidate.fullName, reason: 'Test' }];
    localStorage.setItem(`serene_blocked_${mockCurrentUser.id}`, JSON.stringify(blockedList));

    // Simulate conversation record
    const convs = [{
      id: `conv_${mockCurrentUser.id}_${mockCandidate.id}`,
      participantOne: mockCurrentUser.id,
      participantTwo: mockCandidate.id,
      otherUser: mockCandidate
    }];
    localStorage.setItem('serene_real_conversations_v3', JSON.stringify(convs));

    // Discover feed MUST exclude this candidate
    const feed = dbService.getDiscoverFeed(undefined, [mockCandidate]);
    const found = feed.find(p => p.id === mockCandidate.id);
    expect(found).toBeUndefined();
  });

  it('2. Unblocking cleanses likes_sent, passed, and conversation cache, restoring candidate to Discover feed as fresh card', async () => {
    // Setup blocked and liked state
    localStorage.setItem(`serene_likes_sent_${mockCurrentUser.id}`, JSON.stringify([{ id: mockCandidate.id }]));
    localStorage.setItem(`serene_blocked_${mockCurrentUser.id}`, JSON.stringify([{ id: mockCandidate.id }]));
    localStorage.setItem(`serene_passed_${mockCurrentUser.id}`, JSON.stringify([{ id: mockCandidate.id }]));
    localStorage.setItem('serene_real_conversations_v3', JSON.stringify([{
      id: `conv_${mockCurrentUser.id}_${mockCandidate.id}`,
      otherUser: mockCandidate
    }]));

    // Unblock the candidate
    const unblockSuccess = await dbService.unblockProfile(mockCandidate.id);
    expect(unblockSuccess).toBe(true);

    // Verify localStorage cleanup
    const updatedBlocked = JSON.parse(localStorage.getItem(`serene_blocked_${mockCurrentUser.id}`) || '[]');
    const updatedLikes = JSON.parse(localStorage.getItem(`serene_likes_sent_${mockCurrentUser.id}`) || '[]');
    const updatedPassed = JSON.parse(localStorage.getItem(`serene_passed_${mockCurrentUser.id}`) || '[]');
    const updatedConvs = JSON.parse(localStorage.getItem('serene_real_conversations_v3') || '[]');

    expect(updatedBlocked.some((b: any) => b.id === mockCandidate.id)).toBe(false);
    expect(updatedLikes.some((l: any) => l.id === mockCandidate.id)).toBe(false);
    expect(updatedPassed.some((p: any) => p.id === mockCandidate.id)).toBe(false);
    expect(updatedConvs.some((c: any) => c.otherUser?.id === mockCandidate.id)).toBe(false);

    // Discover feed MUST now include the candidate as a fresh profile!
    const feedAfterUnblock = dbService.getDiscoverFeed(undefined, [mockCandidate]);
    const foundAfter = feedAfterUnblock.find(p => p.id === mockCandidate.id);
    expect(foundAfter).toBeDefined();
    expect(foundAfter?.fullName).toBe('Zaynab Al-Husseini');
  });

  it('3. DiscoverFeed UI displays unblocked candidate card and allows liking afresh', async () => {
    // Candidate is unblocked and clean
    const handleLike = vi.fn();
    const handlePass = vi.fn();
    const handleOpenChat = vi.fn();
    const handleOpenNotifications = vi.fn();

    render(
      <DiscoverFeed
        onLike={handleLike}
        onPass={handlePass}
        onOpenChat={handleOpenChat}
        onOpenNotifications={handleOpenNotifications}
      />
    );

    // Wait for Discover to render candidate card
    await waitFor(() => {
      expect(screen.getByText(/Zaynab/i)).toBeDefined();
    });

    expect(screen.getByText(/Biomedical Scientist/i)).toBeDefined();
  });
});
