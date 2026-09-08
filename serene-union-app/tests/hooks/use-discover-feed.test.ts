import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDiscoverFeed } from '../../src/hooks/useDiscoverFeed';
import { dbService } from '../../src/services/dbService';
import { notificationService } from '../../src/services/notificationService';
import type { UserProfile } from '../../src/types';

describe('useDiscoverFeed Custom Hook Architecture & Wiring', () => {
  const mockUser: UserProfile = {
    id: 'usr_hook_viewer',
    fullName: 'Fahad Qazi',
    email: 'fahad@test.com',
    gender: 'male',
    dob: '1995-03-20',
    age: 31,
    location: 'Lahore, Pakistan',
    city: 'Lahore',
    country: 'Pakistan',
    profession: 'Civil Engineer',
    photos: []
  };

  const mockCandidateA: UserProfile = {
    id: 'usr_cand_ayesha',
    fullName: 'Ayesha Noor',
    email: 'ayesha@test.com',
    gender: 'female',
    dob: '1998-09-12',
    age: 28,
    location: 'Karachi, Pakistan',
    city: 'Karachi',
    country: 'Pakistan',
    profession: 'Physiotherapist',
    photos: ['https://example.com/ayesha.jpg']
  };

  const mockCandidateB: UserProfile = {
    id: 'usr_cand_hina',
    fullName: 'Hina Tariq',
    email: 'hina@test.com',
    gender: 'female',
    dob: '2000-01-05',
    age: 26,
    location: 'Islamabad, Pakistan',
    city: 'Islamabad',
    country: 'Pakistan',
    profession: 'Data Analyst',
    photos: ['https://example.com/hina.jpg']
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    dbService.setCurrentUser(mockUser);
    localStorage.setItem('serene_real_profiles_v3', JSON.stringify([mockCandidateA, mockCandidateB]));
    vi.spyOn(dbService, 'fetchLiveProfiles').mockResolvedValue([mockCandidateA, mockCandidateB]);
    vi.spyOn(dbService, 'fetchLikesRemaining').mockResolvedValue({
      likesRemaining: 50,
      isVip: false,
      directSalams: 2,
      adsWatchedForSalam: 0,
      isSpotlightActive: false,
      spotlightExpiresAt: null
    });
    vi.spyOn(dbService, 'consumeDailyLike').mockResolvedValue({ success: true, likesRemaining: 49 });
    vi.spyOn(notificationService, 'syncLiveNotifications').mockImplementation(() => {});
  });

  it('1. Initializes with live candidates queue and default daily likes quota', async () => {
    const { result } = renderHook(() => useDiscoverFeed());

    expect(result.current.currentUser.id).toBe('usr_hook_viewer');
    expect(result.current.likesRemaining).toBe(50);
    expect(result.current.currentProfile?.id).toBe('usr_cand_ayesha');
  });

  it('2. handleLike advances candidate queue, decrements daily likes, and sends match action', async () => {
    const onLikeSpy = vi.fn();
    const { result } = renderHook(() => useDiscoverFeed({ onLikeProfile: onLikeSpy }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleLike(mockCandidateA);
    });

    expect(onLikeSpy).toHaveBeenCalledWith(mockCandidateA);
    expect(result.current.likesRemaining).toBe(49);
    // Queue now displays candidate B
    expect(result.current.currentProfile?.id).toBe('usr_cand_hina');
  });

  it('3. handlePass advances candidate queue without consuming likes', async () => {
    const passSpy = vi.spyOn(dbService, 'sendMatchAction').mockResolvedValue({ isMutual: false });

    const { result } = renderHook(() => useDiscoverFeed());

    act(() => {
      result.current.handlePass('usr_cand_ayesha');
    });

    expect(passSpy).toHaveBeenCalledWith('usr_cand_ayesha', 'passed');
    expect(result.current.likesRemaining).toBe(50);
    expect(result.current.currentProfile?.id).toBe('usr_cand_hina');
  });

  it('4. handleDirectSalam opens modal and handleConfirmDirectSalam consumes pass, creates match conversation, pops candidate, and routes to chat', async () => {
    const onChatSpy = vi.fn();
    const consumeSalamSpy = vi.spyOn(dbService, 'consumeDirectSalam').mockResolvedValue();
    const createConvSpy = vi.spyOn(dbService, 'createMatchConversation').mockReturnValue({ id: 'conv_direct_test' } as any);
    const sendMatchSpy = vi.spyOn(dbService, 'sendMatchAction').mockResolvedValue({ isMutual: false, conversationId: 'conv_direct_test' });

    const { result } = renderHook(() => useDiscoverFeed({ onOpenChat: onChatSpy }));

    await act(async () => {
      await result.current.handleDirectSalam(mockCandidateA);
    });

    expect(result.current.salamModalProfile?.id).toBe(mockCandidateA.id);

    await act(async () => {
      await result.current.handleConfirmDirectSalam('Assalamu Alaikum!');
    });

    expect(consumeSalamSpy).toHaveBeenCalledWith('usr_hook_viewer');
    expect(createConvSpy).toHaveBeenCalledWith(mockCandidateA, 'Assalamu Alaikum!');
    expect(sendMatchSpy).toHaveBeenCalledWith(mockCandidateA.id, 'direct_salam', 'Assalamu Alaikum!');
    expect(onChatSpy).toHaveBeenCalledWith('conv_direct_test');
    // Candidate A must be removed from Discover queue
    expect(result.current.currentProfile?.id).toBe('usr_cand_hina');
  });

  it('5. Search filtering accurately filters candidates and safely clamps index', () => {
    const { result } = renderHook(() => useDiscoverFeed());

    act(() => {
      result.current.setSearchQuery('Islamabad');
    });

    expect(result.current.filteredFeed.length).toBe(1);
    expect(result.current.currentProfile?.fullName).toBe('Hina Tariq');

    act(() => {
      result.current.setSearchQuery('NonExistentCity999');
    });

    expect(result.current.filteredFeed.length).toBe(0);
    expect(result.current.currentProfile).toBeNull();
  });
});
