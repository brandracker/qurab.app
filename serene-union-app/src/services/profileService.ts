import type { UserProfile } from '../types';
import { WORKER_API_BASE, API_BASE } from './apiConfig';

export const USER_KEY = 'serene_current_user_v1';
export const PROFILES_KEY = 'serene_real_profiles_v3';

export const profileService = {
  getGuestUser(): UserProfile {
    return {
      id: 'usr_guest',
      phone: '',
      email: '',
      fullName: 'New Member',
      dob: '1998-01-01',
      age: 28,
      gender: 'male',
      location: 'Global',
      profession: 'Member',
      education: 'Graduate',
      height: "5'11\" (180 cm)",
      ethnicity: 'Global',
      marriageTimeline: 'within_1_year',
      bio: 'Seeking half my deen.',
      blurPhotosByDefault: true,
      profileVisibility: 'all_users',
      photos: [],
      religiousProfile: {
        practiceLevel: 'practicing',
        sect: 'Sunni',
        madhhab: 'Hanafi',
        prayerFrequency: '5 times daily',
        halalDiet: 'Strictly Halal'
      }
    };
  },

  getCurrentUser(): UserProfile {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (localStorage.getItem(`serene_vip_${parsed.id}`) === 'true') {
          parsed.isVip = true;
        }
        localStorage.setItem(USER_KEY, JSON.stringify(parsed));
        return parsed;
      } catch {}
    }
    return this.getGuestUser();
  },

  setCurrentUser(user: UserProfile): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (quotaErr) {
      console.warn('LocalStorage quota constraint detected, applying storage protection:', quotaErr);
      try {
        const lightweightUser: UserProfile = {
          ...user,
          photos: (user.photos || []).slice(0, 2)
        };
        localStorage.setItem(USER_KEY, JSON.stringify(lightweightUser));
      } catch {
        try {
          const minimalUser: UserProfile = { ...user, photos: [] };
          localStorage.setItem(USER_KEY, JSON.stringify(minimalUser));
        } catch {}
      }
    }
  },

  async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId || userId === 'usr_guest') return null;
    try {
      const endpoints = [
        `${API_BASE}/users/${userId}`,
        `/api/users/${userId}`,
        `${API_BASE}/profiles/${userId}`,
        `/api/profiles/${userId}`
      ];

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep);
          if (!res.ok) continue;
          const data = await res.json();
          if (data.success && data.profile) {
            const current = this.getCurrentUser();
            const merged: UserProfile = {
              ...current,
              ...data.profile,
              photos: (data.profile.photos && data.profile.photos.length > 0) ? data.profile.photos : (current.photos || []),
              isVip: (typeof data.profile.isVip === 'boolean') ? data.profile.isVip : current.isVip,
              isProfileCompleted: (typeof data.profile.isProfileCompleted === 'boolean') ? data.profile.isProfileCompleted : current.isProfileCompleted
            };
            this.setCurrentUser(merged);
            window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: merged } }));
            return merged;
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Failed to fetch user profile:', e);
    }
    return null;
  },

  async updateBioLive(userId: string, bio: string): Promise<boolean> {
    if (!userId || userId === 'usr_guest') return false;
    const current = this.getCurrentUser();
    if (current.id === userId) {
      current.bio = bio;
      if (current.religiousProfile) {
        current.religiousProfile.deenRelationshipBio = bio;
      }
      this.setCurrentUser(current);
      window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: current } }));
    }

    try {
      const endpoints = [
        `${API_BASE}/users/bio`,
        `/api/users/bio`,
        `${WORKER_API_BASE}/users/bio`
      ];
      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, bio })
          });
          if (res.ok) return true;
        } catch {}
      }
    } catch (e) {
      console.warn('updateBioLive error:', e);
    }
    return true;
  },

  async updateUserProfileLive(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const current = this.getCurrentUser();
    const merged: UserProfile = { ...current, ...updates, id: userId };

    if (!userId || userId === 'usr_guest') {
      this.setCurrentUser(merged);
      window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: merged } }));
      return merged;
    }

    try {
      const endpoints = [
        `${API_BASE}/users/${userId}`,
        `/api/users/${userId}`,
        `${WORKER_API_BASE}/users/${userId}`,
        `${API_BASE}/profiles`,
        `/api/profiles`
      ];

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            method: ep.includes('/profiles') && !ep.includes('/profile') ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(merged)
          });
          if (res.ok) {
            this.setCurrentUser(merged);
            window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: merged } }));
            return merged;
          }
        } catch {}
      }
    } catch (e) {
      console.warn('updateUserProfileLive error:', e);
    }

    this.setCurrentUser(merged);
    window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: merged } }));
    return merged;
  },

  async deactivateAccount(userId: string): Promise<boolean> {
    if (!userId || userId === 'usr_guest') return false;
    try {
      const endpoints = [
        `${API_BASE}/users/${userId}/deactivate`,
        `/api/users/${userId}/deactivate`,
        `${WORKER_API_BASE}/users/${userId}/deactivate`
      ];
      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, { method: 'POST' });
          if (res.ok) break;
        } catch {}
      }
    } catch (e) {
      console.warn('deactivateAccount API warning:', e);
    }
    const current = this.getCurrentUser();
    if (current.id === userId) {
      current.accountStatus = 'deactivated';
      this.setCurrentUser(current);
      window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: current } }));
    }
    return true;
  },

  async reactivateAccount(userId: string): Promise<boolean> {
    if (!userId || userId === 'usr_guest') return false;
    try {
      const endpoints = [
        `${API_BASE}/users/${userId}/reactivate`,
        `/api/users/${userId}/reactivate`,
        `${WORKER_API_BASE}/users/${userId}/reactivate`
      ];
      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, { method: 'POST' });
          if (res.ok) break;
        } catch {}
      }
    } catch (e) {
      console.warn('reactivateAccount API warning:', e);
    }
    const current = this.getCurrentUser();
    if (current.id === userId) {
      current.accountStatus = 'active';
      this.setCurrentUser(current);
      window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: current } }));
    }
    return true;
  },

  async deleteAccount(userId: string): Promise<boolean> {
    if (!userId || userId === 'usr_guest') return false;
    try {
      const endpoints = [
        `${API_BASE}/users/${userId}`,
        `/api/users/${userId}`,
        `${WORKER_API_BASE}/users/${userId}`
      ];
      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, { method: 'DELETE' });
          if (res.ok) break;
        } catch {}
      }
    } catch (e) {
      console.warn('deleteAccount API warning:', e);
    }

    const keysToPurge = [
      USER_KEY,
      'serene_auth_token_v1',
      `serene_likes_sent_${userId}`,
      `serene_passed_${userId}`,
      `serene_blocked_${userId}`,
      `serene_vip_${userId}`,
      `serene_spotlight_active_${userId}`,
      `serene_spotlight_expires_${userId}`,
      `serene_salams_left_${userId}`,
      `serene_salam_ads_${userId}`,
      'serene_real_conversations_v3',
      PROFILES_KEY
    ];
    keysToPurge.forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });

    window.dispatchEvent(new CustomEvent('serene_account_deleted'));
    return true;
  }
};
