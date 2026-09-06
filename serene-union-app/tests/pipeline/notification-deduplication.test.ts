import { describe, it, expect, beforeEach, vi } from 'vitest';
import { notificationService } from '../../src/services/notificationService';
import { dbService } from '../../src/services/dbService';
import type { UserProfile } from '../../src/types';

describe('Real-World Pipeline: Notification Deterministic IDs & Deduplication', () => {
  const mockUser: UserProfile = {
    id: 'usr_me_notif',
    fullName: 'Zayd Khan',
    email: 'zayd@test.com',
    gender: 'male',
    dob: '1996-03-12',
    age: 30,
    location: 'Manchester, UK',
    isProfileCompleted: true,
    blurPhotosByDefault: false,
    photos: []
  };

  beforeEach(() => {
    localStorage.clear();
    dbService.setCurrentUser(mockUser);
    notificationService.clearAll();
  });

  it('1. Deterministic IDs and semantic deduplication prevent duplicate match notifications', () => {
    // Add first notification from match action
    const notif1 = notificationService.addNotification({
      type: 'match',
      title: 'Connected with Fatima 🎉',
      message: 'You and Fatima both expressed mutual interest.',
      targetId: 'conv_usr_me_notif_usr_partner_1',
      actionLabel: 'Open Chat'
    });

    expect(notif1.id).toBe('notif_match_usr_me_notif_usr_partner_1');
    expect(notificationService.getNotifications().length).toBe(1);

    // Add another notification for the same match (e.g. from background sync or second click)
    const notif2 = notificationService.addNotification({
      type: 'match',
      title: 'Connected with Fatima 🎉',
      message: 'You and Fatima both expressed mutual interest.',
      targetId: 'conv_usr_me_notif_usr_partner_1',
      actionLabel: 'Open Chat'
    });

    // Should update in-place, NOT append a duplicate
    const all = notificationService.getNotifications();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe('notif_match_usr_me_notif_usr_partner_1');
  });

  it('2. Semantic deduplication prevents duplicate like interest notifications for same candidate', () => {
    // Add like notification
    notificationService.addNotification({
      type: 'like',
      title: 'New Matrimonial Interest 💖',
      message: 'Sarah expressed interest in your profile!',
      targetId: 'usr_candidate_sarah',
      actionLabel: 'View in Matches'
    });

    expect(notificationService.getNotifications().length).toBe(1);

    // Duplicate like attempt
    notificationService.addNotification({
      type: 'like',
      title: 'New Matrimonial Interest 💖',
      message: 'Sarah expressed interest in your profile!',
      targetId: 'usr_candidate_sarah',
      actionLabel: 'View in Matches'
    });

    // Length must remain 1
    const current = notificationService.getNotifications();
    expect(current.length).toBe(1);
    expect(current[0].targetId).toBe('usr_candidate_sarah');
  });

  it('3. syncLiveNotifications merges remote D1 notifications without duplicating local entries', async () => {
    // Pre-seed a local match notification
    notificationService.addNotification({
      type: 'match',
      title: 'Connected with Amina 🎉',
      message: 'Mutual match active',
      targetId: 'conv_usr_candidate_amina_usr_me_notif',
      actionLabel: 'Open Chat'
    });

    // Mock global fetch for D1 endpoints
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/notifications?')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            notifications: [
              {
                id: 'notif_match_usr_candidate_amina_usr_me_notif',
                type: 'match',
                title: 'Connected with Amina 🎉',
                message: 'Mutual match active',
                targetId: 'conv_usr_candidate_amina_usr_me_notif',
                actionLabel: 'Open Chat',
                read: false,
                timestamp: Date.now()
              }
            ]
          })
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, matches: [], candidates: [] }) });
    }) as any;

    await notificationService.syncLiveNotifications();

    const items = notificationService.getNotifications();
    expect(items.length).toBe(1);
    expect(items[0].targetId).toBe('conv_usr_candidate_amina_usr_me_notif');

    globalThis.fetch = originalFetch;
  });
});
