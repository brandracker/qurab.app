import { describe, it, expect, beforeEach, vi } from 'vitest';
import { notificationService, LiveNotification } from '../../src/services/notificationService';
import { dbService } from '../../src/services/dbService';

describe('Real-World Pipeline: Live Notifications & Activity Hub', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. Initializes with empty notifications and hasUnread is false', () => {
    expect(notificationService.getNotifications()).toEqual([]);
    expect(notificationService.hasUnread()).toBe(false);
  });

  it('2. Synchronizes live mutual matches and converts them to actionable notifications', async () => {
    // Setup a logged in user
    dbService.setCurrentUser({
      id: 'usr_test_receiver_1',
      fullName: 'Zainab Bibi',
      gender: 'female',
      email: 'zainab@test.com',
      phone: '',
      dob: '1998-01-01',
      age: 28,
      location: 'London, UK',
      profession: 'Educator',
      education: 'BSc',
      height: "5'5\"",
      ethnicity: 'South Asian',
      familyStructure: 'nuclear',
      livingPreference: 'independent',
      siblingsCount: 2,
      willingnessToRelocate: 'open',
      smokingStatus: 'non_smoker',
      languagesSpoken: 'English, Urdu',
      mahrPhilosophy: 'mutual_agreement',
      childrenDesire: 'desires_children',
      marriageTimeline: 'within_1_year',
      bio: 'Practicing Muslimah',
      blurPhotosByDefault: true,
      profileVisibility: 'all_users',
      photos: ['https://example.com/p1.jpg'],
      religiousProfile: {
        practiceLevel: 'practicing',
        sect: 'Sunni',
        madhhab: 'Hanafi',
        prayerFrequency: '5 times daily',
        halalDiet: 'Strictly Halal',
        quranRecitation: 'daily',
        modestyPractice: 'modest',
        hajjUmrahStatus: 'planning',
        deenRelationshipBio: 'Alhamdulillah'
      }
    });

    // Mock live mutual matches endpoint returning 1 match
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/matches/mutual')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            matches: [
              {
                id: 'usr_candidate_tariq',
                fullName: 'Tariq Hussain',
                photos: ['https://example.com/tariq.jpg']
              }
            ]
          })
        });
      }
      if (url.includes('/matches/received')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            candidates: []
          })
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({ success: true }) });
    });

    const notifs = await notificationService.syncLiveNotifications();
    expect(notifs.length).toBe(1);
    expect(notifs[0].type).toBe('match');
    expect(notifs[0].title).toContain('Tariq');
    expect(notifs[0].read).toBe(false);
    expect(notificationService.hasUnread()).toBe(true);
  });

  it('3. Synchronizes incoming likes from candidates and alerts user', async () => {
    dbService.setCurrentUser({
      id: 'usr_test_receiver_2',
      fullName: 'Hamza Brother',
      gender: 'male',
      email: 'hamza@test.com',
      phone: '',
      dob: '1996-01-01',
      age: 30,
      location: 'Lahore, Pakistan',
      profession: 'Engineer',
      education: 'MSc',
      height: "5'11\"",
      ethnicity: 'South Asian',
      familyStructure: 'nuclear',
      livingPreference: 'independent',
      siblingsCount: 1,
      willingnessToRelocate: 'open',
      smokingStatus: 'non_smoker',
      languagesSpoken: 'English, Urdu',
      mahrPhilosophy: 'mutual_agreement',
      childrenDesire: 'desires_children',
      marriageTimeline: 'within_1_year',
      bio: 'Seeking pious spouse',
      blurPhotosByDefault: false,
      profileVisibility: 'all_users',
      photos: ['https://example.com/hamza.jpg'],
      religiousProfile: {
        practiceLevel: 'practicing',
        sect: 'Sunni',
        madhhab: 'Hanafi',
        prayerFrequency: '5 times daily',
        halalDiet: 'Strictly Halal',
        quranRecitation: 'daily',
        modestyPractice: 'modest',
        hajjUmrahStatus: 'planning',
        deenRelationshipBio: 'Deen first'
      }
    });

    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/matches/mutual')) {
        return Promise.resolve({
          json: () => Promise.resolve({ success: true, matches: [] })
        });
      }
      if (url.includes('/matches/received')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            candidates: [
              {
                id: 'usr_sister_fatima',
                fullName: 'Fatima Zahra',
                photos: ['https://example.com/fatima.jpg']
              }
            ]
          })
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({ success: true }) });
    });

    const notifs = await notificationService.syncLiveNotifications();
    expect(notifs.length).toBe(1);
    expect(notifs[0].type).toBe('like');
    expect(notifs[0].title).toContain('Interest');
    expect(notifs[0].message).toContain('Fatima');
    expect(notifs[0].read).toBe(false);
  });

  it('4. Mark as read and markAllAsRead correctly clears unread badge', () => {
    // Inject two notifications
    const testList: LiveNotification[] = [
      {
        id: 'n_1',
        type: 'like',
        title: 'New Like',
        message: 'Someone liked you',
        time: 'Just now',
        timestamp: Date.now(),
        read: false
      },
      {
        id: 'n_2',
        type: 'match',
        title: 'New Match',
        message: 'Mutual match!',
        time: 'Just now',
        timestamp: Date.now(),
        read: false
      }
    ];

    const storageKey = `serene_live_notifications_${dbService.getCurrentUser().id || 'guest'}`;
    localStorage.setItem(storageKey, JSON.stringify(testList));

    expect(notificationService.hasUnread()).toBe(true);

    notificationService.markAsRead('n_1');
    const updated = notificationService.getNotifications();
    expect(updated.find(n => n.id === 'n_1')?.read).toBe(true);
    expect(notificationService.hasUnread()).toBe(true); // n_2 is still unread

    notificationService.markAllAsRead();
    expect(notificationService.hasUnread()).toBe(false);
    expect(notificationService.getNotifications().every(n => n.read)).toBe(true);
  });
});
