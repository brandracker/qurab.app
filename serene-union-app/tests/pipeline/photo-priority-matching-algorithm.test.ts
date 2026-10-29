import { describe, it, expect, beforeEach } from 'vitest';
import { dbService } from '../../src/services/dbService';
import type { UserProfile } from '../../src/types';

describe('Matrimonial Matching Algorithm: Photo Priority Interleaving (4 Show : 2 Blur : 2 No-Photo)', () => {
  const createCandidate = (
    id: string, 
    fullName: string, 
    photos: string[], 
    blurPhotosByDefault: boolean
  ): UserProfile => ({
    id,
    fullName,
    gender: 'female',
    dob: '1998-01-01',
    age: 28,
    location: 'Lahore, PK',
    city: 'Lahore',
    country: 'Pakistan',
    profession: 'Engineer',
    education: 'BS',
    marriageTimeline: 'within_1_year',
    bio: 'Pious candidate',
    photos,
    blurPhotosByDefault,
    accountStatus: 'active',
    profileVisibility: 'all_users'
  });

  beforeEach(() => {
    localStorage.clear();
    dbService.setCurrentUser({
      id: 'usr_brother_active',
      fullName: 'Ahmad Brother',
      gender: 'male',
      dob: '1995-01-01',
      age: 31,
      location: 'Lahore, PK',
      city: 'Lahore',
      country: 'Pakistan',
      profession: 'Doctor',
      education: 'MBBS',
      marriageTimeline: 'within_1_year',
      bio: 'Seeking spouse',
      photos: ['https://example.com/me.jpg'],
      accountStatus: 'active',
      profileVisibility: 'all_users'
    });
  });

  it('1. Interleaves candidates strictly in the 4 Unblurred -> 2 Blurred -> 2 No-Photo pattern', () => {
    // Create 10 unblurred, 5 blurred, and 4 no-photo candidates
    const unblurredProfiles = Array.from({ length: 10 }, (_, i) => 
      createCandidate(`u_${i + 1}`, `Unblurred Candidate ${i + 1}`, [`https://example.com/u${i + 1}.jpg`], false)
    );
    const blurredProfiles = Array.from({ length: 5 }, (_, i) => 
      createCandidate(`b_${i + 1}`, `Blurred Candidate ${i + 1}`, [`https://example.com/b${i + 1}.jpg`], true)
    );
    const noPhotoProfiles = Array.from({ length: 4 }, (_, i) => 
      createCandidate(`n_${i + 1}`, `No Photo Candidate ${i + 1}`, [], false)
    );

    const mixed = [...noPhotoProfiles, ...blurredProfiles, ...unblurredProfiles];
    const feed = dbService.getDiscoverFeed(undefined, mixed);

    expect(feed.length).toBe(19);

    // Batch 1: 4 Show Image (u_1 .. u_4)
    expect(feed.slice(0, 4).map(p => p.id)).toEqual(['u_1', 'u_2', 'u_3', 'u_4']);

    // Batch 1: 2 Blur Image (b_1, b_2)
    expect(feed.slice(4, 6).map(p => p.id)).toEqual(['b_1', 'b_2']);

    // Batch 1: 2 No Photo (n_1, n_2)
    expect(feed.slice(6, 8).map(p => p.id)).toEqual(['n_1', 'n_2']);

    // Batch 2: 4 Show Image (u_5 .. u_8)
    expect(feed.slice(8, 12).map(p => p.id)).toEqual(['u_5', 'u_6', 'u_7', 'u_8']);

    // Batch 2: 2 Blur Image (b_3, b_4)
    expect(feed.slice(12, 14).map(p => p.id)).toEqual(['b_3', 'b_4']);

    // Batch 2: 2 No Photo (n_3, n_4)
    expect(feed.slice(14, 16).map(p => p.id)).toEqual(['n_3', 'n_4']);

    // Batch 3: Remaining 2 Show Image (u_9, u_10)
    expect(feed.slice(16, 18).map(p => p.id)).toEqual(['u_9', 'u_10']);

    // Batch 3: Remaining 1 Blur Image (b_5)
    expect(feed.slice(18, 19).map(p => p.id)).toEqual(['b_5']);
  });

  it('2. Preserves active Spotlight priority at the front of the feed', () => {
    const unblurredNormal = createCandidate('u_norm', 'Normal Unblurred', ['https://example.com/u.jpg'], false);
    const unblurredSpotlight = {
      ...createCandidate('u_spot', 'Spotlight Unblurred', ['https://example.com/spot.jpg'], false),
      isSpotlightActive: true
    };
    const blurredNormal = createCandidate('b_norm', 'Normal Blurred', ['https://example.com/b.jpg'], true);

    const feed = dbService.getDiscoverFeed(undefined, [unblurredNormal, blurredNormal, unblurredSpotlight]);
    expect(feed[0].id).toBe('u_spot');
  });
});

