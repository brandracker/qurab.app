import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatchesLikedYouScreen } from '../../src/components/MatchesLikedYouScreen';
import { dbService } from '../../src/services/dbService';
import type { UserProfile } from '../../src/types';

describe('Sent Likes Modal Safety & Context-Aware Actions', () => {
  const mockCurrentUser: UserProfile = {
    id: 'usr_me_101',
    fullName: 'Zayd Al-Ansari',
    email: 'zayd@example.com',
    gender: 'male',
    dob: '1993-04-12',
    age: 33,
    location: 'London, UK',
    city: 'London',
    country: 'UK',
    profession: 'Software Engineer',
    education: 'BSc Computer Science',
    marriageTimeline: 'within_1_year',
    bio: 'Looking for a pious, kind-hearted spouse.',
    photos: []
  };

  const mockSentLikePending = {
    id: 'usr_target_pending_202',
    fullName: 'Amina Siddiqui',
    email: 'amina@example.com',
    gender: 'female',
    dob: '1996-09-20',
    age: 30,
    location: 'Birmingham, UK',
    city: 'Birmingham',
    country: 'UK',
    profession: 'Clinical Psychologist',
    education: 'MSc Psychology',
    marriageTimeline: 'within_6_months',
    bio: 'Practicing Muslimah, family-oriented.',
    photos: ['https://example.com/amina.jpg'],
    action: 'liked',
    actionTime: new Date().toISOString()
  };

  const mockSentLikeMatched = {
    id: 'usr_target_matched_303',
    fullName: 'Mariam Farooq',
    email: 'mariam@example.com',
    gender: 'female',
    dob: '1995-02-14',
    age: 31,
    location: 'Manchester, UK',
    city: 'Manchester',
    country: 'UK',
    profession: 'Optometrist',
    education: 'BSc Optometry',
    marriageTimeline: 'within_1_year',
    bio: 'Deen first, values mutual respect.',
    photos: ['https://example.com/mariam.jpg'],
    action: 'mutual_match',
    actionTime: new Date().toISOString()
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    dbService.setCurrentUser(mockCurrentUser);

    vi.spyOn(dbService, 'fetchLikedYouCandidates').mockResolvedValue([]);
    vi.spyOn(dbService, 'fetchMutualMatches').mockResolvedValue([]);
    vi.spyOn(dbService, 'fetchActivityHub').mockResolvedValue({
      sentLikes: [mockSentLikePending, mockSentLikeMatched],
      passed: [],
      blocked: []
    });
  });

  it('1. Opening a pending sent-like profile displays "Interest Sent · Pending" and "Close Biodata", NOT "Express Interest (Like)"', async () => {
    const handleOpenChat = vi.fn();
    const handleOpenDiscover = vi.fn();

    render(
      <MatchesLikedYouScreen
        onOpenChat={handleOpenChat}
        onOpenDiscover={handleOpenDiscover}
      />
    );

    // Switch to "You Liked" (sent) tab
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /You Liked/i })).toBeDefined();
    });

    fireEvent.click(screen.getByRole('button', { name: /You Liked/i }));

    // Verify Amina Siddiqui appears in sent list
    await waitFor(() => {
      expect(screen.getByText('Amina Siddiqui')).toBeDefined();
    });

    // Click on Amina Siddiqui's card to open ProfileDetailModal
    fireEvent.click(screen.getByText('Amina Siddiqui'));

    // Verify modal is opened
    await waitFor(() => {
      expect(screen.getByText(/Matrimonial Profile/i)).toBeDefined();
    });

    // CRITICAL REGRESSION CHECK: "Express Interest (Like)" must NOT exist
    expect(screen.queryByText(/Express Interest \(Like\)/i)).toBeNull();

    // "Pass" button must NOT exist on a sent like (not matching "Privacy & Passes")
    expect(screen.queryByRole('button', { name: /^Pass$/i })).toBeNull();

    // Status badge and Close Biodata button must be visible
    expect(screen.getByText(/Interest Sent · Pending/i)).toBeDefined();
    const closeBtn = screen.getByRole('button', { name: /Close Biodata/i });
    expect(closeBtn).toBeDefined();

    // Clicking Close Biodata closes the modal without triggering chat
    fireEvent.click(closeBtn);

    expect(handleOpenChat).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText(/Matrimonial Profile/i)).toBeNull();
    });
  });

  it('2. Opening a mutual match item from sent tab provides "Open Chat" and "Close Biodata"', async () => {
    const handleOpenChat = vi.fn();
    const handleOpenDiscover = vi.fn();

    render(
      <MatchesLikedYouScreen
        onOpenChat={handleOpenChat}
        onOpenDiscover={handleOpenDiscover}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /You Liked/i })).toBeDefined();
    });

    fireEvent.click(screen.getByRole('button', { name: /You Liked/i }));

    await waitFor(() => {
      expect(screen.getByText('Mariam Farooq')).toBeDefined();
    });

    fireEvent.click(screen.getByText('Mariam Farooq'));

    await waitFor(() => {
      expect(screen.getByText(/Matrimonial Profile/i)).toBeDefined();
    });

    // "Express Interest" must NOT exist
    expect(screen.queryByText(/Express Interest \(Like\)/i)).toBeNull();

    // Should have Open Chat and Close Biodata
    const openChatBtn = screen.getByRole('button', { name: /Open Chat/i });
    expect(openChatBtn).toBeDefined();

    fireEvent.click(openChatBtn);
    expect(handleOpenChat).toHaveBeenCalledWith(expect.stringContaining('conv_'));
  });

  it('3. In "Who Liked You" (Received) tab, candidate biodata modal DOES allow "Express Interest (Like)" and "Pass"', async () => {
    const handleOpenChat = vi.fn();
    const handleOpenDiscover = vi.fn();

    // Enable VIP so candidate is revealed
    localStorage.setItem(`serene_vip_${mockCurrentUser.id}`, 'true');

    const mockReceivedCandidate: UserProfile = {
      id: 'usr_received_404',
      fullName: 'Sumayya Tariq',
      email: 'sumayya@example.com',
      gender: 'female',
      dob: '1997-03-10',
      age: 29,
      location: 'London, UK',
      city: 'London',
      country: 'UK',
      profession: 'Dentist',
      education: 'BDS Dentistry',
      marriageTimeline: 'within_1_year',
      bio: 'Practicing deen, polite and caring.',
      photos: ['https://example.com/sumayya.jpg']
    };

    vi.spyOn(dbService, 'fetchLikedYouCandidates').mockResolvedValue([mockReceivedCandidate]);
    vi.spyOn(dbService, 'sendMatchAction').mockResolvedValue({
      isMutual: true,
      conversationId: 'conv_usr_me_101_usr_received_404'
    });

    render(
      <MatchesLikedYouScreen
        onOpenChat={handleOpenChat}
        onOpenDiscover={handleOpenDiscover}
      />
    );

    // Should default to received tab and show candidate
    await waitFor(() => {
      expect(screen.getByText('Sumayya Tariq')).toBeDefined();
    });

    // Click candidate photo to open biodata modal
    const candidateImg = screen.getByAltText('Sumayya Tariq');
    fireEvent.click(candidateImg);

    await waitFor(() => {
      expect(screen.getByText(/Matrimonial Profile/i)).toBeDefined();
    });

    // Both Pass and Express Interest (Like) must be present for incoming likes
    const passButtons = screen.getAllByRole('button', { name: /Pass/i });
    expect(passButtons.length).toBeGreaterThanOrEqual(2);
    const likeBtn = screen.getByRole('button', { name: /Express Interest \(Like\)/i });
    expect(likeBtn).toBeDefined();

    // Liking back creates mutual match and routes to chat
    fireEvent.click(likeBtn);

    await waitFor(() => {
      expect(handleOpenChat).toHaveBeenCalledWith('conv_usr_me_101_usr_received_404');
    });
  });
});
