import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BasicInfoScreen } from '../../src/screens/BasicInfoScreen';
import { ProfileDetailModal } from '../../src/components/ProfileDetailModal';
import { dbService } from '../../src/services/dbService';
import type { UserProfile } from '../../src/types';

describe('Real-World Pipeline: Accurate GPS Location & Haversine Distance Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. BasicInfoScreen auto-detects accurate GPS coordinates when user clicks location button', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => {
        success({
          coords: {
            latitude: 51.5074,
            longitude: -0.1278,
            accuracy: 10
          }
        });
      })
    };
    // @ts-expect-error Mocking navigator.geolocation
    global.navigator.geolocation = mockGeolocation;

    const handleContinue = vi.fn();
    const handleBack = vi.fn();

    render(
      <BasicInfoScreen
        data={{
          fullName: 'Test Candidate',
          gender: 'male',
          dob: '1995-05-15',
          city: 'London',
          country: 'United Kingdom'
        }}
        onContinue={handleContinue}
        onBack={handleBack}
      />
    );

    const gpsBtn = screen.getByRole('button', { name: /auto-detect accurate gps location/i });
    expect(gpsBtn).toBeDefined();

    fireEvent.click(gpsBtn);

    await waitFor(() => {
      expect(screen.getByText(/accurate coordinates captured/i)).toBeDefined();
    });

    const submitBtn = screen.getByRole('button', { name: /continue to deen/i });
    fireEvent.click(submitBtn);

    expect(handleContinue).toHaveBeenCalledWith(
      expect.objectContaining({
        latitude: 51.5074,
        longitude: -0.1278,
        city: 'London',
        country: 'United Kingdom'
      })
    );
  });

  it('2. BasicInfoScreen falls back gracefully if geolocation is denied or unavailable', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((_success, error) => {
        error({
          code: 1, // PERMISSION_DENIED
          message: 'User denied Geolocation'
        });
      })
    };
    // @ts-expect-error Mocking navigator.geolocation
    global.navigator.geolocation = mockGeolocation;

    const handleContinue = vi.fn();
    const handleBack = vi.fn();

    render(
      <BasicInfoScreen
        data={{
          fullName: 'Fallback Candidate',
          gender: 'female',
          dob: '1997-08-20',
          city: 'Manchester',
          country: 'United Kingdom'
        }}
        onContinue={handleContinue}
        onBack={handleBack}
      />
    );

    const gpsBtn = screen.getByRole('button', { name: /auto-detect accurate gps location/i });
    fireEvent.click(gpsBtn);

    await waitFor(() => {
      expect(screen.getByText(/location permission not granted/i)).toBeDefined();
    });

    const submitBtn = screen.getByRole('button', { name: /continue to deen/i });
    fireEvent.click(submitBtn);

    // Form continues smoothly without crashing
    expect(handleContinue).toHaveBeenCalledWith(
      expect.objectContaining({
        city: 'Manchester',
        country: 'United Kingdom'
      })
    );
  });

  it('3. ProfileDetailModal displays distance badge when candidate has distanceKm', () => {
    const mockProfile: UserProfile = {
      id: 'usr_candidate_dist',
      fullName: 'Amina Al-Mansoor',
      age: 26,
      gender: 'female',
      location: 'London, UK',
      city: 'London',
      country: 'United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
      distanceKm: 8,
      profession: 'Clinical Pharmacist',
      education: 'MPharm, UCL',
      bio: 'Practicing Muslimah looking for a righteous partner.',
      religiousProfile: {
        sect: 'Sunni',
        madhhab: 'Hanafi',
        practiceLevel: 'very_practicing',
        prayersPerDay: 5,
        quranFrequency: 'daily',
        fasting: 'always_ramadan_and_sunnah',
        hijabBeard: 'wears_hijab'
      },
      photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'],
      photoRevealApproved: true,
      blurPhotosByDefault: false,
      isVerified: true
    };

    render(
      <ProfileDetailModal
        profile={mockProfile}
        isOpen={true}
        onClose={vi.fn()}
        onLike={vi.fn()}
        onPass={vi.fn()}
      />
    );

    // Expect distance indicator "8 km away" without NaN
    expect(screen.getAllByText(/8 km away/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/NaN/i)).toBeNull();
  });

  it('4. ProfileDetailModal gracefully renders location without distance badge when distanceKm is missing', () => {
    const mockProfileNoDist: UserProfile = {
      id: 'usr_candidate_nodist',
      fullName: 'Farhan Zaidi',
      age: 29,
      gender: 'male',
      location: 'Birmingham, UK',
      city: 'Birmingham',
      country: 'United Kingdom',
      profession: 'Software Engineer',
      education: 'BSc Computer Science',
      bio: 'Passionate tech professional.',
      religiousProfile: {
        sect: 'Sunni',
        madhhab: 'Hanafi',
        practiceLevel: 'practicing',
        prayersPerDay: 5,
        quranFrequency: 'weekly',
        fasting: 'always_ramadan',
        hijabBeard: 'has_beard'
      },
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
      photoRevealApproved: true,
      blurPhotosByDefault: false,
      isVerified: true
    };

    render(
      <ProfileDetailModal
        profile={mockProfileNoDist}
        isOpen={true}
        onClose={vi.fn()}
        onLike={vi.fn()}
        onPass={vi.fn()}
      />
    );

    expect(screen.getByText('Birmingham, UK')).toBeDefined();
    expect(screen.queryByText(/km away/i)).toBeNull();
    expect(screen.queryByText(/NaN/i)).toBeNull();
  });

  it('5. dbService.getDiscoverFeed filters candidates by maxDistance radius', () => {
    // Current user in London
    const currentUser = dbService.getCurrentUser();
    dbService.updateCurrentUser({
      ...currentUser,
      latitude: 51.5074,
      longitude: -0.1278
    });

    const feed50km = dbService.getDiscoverFeed({
      minAge: 18,
      maxAge: 70,
      maxDistance: 50,
      sects: [],
      practiceLevels: [],
      marriageTimelines: [],
      languages: []
    });

    // All returned profiles must either be within 50km or not have a distance computed
    for (const profile of feed50km) {
      if (typeof profile.distanceKm === 'number') {
        expect(profile.distanceKm).toBeLessThanOrEqual(50);
      }
    }
  });
});
