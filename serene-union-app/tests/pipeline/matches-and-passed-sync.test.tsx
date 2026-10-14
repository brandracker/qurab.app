import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MatchesLikedYouScreen } from '../../src/components/MatchesLikedYouScreen';
import { dbService } from '../../src/services/dbService';

describe('Pipeline Test: Matches, Passed History Photos & Live Chat Sync', () => {
  const mockUser = {
    id: 'usr_test_female_1',
    fullName: 'Ruksana Syed',
    gender: 'female',
    dob: '1998-05-14',
    city: 'Lahore',
    location: 'Lahore, Pakistan',
    isProfileCompleted: true,
    isVip: true
  };

  beforeEach(() => {
    localStorage.clear();
    dbService.setCurrentUser(mockUser as any);
    localStorage.setItem(`serene_vip_${mockUser.id}`, 'true');
    vi.restoreAllMocks();
  });

  it('1. Passed History displays candidate photo when photos array is returned', async () => {
    vi.spyOn(dbService, 'fetchLikedYouCandidates').mockResolvedValue([]);
    vi.spyOn(dbService, 'fetchMutualMatches').mockResolvedValue([]);
    vi.spyOn(dbService, 'fetchActivityHub').mockResolvedValue({
      sentLikes: [],
      passed: [
        {
          id: 'usr_passed_1',
          fullName: 'Qasem',
          location: 'Gujrat, Pakistan',
          profession: 'Civil Engineer',
          photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80']
        }
      ],
      blocked: []
    });

    render(<MatchesLikedYouScreen onOpenChat={vi.fn()} onOpenDiscover={vi.fn()} />);

    // Click Privacy & Passes tab
    const privacyTab = await screen.findByText('Privacy & Passes');
    privacyTab.click();

    // Check that Qasem is in the passed list
    await waitFor(() => {
      expect(screen.getByText('Qasem')).toBeDefined();
    });

    // Check that image is rendered, NOT just fallback initial 'Q'
    const img = screen.getByAltText('Qasem') as HTMLImageElement;
    expect(img).toBeDefined();
    expect(img.src).toContain('photo-1507003211169-0a1dd7228f2d');
  });

  it('2. Auto-heals mutual matches and displays badge when sent likes contain mutual_match', async () => {
    vi.spyOn(dbService, 'fetchLikedYouCandidates').mockResolvedValue([]);
    // Remote mutual call is lagged/empty initially
    vi.spyOn(dbService, 'fetchMutualMatches').mockResolvedValue([]);
    vi.spyOn(dbService, 'fetchActivityHub').mockResolvedValue({
      sentLikes: [
        {
          id: 'usr_matched_1',
          fullName: 'Sufian Gill',
          location: 'Islamabad, Pakistan',
          profession: 'Senior Software Engineer',
          action: 'mutual_match',
          photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500']
        }
      ],
      passed: [],
      blocked: []
    });

    render(<MatchesLikedYouScreen onOpenChat={vi.fn()} onOpenDiscover={vi.fn()} />);

    // Click "You Liked" subtab to verify Sent Likes
    const youLikedBtn = screen.getByRole('button', { name: /You Liked/i });
    youLikedBtn.click();

    // Check that Sufian Gill shows Matched in Sent Likes
    await waitFor(() => {
      expect(screen.getByText('Sufian Gill')).toBeDefined();
      expect(screen.getByText('Matched')).toBeDefined();
    });

    // Click Mutual subtab
    const mutualButton = screen.getByRole('button', { name: /Mutual/i });
    expect(mutualButton).toBeDefined();
    mutualButton.click();

    // Sufian Gill should appear inside the Mutual matches section
    await waitFor(() => {
      expect(screen.getByText('Sufian Gill')).toBeDefined();
      expect(screen.getByText('Tap to chat · Tap eye for biodata')).toBeDefined();
    });
  });

  it('3. fetchLiveConversations dispatches serene_conversations_updated event to notify UI', async () => {
    const eventSpy = vi.fn();
    window.addEventListener('serene_conversations_updated', eventSpy);

    const mockConversations = [
      {
        id: 'conv_1',
        participantOne: mockUser.id,
        participantTwo: 'usr_sufian',
        lastMessageText: 'Aoa',
        lastMessageTime: '12:10 am',
        otherUser: { id: 'usr_sufian', fullName: 'Sufian Gill' }
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, conversations: mockConversations })
    } as any);

    const result = await dbService.fetchLiveConversations();
    expect(result.length).toBeGreaterThan(0);
    expect(eventSpy).toHaveBeenCalled();

    window.removeEventListener('serene_conversations_updated', eventSpy);
  });
});
