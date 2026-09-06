import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { dbService } from '../../src/services/dbService';
import { MyProfileScreen } from '../../src/screens/MyProfileScreen';
import { BasicInfoScreen } from '../../src/screens/BasicInfoScreen';
import type { UserProfile } from '../../src/types';

describe('Real-World Pipeline: Live Profile Sync & Edit Profile Prefill (Cloud DB Single Source of Truth)', () => {
  const staleLocalUser: UserProfile = {
    id: 'usr_live_test_101',
    fullName: 'Zainab Qasim',
    email: 'zainab@test.com',
    gender: 'female',
    dob: '1996-01-01',
    age: 30,
    location: 'Old City, UK',
    city: 'Old City',
    country: 'UK',
    profession: 'Student',
    education: 'BSc',
    marriageTimeline: 'within_1_year',
    bio: 'Initial bio',
    photos: ['https://example.com/zainab.jpg']
  };

  const freshD1User: UserProfile = {
    id: 'usr_live_test_101',
    fullName: 'Dr. Zainab Qasim',
    email: 'zainab@test.com',
    gender: 'female',
    dob: '1996-03-25',
    age: 30,
    location: 'Manchester, United Kingdom',
    city: 'Manchester',
    country: 'United Kingdom',
    profession: 'Consultant Paediatrician',
    education: 'MBBS, MRCPCH',
    university: 'University of Manchester',
    height: "5'7\" (170 cm)",
    marriageTimeline: 'within_1_year',
    bio: 'Updated live bio directly from Cloudflare D1 database.',
    photos: ['https://example.com/zainab_new.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    },
    isProfileCompleted: true,
    isVip: true
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    dbService.setCurrentUser(staleLocalUser);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1. dbService.fetchUserProfile fetches fresh profile from Cloudflare D1 and updates dbService state', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        profile: freshD1User
      })
    } as Response);

    const result = await dbService.fetchUserProfile('usr_live_test_101');

    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/users/usr_live_test_101'));
    expect(result).toBeDefined();
    expect(result?.fullName).toBe('Dr. Zainab Qasim');
    expect(result?.profession).toBe('Consultant Paediatrician');

    // Verify dbService.getCurrentUser() was updated
    const current = dbService.getCurrentUser();
    expect(current.fullName).toBe('Dr. Zainab Qasim');
    expect(current.profession).toBe('Consultant Paediatrician');
  });

  it('2. MyProfileScreen hydrates live profile from Cloudflare D1 on mount and renders fresh data', async () => {
    vi.spyOn(dbService, 'fetchUserProfile').mockResolvedValue(freshD1User);
    vi.spyOn(dbService, 'fetchLikesRemaining').mockResolvedValue({
      likesRemaining: 50,
      isVip: true,
      directSalams: 5,
      adsWatchedForSalam: 0,
      isSpotlightActive: false,
      spotlightExpiresAt: null
    });

    render(<MyProfileScreen user={staleLocalUser} />);

    // Initially or after hydration, fresh D1 data should be displayed
    await waitFor(() => {
      expect(screen.getByText(/Dr\. Zainab Qasim/i)).toBeDefined();
      expect(screen.getAllByText(/Consultant Paediatrician/i)[0]).toBeDefined();
      expect(screen.getByText(/Manchester, United Kingdom/i)).toBeDefined();
    });
  });

  it('3. BasicInfoScreen accurately pre-fills all form fields from currentUser when editing profile', () => {
    const handleContinue = vi.fn();

    render(
      <BasicInfoScreen
        data={freshD1User as any}
        onBack={() => {}}
        onContinue={handleContinue}
      />
    );

    // Full name input should contain the live name
    const nameInput = screen.getByDisplayValue('Dr. Zainab Qasim') as HTMLInputElement;
    expect(nameInput.value).toBe('Dr. Zainab Qasim');

    // Sister toggle should be active
    const sisterBtn = screen.getByRole('button', { name: /sister/i });
    expect(sisterBtn.className).toContain('primary');

    // Continue to next step passes the prefilled live data
    const continueBtn = screen.getByRole('button', { name: /continue to deen/i });
    fireEvent.click(continueBtn);

    expect(handleContinue).toHaveBeenCalledTimes(1);
    const submittedData = handleContinue.mock.calls[0][0];
    expect(submittedData.fullName).toBe('Dr. Zainab Qasim');
    expect(submittedData.gender).toBe('female');
  });
});
