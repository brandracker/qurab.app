import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dbService } from '../../src/services/dbService';
import type { UserProfile } from '../../src/types';

describe('Sent Likes Hydration and Storage Quota Resilience Suite', () => {
  const currentUserId = 'usr_test_ahmad';
  const sampleCurrentUser: UserProfile = {
    id: currentUserId,
    phone: '+447000000000',
    fullName: 'Ahmad User',
    dob: '1995-01-01',
    age: 29,
    gender: 'male',
    location: 'London, UK',
    city: 'London',
    country: 'United Kingdom',
    profession: 'Software Engineer',
    education: 'BSc Computer Science',
    height: "5'11\"",
    ethnicity: 'South Asian',
    marriageTimeline: 'within_1_year',
    bio: 'Looking for a pious spouse.',
    blurPhotosByDefault: false,
    profileVisibility: 'all_users',
    accountStatus: 'active',
    photos: ['https://example.com/ahmad.jpg'],
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
    dbService.setCurrentUser(sampleCurrentUser);
    vi.restoreAllMocks();
  });

  it('1. sendMatchAction preserves full targetProfile details without falling back to Candidate', async () => {
    const liveCandidate: UserProfile = {
      id: 'usr_f_live_100',
      phone: '+447111111111',
      fullName: 'Maryam Khan',
      dob: '1999-01-10',
      age: 27,
      gender: 'female',
      location: 'Dubai, UAE',
      city: 'Dubai',
      country: 'UAE',
      profession: 'Architect',
      education: 'B.Arch, AUS',
      height: "5'4\"",
      ethnicity: 'Arab',
      marriageTimeline: 'within_1_year',
      bio: 'Creative architect seeking practicing partner.',
      blurPhotosByDefault: false,
      profileVisibility: 'all_users',
      accountStatus: 'active',
      photos: ['https://example.com/maryam.jpg']
    };

    // Mock fetch for backend API
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, isMutual: false })
    });

    // Call sendMatchAction passing liveCandidate as targetProfile
    await dbService.sendMatchAction(liveCandidate.id, 'liked', undefined, liveCandidate);

    const sentLikes = dbService.getUserLikesSent(currentUserId);
    expect(sentLikes).toHaveLength(1);
    expect(sentLikes[0].id).toBe('usr_f_live_100');
    expect(sentLikes[0].fullName).toBe('Maryam Khan');
    expect(sentLikes[0].profession).toBe('Architect');
    expect(sentLikes[0].location).toBe('Dubai, UAE');
    expect(sentLikes[0].photos).toEqual(['https://example.com/maryam.jpg']);
  });

  it('2. sendMatchAction sanitizes heavy base64 data URLs to protect mobile storage quota', async () => {
    // Generate simulated 100KB base64 string
    const heavyBase64 = 'data:image/jpeg;base64,' + 'A'.repeat(100000);

    const liveCandidateWithHeavyPhoto: UserProfile = {
      id: 'usr_f_live_200',
      phone: '+447222222222',
      fullName: 'Mariyam khan',
      dob: '1998-05-15',
      age: 28,
      gender: 'female',
      location: 'City, GB',
      profession: 'Software Engineer',
      education: 'BSc Computing',
      height: "5'5\"",
      ethnicity: 'South Asian',
      marriageTimeline: 'within_1_year',
      bio: 'Engineer seeking partner.',
      blurPhotosByDefault: false,
      profileVisibility: 'all_users',
      accountStatus: 'active',
      photos: [heavyBase64]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, isMutual: false })
    });

    await dbService.sendMatchAction(liveCandidateWithHeavyPhoto.id, 'liked', undefined, liveCandidateWithHeavyPhoto);

    const sentLikes = dbService.getUserLikesSent(currentUserId);
    expect(sentLikes).toHaveLength(1);
    expect(sentLikes[0].fullName).toBe('Mariyam khan');
    // Massive base64 string should be filtered out from offline storage
    expect(sentLikes[0].photos).toEqual([]);
  });

  it('3. fetchActivityHub heals stale Candidate placeholder records with remote server data', async () => {
    // Simulate stale local entry with placeholder Candidate
    const staleEntry = {
      id: 'usr_f_live_300',
      fullName: 'Candidate',
      profession: 'Professional',
      location: 'Global',
      marriageTimeline: 'within_1_year',
      photos: [],
      action: 'liked',
      actionTime: '2026-10-10T21:00:00.000Z'
    };
    localStorage.setItem(`serene_likes_sent_${currentUserId}`, JSON.stringify([staleEntry]));

    // Remote server response has real details
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        sentLikes: [
          {
            id: 'usr_f_live_300',
            fullName: 'Anum Sheikh',
            profession: 'Civil Lawyer',
            location: 'Toronto, Canada',
            marriageTimeline: 'within_1_year',
            photos: ['https://example.com/anum.jpg'],
            action: 'liked',
            actionTime: '2026-10-10T21:00:00.000Z'
          }
        ],
        passed: [],
        blocked: []
      })
    });

    const activity = await dbService.fetchActivityHub();
    expect(activity.sentLikes).toHaveLength(1);
    expect(activity.sentLikes[0].fullName).toBe('Anum Sheikh');
    expect(activity.sentLikes[0].profession).toBe('Civil Lawyer');
    expect(activity.sentLikes[0].location).toBe('Toronto, Canada');
    expect(activity.sentLikes[0].photos).toEqual(['https://example.com/anum.jpg']);
  });

  it('4. fetchActivityHub survives localStorage QuotaExceededError without throwing', async () => {
    const originalSetItem = localStorage.setItem;
    // Simulate Android WebView quota exhaustion on specific keys
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      if (key.startsWith('serene_likes_sent_')) {
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
      }
      return originalSetItem.call(localStorage, key, value);
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        sentLikes: [
          {
            id: 'usr_f_live_400',
            fullName: 'Zainab Qureshi',
            profession: 'Optometrist',
            location: 'London, UK',
            action: 'liked',
            actionTime: '2026-10-10T21:00:00.000Z',
            photos: ['https://example.com/zainab.jpg']
          }
        ],
        passed: [],
        blocked: []
      })
    });

    const activity = await dbService.fetchActivityHub();
    // mergedLikes should be successfully returned to UI even though localStorage threw quota error
    expect(activity.sentLikes).toHaveLength(1);
    expect(activity.sentLikes[0].fullName).toBe('Zainab Qureshi');
  });

  it('5. fetchUserProfile safely returns target profile without overwriting currentUser', async () => {
    const candidateId = 'usr_f_target_999';
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        profile: {
          id: candidateId,
          fullName: 'Nadia El-Sayed',
          profession: 'Dentist',
          location: 'London, UK',
          photos: ['https://example.com/nadia.jpg']
        }
      })
    });

    const candidateProfile = await dbService.fetchUserProfile(candidateId);
    expect(candidateProfile).not.toBeNull();
    expect(candidateProfile?.fullName).toBe('Nadia El-Sayed');

    // Verify current user was NOT overwritten in localStorage
    const current = dbService.getCurrentUser();
    expect(current.id).toBe(currentUserId);
    expect(current.fullName).toBe('Ahmad User');
  });
});
