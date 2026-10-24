import type { UserProfile, Conversation, ChatMessage, FilterState } from '../types';

import { API_BASE, WORKER_API_BASE, LOCAL_API_BASE } from './apiConfig';
export { API_BASE, WORKER_API_BASE, LOCAL_API_BASE };

import { profileService } from './profileService';
export { profileService };
export { matchService } from './matchService';
export { chatService } from './chatService';
export { walletService } from './walletService';

export const FALLBACK_PROFILES: UserProfile[] = [
  {
    id: 'usr_f_fallback_1',
    phone: '',
    fullName: 'Aisha Al-Mansoor',
    dob: '1998-04-15',
    age: 28,
    gender: 'female',
    location: 'London, UK',
    city: 'London',
    country: 'United Kingdom',
    profession: 'Data Analyst',
    education: 'MSc Data Science, UCL',
    height: "5'5\" (165 cm)",
    ethnicity: 'Arab / Middle Eastern',
    marriageTimeline: 'within_1_year',
    bio: 'Family-oriented, love weekend nature walks, reading, and Quran circles. Seeking a practicing companion with kindness and good humor.',
    blurPhotosByDefault: true,
    profileVisibility: 'all_users',
    accountStatus: 'active',
    voiceGreetingUrl: 'https://serene-union-api.brandracker.workers.dev/api/photos/media/voice_usr_1788698668775_1788715872303.webm',
    voiceGreetingDuration: 40,
    photos: [],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  },
  {
    id: 'usr_f_fallback_2',
    phone: '',
    fullName: 'Maryam Khan',
    dob: '1999-01-10',
    age: 27,
    gender: 'female',
    location: 'Dubai, UAE',
    city: 'Dubai',
    country: 'UAE',
    profession: 'Architect',
    education: 'B.Arch, AUS Dubai',
    height: "5'4\" (163 cm)",
    ethnicity: 'South Asian',
    marriageTimeline: 'within_1_year',
    bio: 'Creative soul passionate about Islamic architecture, art, and family gatherings. Seeking a pious life partner.',
    blurPhotosByDefault: true,
    profileVisibility: 'all_users',
    accountStatus: 'active',
    voiceGreetingUrl: 'https://serene-union-api.brandracker.workers.dev/api/photos/media/voice_usr_1788698668775_1788715872303.webm',
    voiceGreetingDuration: 35,
    photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  },
  {
    id: 'usr_f_fallback_3',
    phone: '',
    fullName: 'Fatima Zahra',
    dob: '1997-03-25',
    age: 29,
    gender: 'female',
    location: 'Manchester, UK',
    city: 'Manchester',
    country: 'United Kingdom',
    profession: 'Speech Therapist',
    education: 'BSc Speech Sciences',
    height: "5'6\" (168 cm)",
    ethnicity: 'North African',
    marriageTimeline: 'within_1_year',
    bio: 'Calm and patient temperament. Love baking, charity projects, and striving to learn classical Arabic.',
    blurPhotosByDefault: true,
    profileVisibility: 'all_users',
    accountStatus: 'active',
    photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Maliki',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  },
  {
    id: 'usr_m_fallback_1',
    phone: '',
    fullName: 'Zayn Malik',
    dob: '1996-08-22',
    age: 30,
    gender: 'male',
    location: 'Toronto, Canada',
    city: 'Toronto',
    country: 'Canada',
    profession: 'Software Engineer',
    education: 'BSc Computer Science, Waterloo',
    height: "6'0\" (183 cm)",
    ethnicity: 'South Asian',
    marriageTimeline: 'within_1_year',
    bio: 'Tech enthusiast, love specialty coffee and mosque community work. Striving for 5 daily prayers.',
    blurPhotosByDefault: false,
    profileVisibility: 'all_users',
    accountStatus: 'active',
    voiceGreetingUrl: 'https://serene-union-api.brandracker.workers.dev/api/photos/media/voice_usr_1787950367460_1788715719148.webm',
    voiceGreetingDuration: 45,
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Shafi\'i',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  },
  {
    id: 'usr_m_fallback_2',
    phone: '',
    fullName: 'Bilal Siddiqui',
    dob: '1994-06-18',
    age: 32,
    gender: 'male',
    location: 'Chicago, USA',
    city: 'Chicago',
    country: 'United States',
    profession: 'Clinical Pharmacist',
    education: 'PharmD, UIC',
    height: "6'1\" (185 cm)",
    ethnicity: 'South Asian',
    marriageTimeline: 'within_1_year',
    bio: 'Grounded in sunnah. Passionate about community health, youth mentorship, and Quran memorization.',
    blurPhotosByDefault: false,
    profileVisibility: 'all_users',
    accountStatus: 'active',
    voiceGreetingUrl: 'https://serene-union-api.brandracker.workers.dev/api/photos/media/voice_usr_1788374673089_1788375079217.webm',
    voiceGreetingDuration: 50,
    photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  },
  {
    id: 'usr_m_fallback_3',
    phone: '',
    fullName: 'Hamza Qureshi',
    dob: '1996-02-14',
    age: 30,
    gender: 'male',
    location: 'San Francisco, USA',
    city: 'San Francisco',
    country: 'United States',
    profession: 'Product Designer',
    education: 'BFA Design, Stanford',
    height: "5'10\" (178 cm)",
    ethnicity: 'South Asian',
    marriageTimeline: 'within_1_year',
    bio: 'Creative designer, outdoor photographer, and mosque volunteer. Seeking a pious life partner.',
    blurPhotosByDefault: false,
    profileVisibility: 'all_users',
    accountStatus: 'active',
    voiceGreetingUrl: 'https://serene-union-api.brandracker.workers.dev/api/photos/media/voice_usr_1787950367460_1788715719148.webm',
    voiceGreetingDuration: 42,
    photos: ['https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  }
];

class DBService {
  private profilesKey = 'serene_real_profiles_v3';
  private conversationsKey = 'serene_real_conversations_v3';
  private userKey = 'serene_current_user_v1';
  private currentUserId = '';
  private memoryProfiles: UserProfile[] = [];

  constructor() {
    const saved = localStorage.getItem(this.userKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id) this.currentUserId = parsed.id;
      } catch {}
    }
  }

  getCachedDiscoverProfiles(): UserProfile[] {
    try {
      const cached = localStorage.getItem('serene_cached_discover_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [];
  }

  async fetchLiveProfiles(filters?: FilterState): Promise<UserProfile[]> {
    try {
      const user = this.getCurrentUser();
      const targetGender = user.gender === 'female' ? 'male' : (user.gender === 'male' ? 'female' : '');
      let queryParams = `userId=${encodeURIComponent(user.id || '')}&gender=${encodeURIComponent(user.gender || '')}&targetGender=${encodeURIComponent(targetGender)}&limit=25`;
      if (typeof user.latitude === 'number' && typeof user.longitude === 'number') {
        queryParams += `&lat=${user.latitude}&lon=${user.longitude}`;
      } else if (user.city || user.location) {
        queryParams += `&city=${encodeURIComponent(user.city || user.location || '')}`;
      }
      // Only filter by distance if maxDistance is explicitly set > 0
      if (filters?.maxDistance && filters.maxDistance > 0 && filters.maxDistance < 5000) {
        queryParams += `&maxDistance=${filters.maxDistance}`;
      }
      if (filters?.sects && filters.sects.length > 0) {
        queryParams += `&sects=${encodeURIComponent(filters.sects.join(','))}`;
      }
      if (filters?.practiceLevels && filters.practiceLevels.length > 0) {
        queryParams += `&practiceLevels=${encodeURIComponent(filters.practiceLevels.join(','))}`;
      }
      if (filters?.minAge && filters.minAge >= 18) {
        queryParams += `&minAge=${filters.minAge}`;
      }
      if (filters?.maxAge && filters.maxAge <= 80) {
        queryParams += `&maxAge=${filters.maxAge}`;
      }

      const endpoints = [
        `${API_BASE}/profiles/discover?${queryParams}`,
        `/api/profiles/discover?${queryParams}`
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint);
          if (!res.ok) continue;
          const data = await res.json();
          if (data.success && Array.isArray(data.profiles) && data.profiles.length > 0) {
            const activeProfiles = data.profiles.filter((p: UserProfile) => p.accountStatus !== 'deactivated' && p.profileVisibility !== 'hidden');
            // Sanitize heavy base64 photos to prevent QuotaExceededError on Android WebView
            const lightweightProfiles = activeProfiles.map((p: UserProfile) => ({
              ...p,
              photos: (p.photos || []).map(photo => {
                if (typeof photo === 'string' && photo.startsWith('data:') && photo.length > 50000) return '';
                return photo;
              }).filter(Boolean)
            }));
            this.memoryProfiles = activeProfiles;
            try {
              localStorage.setItem('serene_cached_discover_v2', JSON.stringify(lightweightProfiles.slice(0, 25)));
              localStorage.setItem(this.profilesKey, JSON.stringify(lightweightProfiles));
            } catch (storageErr) {
              console.warn('Storage quota limit reached on mobile, keeping profiles in memory:', storageErr);
            }
            return activeProfiles;
          }
        } catch {
          // try next endpoint
        }
      }
    } catch {
      // offline fallback
    }
    return this.getAllProfiles();
  }

  // Live Cloudflare D1 User Profile Hydration (Single Source of Truth)
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
            if (userId === current.id) {
              const merged: UserProfile = {
                ...current,
                ...data.profile,
                isVip: (typeof data.profile.isVip === 'boolean') ? data.profile.isVip : current.isVip,
                isProfileCompleted: (typeof data.profile.isProfileCompleted === 'boolean') ? data.profile.isProfileCompleted : current.isProfileCompleted
              };
              this.setCurrentUser(merged);
              window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: merged } }));
              return merged;
            }
            return data.profile as UserProfile;
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Failed to fetch user profile:', e);
    }
    return null;
  }

  // Live Cloudflare D1 Bio Update (Single Source of Truth)
  async updateBioLive(userId: string, bio: string): Promise<boolean> {
    if (!userId || userId === 'usr_guest') return false;
    const cleanBio = bio.trim();
    try {
      const endpoints = [
        `${API_BASE}/users/${userId}/bio`,
        `/api/users/${userId}/bio`
      ];

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bio: cleanBio })
          });
          if (res.ok) {
            const current = this.getCurrentUser();
            const updated: UserProfile = {
              ...current,
              bio: cleanBio,
              religiousProfile: {
                ...current.religiousProfile,
                deenRelationshipBio: cleanBio
              }
            };
            this.setCurrentUser(updated);
            window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: updated } }));
            return true;
          }
        } catch {}
      }
    } catch (e) {
      console.warn('updateBioLive error:', e);
    }
    // Fallback update local state
    const current = this.getCurrentUser();
    const updated: UserProfile = {
      ...current,
      bio: cleanBio,
      religiousProfile: {
        ...current.religiousProfile,
        deenRelationshipBio: cleanBio
      }
    };
    this.setCurrentUser(updated);
    window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: updated } }));
    return true;
  }

  // Live Cloudflare D1 User Profile Update (Single Source of Truth)
  async updateUserProfileLive(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!userId || userId === 'usr_guest') return null;
    const current = this.getCurrentUser();
    const merged: UserProfile = { ...current, ...updates, id: userId };

    try {
      const endpoints = [
        `${API_BASE}/users/${userId}/profile`,
        `/api/users/${userId}/profile`,
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
      window.dispatchEvent(new CustomEvent('serene_sync_notice', { detail: { status: 'offline', message: 'Saved locally' } }));
    }

    // Local state fallback if network is offline
    this.setCurrentUser(merged);
    window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: merged } }));
    return merged;
  }

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
      blurPhotosByDefault: false,
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
  }

  setCurrentUser(user: UserProfile): void {
    if (this.currentUserId && this.currentUserId !== user.id) {
      try {
        localStorage.removeItem(this.conversationsKey);
      } catch {}
    }

    // Auto-migrate any activities performed as guest (usr_guest) to newly authenticated user
    if (user.id && user.id !== 'usr_guest') {
      try {
        const guestLikes = this.getUserLikesSent('usr_guest');
        const guestPassed = this.getUserPassed('usr_guest');
        const guestBlocked = this.getUserBlocked('usr_guest');

        if (guestLikes.length > 0 || guestPassed.length > 0 || guestBlocked.length > 0) {
          const userLikes = this.getUserLikesSent(user.id);
          const userPassed = this.getUserPassed(user.id);
          const userBlocked = this.getUserBlocked(user.id);

          const mergedLikes = [...guestLikes, ...userLikes.filter(u => !guestLikes.some(g => g.id === u.id))];
          const mergedPassed = [...guestPassed, ...userPassed.filter(u => !guestPassed.some(g => g.id === u.id))];
          const mergedBlocked = [...guestBlocked, ...userBlocked.filter(u => !guestBlocked.some(g => g.id === u.id))];

          localStorage.setItem(`serene_likes_sent_${user.id}`, JSON.stringify(mergedLikes));
          localStorage.setItem(`serene_passed_${user.id}`, JSON.stringify(mergedPassed));
          localStorage.setItem(`serene_blocked_${user.id}`, JSON.stringify(mergedBlocked));

          // Clean up guest local keys to avoid re-triggering migration
          localStorage.removeItem('serene_likes_sent_usr_guest');
          localStorage.removeItem('serene_passed_usr_guest');
          localStorage.removeItem('serene_blocked_usr_guest');

          // Async sync to Cloudflare D1
          fetch(`${API_BASE}/matches/migrate-guest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guestId: 'usr_guest', authenticatedId: user.id })
          }).catch(() => {});
        }
      } catch (err) {
        console.warn('Guest migration notice:', err);
      }
    }

    this.currentUserId = user.id;
    try {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } catch (quotaErr) {
      console.warn('LocalStorage quota constraint detected, applying storage protection:', quotaErr);
      try {
        // If photos are large, store a lightweight profile in localStorage
        const lightweightUser: UserProfile = {
          ...user,
          photos: (user.photos || []).slice(0, 2)
        };
        localStorage.setItem(this.userKey, JSON.stringify(lightweightUser));
      } catch {
        try {
          const minimalUser: UserProfile = {
            ...user,
            photos: []
          };
          localStorage.setItem(this.userKey, JSON.stringify(minimalUser));
        } catch {}
      }
    }
  }

  updateCurrentUser(partial: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser();
    const updated = { ...current, ...partial };
    this.setCurrentUser(updated);
    return updated;
  }

  getCurrentUser(): UserProfile {
    const saved = localStorage.getItem(this.userKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (localStorage.getItem(`serene_vip_${parsed.id}`) === 'true') {
          parsed.isVip = true;
        }
        localStorage.setItem(this.userKey, JSON.stringify(parsed));
        return parsed;
      } catch {}
    }

    return this.getGuestUser();
  }

  getAllProfiles(): UserProfile[] {
    const data = localStorage.getItem(this.profilesKey);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    if (this.memoryProfiles.length > 0) {
      return this.memoryProfiles;
    }
    return FALLBACK_PROFILES;
  }

  getUserLikesSent(userId: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(`serene_likes_sent_${userId}`) || '[]');
    } catch { return []; }
  }

  getUserPassed(userId: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(`serene_passed_${userId}`) || '[]');
    } catch { return []; }
  }

  getUserBlocked(userId: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(`serene_blocked_${userId}`) || '[]');
    } catch { return []; }
  }

  getDirectSalams(userId: string): number {
    try {
      const saved = localStorage.getItem(`serene_salams_left_${userId}`);
      return saved !== null ? parseInt(saved, 10) : 2;
    } catch { return 2; }
  }

  getAdsWatchedForSalam(userId: string): number {
    try {
      const saved = localStorage.getItem(`serene_salam_ads_${userId}`);
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch { return 0; }
  }

  getSpotlightInfo(userId: string): { isSpotlightActive: boolean; spotlightExpiresAt: string | null } {
    try {
      const active = localStorage.getItem(`serene_spotlight_active_${userId}`) === 'true';
      const expiresAt = localStorage.getItem(`serene_spotlight_expires_${userId}`);
      if (active && expiresAt && new Date(expiresAt).getTime() < Date.now()) {
        localStorage.setItem(`serene_spotlight_active_${userId}`, 'false');
        return { isSpotlightActive: false, spotlightExpiresAt: null };
      }
      return { isSpotlightActive: active, spotlightExpiresAt: expiresAt };
    } catch {
      return { isSpotlightActive: false, spotlightExpiresAt: null };
    }
  }

  async fetchLikesRemaining(userId: string): Promise<{
    likesRemaining: number;
    isVip: boolean;
    directSalams: number;
    adsWatchedForSalam: number;
    isSpotlightActive: boolean;
    spotlightExpiresAt: string | null;
  }> {
    const localKey = `serene_likes_left_${userId}`;
    const fallbackCount = parseInt(localStorage.getItem(localKey) || '50', 10);
    const fallbackVip = Boolean(localStorage.getItem(`serene_vip_${userId}`) === 'true');
    const fallbackSalams = parseInt(localStorage.getItem(`serene_salams_left_${userId}`) || '2', 10);
    const fallbackAdsWatched = parseInt(localStorage.getItem(`serene_salam_ads_${userId}`) || '0', 10);
    const fallbackSpotlight = Boolean(localStorage.getItem(`serene_spotlight_active_${userId}`) === 'true');
    const fallbackSpotlightExpires = localStorage.getItem(`serene_spotlight_expires_${userId}`) || null;

    if (!userId || userId === 'usr_guest') {
      return {
        likesRemaining: fallbackCount,
        isVip: fallbackVip,
        directSalams: fallbackSalams,
        adsWatchedForSalam: fallbackAdsWatched,
        isSpotlightActive: fallbackSpotlight,
        spotlightExpiresAt: fallbackSpotlightExpires
      };
    }

    try {
      const res = await fetch(`${API_BASE}/wallet/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.wallet) {
          const liveRemaining = data.wallet.likesRemaining ?? fallbackCount;
          const liveVip = Boolean(data.wallet.isVip);
          const liveSalams = data.wallet.directSalams ?? fallbackSalams;
          const liveAdsWatched = data.wallet.adsWatchedForSalam ?? fallbackAdsWatched;
          const liveSpotlight = Boolean(data.wallet.isSpotlightActive);
          const liveSpotlightExpires = data.wallet.spotlightExpiresAt || null;
          
          try {
            localStorage.setItem(localKey, liveRemaining.toString());
            localStorage.setItem(`serene_vip_${userId}`, liveVip ? 'true' : 'false');
            localStorage.setItem(`serene_salams_left_${userId}`, liveSalams.toString());
            localStorage.setItem(`serene_salam_ads_${userId}`, liveAdsWatched.toString());
            localStorage.setItem(`serene_spotlight_active_${userId}`, liveSpotlight ? 'true' : 'false');
            if (liveSpotlightExpires) {
              localStorage.setItem(`serene_spotlight_expires_${userId}`, liveSpotlightExpires);
            }
          } catch {}

          const cur = this.getCurrentUser();
          if (cur.id === userId && cur.isVip !== liveVip) {
            this.setCurrentUser({ ...cur, isVip: liveVip });
            window.dispatchEvent(new CustomEvent('serene_vip_updated', { detail: { userId, isVip: liveVip } }));
          }

          window.dispatchEvent(new CustomEvent('serene_salams_updated', { detail: { userId, directSalams: liveSalams } }));
          window.dispatchEvent(new CustomEvent('serene_spotlight_updated', { detail: { userId, isSpotlightActive: liveSpotlight, spotlightExpiresAt: liveSpotlightExpires } }));

          return {
            likesRemaining: liveRemaining,
            isVip: liveVip,
            directSalams: liveSalams,
            adsWatchedForSalam: liveAdsWatched,
            isSpotlightActive: liveSpotlight,
            spotlightExpiresAt: liveSpotlightExpires
          };
        }
      }
    } catch (e) {
      console.warn('Live wallet sync notice:', e);
    }
    return {
      likesRemaining: fallbackCount,
      isVip: fallbackVip,
      directSalams: fallbackSalams,
      adsWatchedForSalam: fallbackAdsWatched,
      isSpotlightActive: fallbackSpotlight,
      spotlightExpiresAt: fallbackSpotlightExpires
    };
  }

  async consumeDailyLike(userId: string): Promise<{ success: boolean; likesRemaining: number }> {
    const localKey = `serene_likes_left_${userId}`;
    const currentLocal = parseInt(localStorage.getItem(localKey) || '50', 10);
    const nextLocal = Math.max(0, currentLocal - 1);
    try {
      localStorage.setItem(localKey, nextLocal.toString());
    } catch {}

    window.dispatchEvent(new CustomEvent('serene_likes_updated', { detail: { userId, likesRemaining: nextLocal } }));

    if (!userId || userId === 'usr_guest') {
      return { success: true, likesRemaining: nextLocal };
    }

    try {
      const res = await fetch(`${API_BASE}/wallet/use-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const liveRemaining = data.likesRemaining ?? nextLocal;
          try {
            localStorage.setItem(localKey, liveRemaining.toString());
          } catch {}
          window.dispatchEvent(new CustomEvent('serene_likes_updated', { detail: { userId, likesRemaining: liveRemaining } }));
          return { success: true, likesRemaining: liveRemaining };
        }
      }
    } catch (e) {
      console.warn('Consume live like notice:', e);
    }
    return { success: true, likesRemaining: nextLocal };
  }

  async consumeDirectSalam(userId: string): Promise<{ success: boolean; directSalams: number }> {
    const localKey = `serene_salams_left_${userId}`;
    const currentLocal = parseInt(localStorage.getItem(localKey) || '2', 10);
    const nextLocal = Math.max(0, currentLocal - 1);
    try {
      localStorage.setItem(localKey, nextLocal.toString());
    } catch {}

    window.dispatchEvent(new CustomEvent('serene_salams_updated', { detail: { userId, directSalams: nextLocal } }));

    if (!userId || userId === 'usr_guest') {
      return { success: true, directSalams: nextLocal };
    }

    try {
      const res = await fetch(`${API_BASE}/wallet/use-direct-salam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && typeof data.directSalams === 'number') {
          try {
            localStorage.setItem(localKey, data.directSalams.toString());
          } catch {}
          window.dispatchEvent(new CustomEvent('serene_salams_updated', { detail: { userId, directSalams: data.directSalams } }));
          return { success: true, directSalams: data.directSalams };
        }
      }
    } catch (e) {
      console.warn('Consume live Direct Salam notice:', e);
    }
    return { success: true, directSalams: nextLocal };
  }

  async claimAdReward(userId: string, rewardType: 'likes' | 'salam' | 'messages' | 'photo_unblur' | 'undo' = 'likes'): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/wallet/reward-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rewardType })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (typeof data.directSalams === 'number') {
            localStorage.setItem(`serene_salams_left_${userId}`, data.directSalams.toString());
            window.dispatchEvent(new CustomEvent('serene_salams_updated', { detail: { userId, directSalams: data.directSalams } }));
          }
          if (typeof data.adsWatchedForSalam === 'number') {
            localStorage.setItem(`serene_salam_ads_${userId}`, data.adsWatchedForSalam.toString());
            window.dispatchEvent(new CustomEvent('serene_salam_ads_updated', { detail: { userId, adsWatched: data.adsWatchedForSalam } }));
          }
          if (typeof data.likesRemaining === 'number') {
            localStorage.setItem(`serene_likes_left_${userId}`, data.likesRemaining.toString());
            window.dispatchEvent(new CustomEvent('serene_likes_updated', { detail: { userId, likesRemaining: data.likesRemaining } }));
          }
          return data;
        }
      }
    } catch (e) {
      console.warn('Claim ad reward notice:', e);
    }
    return null;
  }

  // 1-to-1 Modesty Photo Reveal system
  isPhotoRevealedTo(ownerId: string, viewerId: string): boolean {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(`serene_revealed_${ownerId}`) || '[]');
      return list.includes(viewerId);
    } catch { return false; }
  }

  togglePhotoReveal(ownerId: string, viewerId: string): boolean {
    try {
      const key = `serene_revealed_${ownerId}`;
      const list: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      const idx = list.indexOf(viewerId);
      let isRevealed = false;
      if (idx > -1) {
        list.splice(idx, 1);
        isRevealed = false;
      } else {
        list.push(viewerId);
        isRevealed = true;
      }
      localStorage.setItem(key, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('serene_activity_updated'));
      return isRevealed;
    } catch { return false; }
  }

  // Live 1-to-1 Modesty Photo Reveal Sync to Cloudflare D1
  async togglePhotoRevealLive(convId: string, ownerId: string, viewerId: string, isRevealed: boolean): Promise<boolean> {
    // 1. Immediately update local fallback
    try {
      const key = `serene_revealed_${ownerId}`;
      const list: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      const idx = list.indexOf(viewerId);
      if (isRevealed) {
        if (idx === -1) list.push(viewerId);
      } else {
        if (idx > -1) list.splice(idx, 1);
      }
      localStorage.setItem(key, JSON.stringify(list));

      // Object key compatibility
      const objKey = `serene_photo_reveals_${ownerId}`;
      const saved = JSON.parse(localStorage.getItem(objKey) || '{}');
      saved[viewerId] = isRevealed;
      localStorage.setItem(objKey, JSON.stringify(saved));

      window.dispatchEvent(new CustomEvent('serene_activity_updated'));
      window.dispatchEvent(new CustomEvent('serene_photo_reveal_updated', { detail: { ownerId, viewerId, isRevealed } }));
      window.dispatchEvent(new CustomEvent('serene_reveal_updated', {
        detail: { conversationId: convId, targetUserId: viewerId, hasRevealedToPartner: isRevealed, isRevealed }
      }));
    } catch {}

    // 2. Persist to Cloudflare D1 backend
    try {
      const targetId = convId || `conv_${[ownerId, viewerId].sort().join('_')}`;
      const endpoints = [
        `${API_BASE}/conversations/${targetId}/photo-reveal`,
        `/api/conversations/${targetId}/photo-reveal`
      ];

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ownerId, viewerId, isRevealed })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              return Boolean(data.isRevealed);
            }
          }
        } catch {}
      }
    } catch (e) {
      console.warn('togglePhotoRevealLive notice:', e);
    }

    return isRevealed;
  }

  // Live Cloudflare R2 + D1 Voice Greeting upload
  async uploadVoiceGreeting(userId: string, audioBase64: string, duration: number): Promise<{ success: boolean; voiceUrl?: string }> {
    try {
      const user = this.getCurrentUser();
      user.voiceGreetingUrl = audioBase64;
      user.voiceGreetingDuration = duration;
      this.setCurrentUser(user);

      // Call live Cloudflare Worker API
      const res = await fetch(`${API_BASE}/photos/upload-voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          audioBase64,
          duration
        })
      });
      const data = await res.json();
      if (data.success && data.voiceUrl) {
        user.voiceGreetingUrl = data.voiceUrl;
        this.setCurrentUser(user);
        window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user } }));
        return { success: true, voiceUrl: data.voiceUrl };
      }
      window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user } }));
      return { success: true, voiceUrl: audioBase64 };
    } catch (err) {
      console.warn('Voice upload offline fallback:', err);
      window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: this.getCurrentUser() } }));
      return { success: true, voiceUrl: audioBase64 };
    }
  }

  deleteVoiceGreeting(_userId?: string): void {
    const user = this.getCurrentUser();
    delete user.voiceGreetingUrl;
    delete user.voiceGreetingDuration;
    this.setCurrentUser(user);
    window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user } }));
  }




  getDiscoverFeed(filters?: FilterState, profilesList?: UserProfile[]): UserProfile[] {
    const user = this.getCurrentUser();
    const targetGender = user.gender === 'female' ? 'male' : (user.gender === 'male' ? 'female' : undefined);

    // Exclude current user, already liked, already passed, already blocked, already matched candidates
    const likedIds = this.getUserLikesSent(user.id).map((i: any) => i.id);
    const passedIds = this.getUserPassed(user.id).map((i: any) => i.id);
    const blockedIds = this.getUserBlocked(user.id).map((i: any) => i.id);
    const matchedIds = this.getConversations().map(c => c.otherUser?.id).filter(Boolean);

    const excludedIds = new Set<string>([
      user.id,
      ...likedIds,
      ...passedIds,
      ...blockedIds,
      ...matchedIds
    ]);

    const seen = new Set<string>();
    const source = (profilesList && profilesList.length > 0) 
      ? profilesList 
      : this.getAllProfiles();

    const all = source.filter(p => {
      if (!p.id || excludedIds.has(p.id) || seen.has(p.id)) return false;
      if (p.accountStatus === 'deactivated' || p.profileVisibility === 'hidden') return false;
      if (targetGender && p.gender && p.gender.toLowerCase() !== targetGender) return false;
      seen.add(p.id);
      return true;
    });

    // Prioritize candidates with active spotlight and recorded voice greetings
    all.sort((a, b) => {
      if (b.isSpotlightActive !== a.isSpotlightActive) return (b.isSpotlightActive ? 1 : 0) - (a.isSpotlightActive ? 1 : 0);
      const aVoice = Boolean(a.voiceGreetingUrl && a.voiceGreetingUrl.length > 0);
      const bVoice = Boolean(b.voiceGreetingUrl && b.voiceGreetingUrl.length > 0);
      if (aVoice !== bVoice) return (bVoice ? 1 : 0) - (aVoice ? 1 : 0);
      if (b.isVip !== a.isVip) return (b.isVip ? 1 : 0) - (a.isVip ? 1 : 0);
      return 0;
    });

    if (!filters) return all;

    return all.filter(p => {
      if (p.age && (p.age < filters.minAge || p.age > filters.maxAge)) return false;
      // Only filter by maxDistance if explicitly set > 0
      if (filters.maxDistance && filters.maxDistance > 0 && typeof p.distanceKm === 'number' && p.distanceKm > filters.maxDistance) return false;
      if (filters.sects && filters.sects.length > 0 && p.religiousProfile?.sect && !filters.sects.includes(p.religiousProfile.sect)) return false;
      if (filters.practiceLevels && filters.practiceLevels.length > 0 && p.religiousProfile?.practiceLevel && !filters.practiceLevels.includes(p.religiousProfile.practiceLevel)) return false;
      if (filters.marriageTimelines && filters.marriageTimelines.length > 0 && p.marriageTimeline && !filters.marriageTimelines.includes(p.marriageTimeline)) return false;
      return true;
    });
  }

  resetPassedProfiles(userId: string): void {
    try {
      localStorage.removeItem(`serene_passed_${userId}`);
      window.dispatchEvent(new CustomEvent('serene_activity_updated'));
      fetch(`${API_BASE}/matches/reset-passed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      }).catch(() => {});
    } catch {}
  }


  requestPhotoReveal(targetUserId: string): boolean {
    const profiles = this.getAllProfiles();
    const target = profiles.find(p => p.id === targetUserId);
    if (target) {
      target.photoRevealRequested = true;
      target.photoRevealApproved = true; // Instant reveal
      localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
      return true;
    }
    return false;
  }

  approvePhotoReveal(targetUserId: string): boolean {
    const profiles = this.getAllProfiles();
    const target = profiles.find(p => p.id === targetUserId);
    if (target) {
      target.photoRevealApproved = true;
      localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
      return true;
    }
    return false;
  }

  getConversations(): Conversation[] {
    const user = this.getCurrentUser();
    if (!user?.id || user.id === 'usr_guest') return [];

    const data = localStorage.getItem(this.conversationsKey) || localStorage.getItem('serene_real_conversations_v3');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          // Filter out any legacy dummy seed conversation AND only return conversations belonging to this user
          const realOnly = (parsed as Conversation[]).filter((c: Conversation) => {
            if (c.messages?.some((m: ChatMessage) => m.id === 'msg_seed_1')) return false;
            return c.participantOne === user.id || c.participantTwo === user.id;
          });
          return realOnly;
        }
      } catch {}
    }
    return [];
  }

  async sendLiveMessage(conversationId: string, text: string): Promise<ChatMessage> {
    const user = this.getCurrentUser();
    const msg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: user.id,
      senderName: user.fullName || 'Member',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      waliNotified: true
    };

    const conversations = this.getConversations();
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.messages.push(msg);
      conv.lastMessageText = text;
      conv.lastMessageSenderId = user.id;
      conv.lastMessageTime = msg.timestamp;
      conv.lastMessageTimestamp = Date.now();
      localStorage.setItem(this.conversationsKey, JSON.stringify(conversations));
      window.dispatchEvent(new CustomEvent('serene_conversations_updated'));
    }

    try {
      await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: msg.id,
          senderId: user.id,
          senderName: user.fullName,
          text,
          receiverId: conv?.otherUser?.id
        })
      });
    } catch {}

    return msg;
  }

  markConversationAsRead(conversationId: string): void {
    const conversations = this.getConversations();
    const conv = conversations.find(c => c.id === conversationId || (c.otherUser && conversationId.includes(c.otherUser.id)));
    if (conv && conv.unreadCount && conv.unreadCount > 0) {
      conv.unreadCount = 0;
      localStorage.setItem(this.conversationsKey, JSON.stringify(conversations));
      window.dispatchEvent(new CustomEvent('serene_conversations_updated'));
    }
  }

  sendMessage(conversationId: string, text: string): ChatMessage {
    this.sendLiveMessage(conversationId, text);
    const conversations = this.getConversations();
    const conv = conversations.find(c => c.id === conversationId);
    return conv ? conv.messages[conv.messages.length - 1] : {
      id: 'msg_' + Date.now(),
      senderId: this.currentUserId,
      senderName: 'Member',
      text,
      timestamp: 'Just now',
      isRead: true,
      waliNotified: true
    };
  }

  addWali(waliData: { name: string; phone: string; relationship: string }): void {
    const user = this.getCurrentUser();
    user.wali = {
      ...waliData,
      isVerified: true
    };
    this.setCurrentUser(user);

    fetch(`${API_BASE}/wali/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        waliName: waliData.name,
        waliPhone: waliData.phone,
        waliRelationship: waliData.relationship
      })
    }).catch(() => {});
  }

  updatePrivacy(blurPhotos: boolean, visibility: string): void {
    const user = this.getCurrentUser();
    user.blurPhotosByDefault = blurPhotos;
    user.profileVisibility = visibility;
    this.setCurrentUser(user);

    fetch(`${API_BASE}/users/privacy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        blurPhotosByDefault: blurPhotos,
        profileVisibility: visibility
      })
    }).catch(() => {});
  }

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
    const updated: UserProfile = {
      ...current,
      accountStatus: 'deactivated',
      profileVisibility: 'hidden'
    };
    this.setCurrentUser(updated);
    this.memoryProfiles = this.memoryProfiles.filter(p => p.id !== userId);
    try {
      const savedProfiles = JSON.parse(localStorage.getItem(this.profilesKey) || '[]');
      const filtered = savedProfiles.filter((p: any) => p.id !== userId);
      localStorage.setItem(this.profilesKey, JSON.stringify(filtered));
    } catch {}
    window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: updated } }));
    window.dispatchEvent(new CustomEvent('serene_activity_updated'));
    return true;
  }

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
    const updated: UserProfile = {
      ...current,
      accountStatus: 'active',
      profileVisibility: 'all_users'
    };
    this.setCurrentUser(updated);
    window.dispatchEvent(new CustomEvent('serene_user_profile_updated', { detail: { user: updated } }));
    window.dispatchEvent(new CustomEvent('serene_activity_updated'));
    return true;
  }

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
      'serene_current_user_v1',
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
      'serene_real_profiles_v3'
    ];
    keysToPurge.forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });

    this.currentUserId = '';
    this.memoryProfiles = [];
    window.dispatchEvent(new CustomEvent('serene_account_deleted'));
    return true;
  }

  async sendMatchAction(
    targetUserId: string, 
    action: 'liked' | 'passed' | 'direct_salam', 
    messageText?: string,
    targetProfile?: Partial<UserProfile>,
    isMutualMatch?: boolean
  ): Promise<{ isMutual: boolean; conversationId?: string; message?: string }> {
    const user = this.getCurrentUser();
    const allProf = this.getAllProfiles();
    const cachedProf = allProf.find(p => p.id === targetUserId);
    const prof = targetProfile || cachedProf;

    // Sanitize heavy base64 photos to prevent QuotaExceededError in Android WebView localStorage
    const safePhotos = (prof?.photos || cachedProf?.photos || []).map(p => {
      if (typeof p === 'string' && p.startsWith('data:') && p.length > 50000) return '';
      return p;
    }).filter(Boolean);

    const actionItem = {
      id: targetUserId,
      fullName: prof?.fullName || cachedProf?.fullName || 'Candidate',
      age: prof?.age || cachedProf?.age || 26,
      gender: prof?.gender || cachedProf?.gender || (user.gender === 'male' ? 'female' : 'male'),
      location: prof?.location || cachedProf?.location || 'Global',
      profession: prof?.profession || cachedProf?.profession || 'Professional',
      marriageTimeline: prof?.marriageTimeline || cachedProf?.marriageTimeline || 'within_1_year',
      bio: prof?.bio || cachedProf?.bio || 'Seeking a pious spouse for marriage.',
      photos: safePhotos,
      action: isMutualMatch ? 'mutual_match' : action,
      actionTime: new Date().toISOString()
    };

    if (action === 'liked' || action === 'direct_salam') {
      const likesKey = `serene_likes_sent_${user.id}`;
      const localLikes = this.getUserLikesSent(user.id).filter(l => l.id !== targetUserId);
      localLikes.unshift(actionItem);
      try { localStorage.setItem(likesKey, JSON.stringify(localLikes)); } catch {}

      const passedKey = `serene_passed_${user.id}`;
      const localPassed = this.getUserPassed(user.id).filter(p => p.id !== targetUserId);
      try { localStorage.setItem(passedKey, JSON.stringify(localPassed)); } catch {}

      if (isMutualMatch) {
        const mutualKey = `serene_mutual_matches_${user.id}`;
        try {
          const savedMutual = JSON.parse(localStorage.getItem(mutualKey) || '[]');
          if (!savedMutual.some((m: any) => m.id === targetUserId)) {
            savedMutual.unshift(prof || actionItem);
            localStorage.setItem(mutualKey, JSON.stringify(savedMutual));
          }
        } catch {}
      }
    } else if (action === 'passed') {
      const passedKey = `serene_passed_${user.id}`;
      const localPassed = this.getUserPassed(user.id).filter(p => p.id !== targetUserId);
      localPassed.unshift(actionItem);
      try { localStorage.setItem(passedKey, JSON.stringify(localPassed)); } catch {}

      const likesKey = `serene_likes_sent_${user.id}`;
      const localLikes = this.getUserLikesSent(user.id).filter(l => l.id !== targetUserId);
      try { localStorage.setItem(likesKey, JSON.stringify(localLikes)); } catch {}
    }

    // Immediately dispatch real-time sync event
    window.dispatchEvent(new CustomEvent('serene_activity_updated'));

    try {
      const res = await fetch(`${API_BASE}/matches/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: targetUserId,
          action,
          messageText,
          isMutualMatch
        })
      });
      const data = await res.json();
      return {
        isMutual: Boolean(data.isMutual || isMutualMatch),
        conversationId: data.conversationId,
        message: data.message
      };
    } catch {
      return { isMutual: Boolean(isMutualMatch) };
    }
  }

  // Alias for backward and forward compatibility
  async recordMatchAction(
    targetUserId: string, 
    action: 'liked' | 'passed' | 'direct_salam', 
    messageText?: string,
    targetProfile?: Partial<UserProfile>,
    isMutualMatch?: boolean
  ): Promise<{ isMutual: boolean; conversationId?: string; message?: string }> {
    return this.sendMatchAction(targetUserId, action, messageText, targetProfile, isMutualMatch);
  }

  async fetchLikedYouCandidates(): Promise<UserProfile[]> {
    const user = this.getCurrentUser();
    const localKey = `serene_liked_you_${user.id}`;

    // 1. Try remote API first (Single Source of Truth)
    try {
      const res = await fetch(`${API_BASE}/matches/received?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.candidates)) {
        try {
          const lightweight = data.candidates.map((c: any) => ({
            ...c,
            photos: (c.photos || []).map((p: string) => (typeof p === 'string' && p.startsWith('data:') && p.length > 50000 ? '' : p)).filter(Boolean)
          }));
          localStorage.setItem(localKey, JSON.stringify(lightweight));
        } catch (storageErr) {
          console.warn('Storage quota limit reached for liked you cache:', storageErr);
        }
        return data.candidates;
      }
    } catch (err) {
      console.warn('Remote liked-you fetch notice, attempting cache fallback:', err);
    }

    // 2. Check local-storage incoming interest cache if network failed
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }

    // 3. Genuine zero-state: Return empty array if no real incoming likes
    return [];
  }

  async fetchMutualMatches(): Promise<UserProfile[]> {
    const user = this.getCurrentUser();
    const localKey = `serene_mutual_matches_${user.id}`;
    try {
      const res = await fetch(`${API_BASE}/matches/mutual?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.matches)) {
        try {
          const lightweight = data.matches.map((m: any) => ({
            ...m,
            photos: (m.photos || []).map((p: string) => (typeof p === 'string' && p.startsWith('data:') && p.length > 50000 ? '' : p)).filter(Boolean)
          }));
          localStorage.setItem(localKey, JSON.stringify(lightweight));
        } catch (storageErr) {
          console.warn('Storage quota limit reached for mutual matches cache:', storageErr);
        }
        return data.matches;
      }
    } catch (err) {
      console.warn('Remote mutual-matches fetch notice, attempting cache fallback:', err);
    }

    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  }

  async detectLocationByIP(): Promise<{
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  } | null> {
    try {
      const res = await fetch(`${API_BASE}/users/detect-location`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          return {
            city: data.city || 'Current Location',
            country: data.country || 'GB',
            latitude: data.latitude,
            longitude: data.longitude
          };
        }
      }
    } catch {}

    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          return {
            city: data.city || 'Current Location',
            country: data.country_code || 'GB',
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude)
          };
        }
      }
    } catch {}

    return null;
  }

  async fetchActivityHub(): Promise<{
    sentLikes: any[];
    passed: any[];
    blocked: any[];
  }> {
    const user = this.getCurrentUser();
    const localLikes = this.getUserLikesSent(user.id);
    const localPassed = this.getUserPassed(user.id);
    const localBlocked = this.getUserBlocked(user.id);

    try {
      const res = await fetch(`${API_BASE}/matches/activity?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        const mergeMap = (localList: any[], remoteList: any[]) => {
          const map = new Map();
          localList.forEach(item => {
            if (item && item.id) map.set(item.id, { ...item });
          });
          remoteList.forEach(item => {
            if (item && item.id) {
              const existing = map.get(item.id);
              const safePhotos = (item.photos || existing?.photos || []).map((p: any) => {
                if (typeof p === 'string' && p.startsWith('data:') && p.length > 50000) return '';
                return p;
              }).filter(Boolean);

              map.set(item.id, {
                ...existing,
                ...item,
                fullName: (item.fullName && item.fullName !== 'Candidate') ? item.fullName : (existing?.fullName || item.fullName || 'Candidate'),
                profession: (item.profession && item.profession !== 'Professional') ? item.profession : (existing?.profession || item.profession || 'Professional'),
                location: (item.location && item.location !== 'Global') ? item.location : (existing?.location || item.location || 'Global'),
                photos: safePhotos
              });
            }
          });
          return Array.from(map.values());
        };

        const mergedLikes = mergeMap(localLikes, data.sentLikes || []);
        const mergedPassed = mergeMap(localPassed, data.passed || []);
        const mergedBlocked = mergeMap(localBlocked, data.blocked || []);

        try { localStorage.setItem(`serene_likes_sent_${user.id}`, JSON.stringify(mergedLikes)); } catch {}
        try { localStorage.setItem(`serene_passed_${user.id}`, JSON.stringify(mergedPassed)); } catch {}
        try { localStorage.setItem(`serene_blocked_${user.id}`, JSON.stringify(mergedBlocked)); } catch {}

        return {
          sentLikes: mergedLikes,
          passed: mergedPassed,
          blocked: mergedBlocked
        };
      }
    } catch {}

    return { sentLikes: localLikes, passed: localPassed, blocked: localBlocked };
  }

  async undoPass(targetId: string): Promise<boolean> {
    const user = this.getCurrentUser();
    const passedKey = `serene_passed_${user.id}`;
    const localPassed = this.getUserPassed(user.id).filter(p => p.id !== targetId);
    localStorage.setItem(passedKey, JSON.stringify(localPassed));

    // Notify all screens to refresh
    window.dispatchEvent(new CustomEvent('serene_activity_updated'));

    try {
      const res = await fetch(`${API_BASE}/matches/undo-pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, targetId })
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return true;
    }
  }


  async blockProfile(targetId: string, reason?: string): Promise<boolean> {
    const user = this.getCurrentUser();
    const localKey = `serene_blocked_${user.id}`;
    let localBlocked: any[] = [];
    try {
      localBlocked = JSON.parse(localStorage.getItem(localKey) || '[]');
    } catch {}

    const profiles = this.getAllProfiles();
    const targetProf = profiles.find(p => p.id === targetId);

    const newBlockedItem = {
      id: targetId,
      fullName: targetProf?.fullName || 'Candidate',
      location: targetProf?.location || 'Global',
      reason: reason || 'User requested block',
      actionTime: new Date().toISOString()
    };

    if (!localBlocked.some(b => b.id === targetId)) {
      localBlocked.unshift(newBlockedItem);
      try {
        localStorage.setItem(localKey, JSON.stringify(localBlocked));
      } catch (storageErr) {
        console.warn('Storage quota warning when updating blocked list:', storageErr);
      }
    }

    // 1. Remove from active conversations
    try {
      const convs = this.getConversations().filter(c => c.otherUser?.id !== targetId && c.participantOne !== targetId && c.participantTwo !== targetId);
      localStorage.setItem(this.conversationsKey, JSON.stringify(convs));
    } catch (storageErr) {
      console.warn('Storage quota warning when updating conversations on block:', storageErr);
    }

    // 2. Remove from Liked You candidates cache
    const likedYouKey = `serene_liked_you_${user.id}`;
    try {
      const savedLiked = JSON.parse(localStorage.getItem(likedYouKey) || '[]');
      localStorage.setItem(likedYouKey, JSON.stringify(savedLiked.filter((p: any) => p.id !== targetId)));
    } catch {}

    // 3. Remove from Mutual Matches cache
    const mutualKey = `serene_mutual_matches_${user.id}`;
    try {
      const savedMutual = JSON.parse(localStorage.getItem(mutualKey) || '[]');
      localStorage.setItem(mutualKey, JSON.stringify(savedMutual.filter((p: any) => p.id !== targetId)));
    } catch {}

    // 4. Remove from Sent Likes cache
    const likesKey = `serene_likes_sent_${user.id}`;
    try {
      const savedLikes = JSON.parse(localStorage.getItem(likesKey) || '[]');
      localStorage.setItem(likesKey, JSON.stringify(savedLikes.filter((p: any) => p.id !== targetId)));
    } catch {}

    // Dispatch global events so UI immediately updates
    window.dispatchEvent(new CustomEvent('serene_conversations_updated'));
    window.dispatchEvent(new CustomEvent('serene_matches_updated'));
    window.dispatchEvent(new CustomEvent('serene_activity_updated'));
    window.dispatchEvent(new CustomEvent('serene_block_updated', { detail: { targetId } }));

    try {
      const res = await fetch(`${API_BASE}/matches/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, targetId, reason })
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return true;
    }
  }

  async unblockProfile(targetId: string): Promise<boolean> {
    const user = this.getCurrentUser();

    // 1. Remove from local blocked list
    const localBlockedKey = `serene_blocked_${user.id}`;
    try {
      const localBlocked = JSON.parse(localStorage.getItem(localBlockedKey) || '[]');
      const updated = localBlocked.filter((b: any) => b.id !== targetId);
      localStorage.setItem(localBlockedKey, JSON.stringify(updated));
    } catch {}

    // 2. Wipe from sent likes history so Discover treats them as fresh candidate
    const likesKey = `serene_likes_sent_${user.id}`;
    try {
      const localLikes = JSON.parse(localStorage.getItem(likesKey) || '[]');
      const updatedLikes = localLikes.filter((l: any) => l.id !== targetId);
      localStorage.setItem(likesKey, JSON.stringify(updatedLikes));
    } catch {}

    // 3. Wipe from passed history
    const passedKey = `serene_passed_${user.id}`;
    try {
      const localPassed = JSON.parse(localStorage.getItem(passedKey) || '[]');
      const updatedPassed = localPassed.filter((p: any) => p.id !== targetId);
      localStorage.setItem(passedKey, JSON.stringify(updatedPassed));
    } catch {}

    // 4. Wipe from received likes cache
    const receivedKey = `serene_liked_you_${user.id}`;
    try {
      const localReceived = JSON.parse(localStorage.getItem(receivedKey) || '[]');
      const updatedReceived = localReceived.filter((p: any) => p.id !== targetId);
      localStorage.setItem(receivedKey, JSON.stringify(updatedReceived));
    } catch {}

    // 5. Clean any residual conversation from active conversations list
    try {
      const convs = this.getConversations().filter(c => c.otherUser?.id !== targetId);
      localStorage.setItem(this.conversationsKey, JSON.stringify(convs));
    } catch {}

    // 6. Notify Discover feed and Activity hub immediately
    window.dispatchEvent(new CustomEvent('serene_activity_updated'));
    window.dispatchEvent(new CustomEvent('serene_block_updated', { detail: { targetId, unblocked: true } }));
    window.dispatchEvent(new CustomEvent('serene_conversations_updated'));

    // 7. Sync with Cloudflare D1 Backend
    try {
      const res = await fetch(`${API_BASE}/matches/unblock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, targetId })
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return true;
    }
  }


  async fetchLiveConversations(): Promise<Conversation[]> {
    try {
      const user = this.getCurrentUser();
      if (!user?.id || user.id === 'usr_guest') return [];
      const blockedIds = new Set(this.getUserBlocked(user.id).map((b: any) => b.id));

      const res = await fetch(`${API_BASE}/conversations?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.conversations)) {
        const localConvs = this.getConversations();
        const convMap = new Map<string, Conversation>();

        // Preload local conversations so messages and local drafts are preserved, excluding blocked users
        localConvs.forEach(c => {
          if (c && c.id) {
            const partner = c.otherUser?.id || (c.participantOne === user.id ? c.participantTwo : c.participantOne);
            if (!blockedIds.has(partner)) {
              convMap.set(c.id, c);
            }
          }
        });

        data.conversations
          .filter((rc: any) => {
            const isParticipant = rc.participantOne === user.id || rc.participantTwo === user.id;
            const otherId = rc.participantOne === user.id ? rc.participantTwo : rc.participantOne;
            return isParticipant && !blockedIds.has(otherId) && !blockedIds.has(rc.otherUser?.id);
          })
          .forEach((rc: any) => {
            const existing = convMap.get(rc.id);
            const isPhotoRevealed = typeof rc.isPhotoRevealed === 'boolean' 
              ? rc.isPhotoRevealed 
              : (existing?.isPhotoRevealed ?? false);
            const hasRevealedToPartner = typeof rc.hasRevealedToPartner === 'boolean'
              ? rc.hasRevealedToPartner
              : (existing?.hasRevealedToPartner ?? false);

            const rawPhotos = rc.otherUser?.photos || existing?.otherUser?.photos || [];
            const sanitizedPhotos = Array.isArray(rawPhotos) 
              ? rawPhotos.filter((p: string) => typeof p === 'string' && !p.includes('photo-1534528741775-53994a69daeb'))
              : [];

            const otherUserMerged = {
              ...(rc.otherUser || existing?.otherUser),
              photos: sanitizedPhotos,
              isPhotoRevealed,
              hasRevealedToPartner
            };

            const lastTimestamp = rc.lastMessageTime 
              ? new Date(rc.lastMessageTime).getTime() 
              : (existing?.lastMessageTimestamp || Date.now());

            convMap.set(rc.id, {
              id: rc.id,
              participantOne: rc.participantOne,
              participantTwo: rc.participantTwo,
              otherUser: otherUserMerged,
              lastMessageText: rc.lastMessageText || existing?.lastMessageText || 'You matched! Start with Bismillah.',
              lastMessageSenderId: rc.lastMessageSenderId || existing?.lastMessageSenderId || 'system',
              lastMessageTime: rc.lastMessageTime || existing?.lastMessageTime || 'Just now',
              lastMessageTimestamp: isNaN(lastTimestamp) ? Date.now() : lastTimestamp,
              unreadCount: typeof rc.unreadCount === 'number' ? rc.unreadCount : (existing?.unreadCount || 0),
              waliName: rc.waliName || existing?.waliName,
              status: rc.status || existing?.status || 'active',
              messages: existing?.messages && existing.messages.length > 0 ? existing.messages : (rc.messages || []),
              isPhotoRevealed,
              hasRevealedToPartner
            });
          });

        // Auto-seed confirmed mutual matches so they ALWAYS show in Chat screen immediately
        try {
          const mutualList = await this.fetchMutualMatches();
          if (Array.isArray(mutualList)) {
            mutualList.forEach(m => {
              if (!m || !m.id || blockedIds.has(m.id)) return;
              const convId = `conv_${[user.id, m.id].sort().join('_')}`;
              if (!convMap.has(convId)) {
                const rawPhotos = m.photos || [];
                const sanitizedPhotos = Array.isArray(rawPhotos)
                  ? rawPhotos.filter((p: string) => typeof p === 'string' && !p.includes('photo-1534528741775-53994a69daeb'))
                  : [];
                convMap.set(convId, {
                  id: convId,
                  participantOne: user.id,
                  participantTwo: m.id,
                  otherUser: { ...m, photos: sanitizedPhotos },
                  lastMessageText: 'You matched! Start with Bismillah.',
                  lastMessageSenderId: 'system',
                  lastMessageTime: 'Just now',
                  lastMessageTimestamp: Date.now(),
                  unreadCount: 0,
                  waliName: m.wali?.name,
                  status: 'active',
                  messages: [],
                  isPhotoRevealed: m.photoRevealApproved || false,
                  hasRevealedToPartner: false
                });
              }
            });
          }
        } catch {}

        const mergedList = Array.from(convMap.values()).filter(c => {
          const partner = c.otherUser?.id || (c.participantOne === user.id ? c.participantTwo : c.participantOne);
          return !blockedIds.has(partner);
        });
        const prevJson = localStorage.getItem(this.conversationsKey);
        const lightweightConvs = mergedList.map(c => ({
          ...c,
          otherUser: c.otherUser ? {
            ...c.otherUser,
            photos: (c.otherUser.photos || []).map(p => (typeof p === 'string' && p.startsWith('data:') && p.length > 50000 ? '' : p)).filter(Boolean)
          } : undefined
        }));
        const newJson = JSON.stringify(lightweightConvs);

        if (prevJson !== newJson) {
          try {
            localStorage.setItem(this.conversationsKey, newJson);
          } catch (storageErr) {
            console.warn('Storage quota limit reached for conversations cache:', storageErr);
          }
          try {
            window.dispatchEvent(new CustomEvent('serene_conversations_updated', { detail: { conversations: mergedList } }));
          } catch {}
        }
        return mergedList;
      }
    } catch {}
    return this.getConversations();
  }

  createMatchConversation(profile: UserProfile, openingMessage?: string): Conversation {
    const user = this.getCurrentUser();
    const convId = `conv_${[user.id, profile.id].sort().join('_')}`;

    const conversations = this.getConversations();
    const existing = conversations.find(c => c.id === convId || c.otherUser?.id === profile.id);
    const initialText = openingMessage || "You matched! Start with Bismillah.";

    if (existing) {
      if (openingMessage) {
        existing.lastMessageText = openingMessage;
        existing.lastMessageSenderId = user.id;
        existing.lastMessageTime = 'Just now';
        existing.lastMessageTimestamp = Date.now();
        if (!existing.messages) existing.messages = [];
        existing.messages.push({
          id: 'msg_' + Date.now(),
          senderId: user.id,
          senderName: user.fullName || 'Member',
          text: openingMessage,
          timestamp: 'Just now',
          isRead: true,
          waliNotified: true
        });
        localStorage.setItem(this.conversationsKey, JSON.stringify(conversations));
      }
      return existing;
    }

    const newConv: Conversation = {
      id: convId,
      participantOne: user.id,
      participantTwo: profile.id,
      otherUser: profile,
      lastMessageText: initialText,
      lastMessageSenderId: openingMessage ? user.id : 'system',
      lastMessageTime: 'Just now',
      lastMessageTimestamp: Date.now(),
      unreadCount: 0,
      status: 'active',
      messages: openingMessage ? [{
        id: 'msg_' + Date.now(),
        senderId: user.id,
        senderName: user.fullName || 'Member',
        text: openingMessage,
        timestamp: 'Just now',
        isRead: true,
        waliNotified: true
      }] : []
    };

    conversations.unshift(newConv);
    localStorage.setItem(this.conversationsKey, JSON.stringify(conversations));

    // Sync to Cloudflare D1 asynchronously
    fetch(`${API_BASE}/conversations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantOne: user.id,
        participantTwo: profile.id
      })
    }).catch(() => {});

    return newConv;
  }

  async fetchConversationMessages(conversationId: string, userId?: string): Promise<ChatMessage[]> {
    if (!conversationId) return [];
    try {
      const user = this.getCurrentUser();
      const uId = userId || user.id;
      const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages?userId=${encodeURIComponent(uId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        const conversations = this.getConversations();
        const conv = conversations.find(c => c.id === conversationId || (c.otherUser && conversationId.includes(c.otherUser.id)));
        const mappedMessages: ChatMessage[] = data.messages.map((m: any) => ({
          id: m.id || 'msg_' + Math.random().toString(36).substring(2, 7),
          senderId: m.senderId || m.sender_id,
          senderName: m.senderName || m.sender_name || 'Member',
          text: m.text || m.message_text || m.content || '',
          timestamp: m.timestamp && (m.timestamp.includes('T') || m.timestamp.includes('-') || m.timestamp.includes(':'))
            ? (isNaN(new Date(m.timestamp).getTime()) ? m.timestamp : new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            : (m.timestamp || 'Just now'),
          isRead: true,
          waliNotified: true,
          mediaUrl: m.mediaUrl || m.media_url,
          mediaType: m.mediaType || m.media_type,
          mediaDuration: m.mediaDuration || m.media_duration,
          fileName: m.fileName || m.file_name,
          fileSize: m.fileSize || m.file_size,
          isViewOnce: Boolean(m.isViewOnce ?? m.is_view_once),
          isOpened: Boolean(m.isOpened ?? m.is_opened),
          openedAt: m.openedAt || m.opened_at
        }));

        if (conv) {
          conv.messages = mappedMessages;
          let revealChanged = false;
          if (typeof data.isPhotoRevealed === 'boolean' && conv.isPhotoRevealed !== data.isPhotoRevealed) {
            conv.isPhotoRevealed = data.isPhotoRevealed;
            if (conv.otherUser) conv.otherUser.isPhotoRevealed = data.isPhotoRevealed;
            revealChanged = true;
          }
          if (typeof data.hasRevealedToPartner === 'boolean' && conv.hasRevealedToPartner !== data.hasRevealedToPartner) {
            conv.hasRevealedToPartner = data.hasRevealedToPartner;
            if (conv.otherUser) conv.otherUser.hasRevealedToPartner = data.hasRevealedToPartner;
            revealChanged = true;
          }
          if (mappedMessages.length > 0) {
            const last = mappedMessages[mappedMessages.length - 1];
            conv.lastMessageText = last.text;
            conv.lastMessageSenderId = last.senderId;
            conv.lastMessageTime = last.timestamp;
            conv.lastMessageTimestamp = Date.now();
          }
          localStorage.setItem(this.conversationsKey, JSON.stringify(conversations));
          if (revealChanged) {
            window.dispatchEvent(new CustomEvent('serene_reveal_updated', {
              detail: {
                conversationId,
                isPhotoRevealed: conv.isPhotoRevealed,
                hasRevealedToPartner: conv.hasRevealedToPartner
              }
            }));
          }
        }
        return mappedMessages;
      }
    } catch (err) {
      console.warn('Fetch messages notice:', err);
    }
    const localConv = this.getConversations().find(c => c.id === conversationId || (c.otherUser && conversationId.includes(c.otherUser.id)));
    return localConv?.messages || [];
  }

  async sendHeartbeat(userId?: string): Promise<boolean> {
    const targetId = userId || this.getCurrentUser().id;
    return profileService.sendHeartbeat(targetId);
  }
}

export const dbService = new DBService();
