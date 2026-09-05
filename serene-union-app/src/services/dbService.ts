import type { UserProfile, Conversation, ChatMessage, FilterState } from '../types';

export const WORKER_API_BASE = 'https://serene-union-api.brandracker.workers.dev/api';
export const API_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8787/api' : WORKER_API_BASE));

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
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80'],
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
  private conversationsKey = 'serene_conversations_v1';
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

  async fetchLiveProfiles(filters?: FilterState): Promise<UserProfile[]> {
    try {
      const user = this.getCurrentUser();
      const targetGender = user.gender === 'female' ? 'male' : (user.gender === 'male' ? 'female' : '');
      let queryParams = `userId=${encodeURIComponent(user.id || '')}&gender=${encodeURIComponent(user.gender || '')}&targetGender=${encodeURIComponent(targetGender)}`;
      if (typeof user.latitude === 'number' && typeof user.longitude === 'number') {
        queryParams += `&lat=${user.latitude}&lon=${user.longitude}`;
      }
      // Only filter by distance if maxDistance is explicitly set > 0
      if (filters?.maxDistance && filters.maxDistance > 0 && filters.maxDistance < 5000) {
        queryParams += `&maxDistance=${filters.maxDistance}`;
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
            this.memoryProfiles = data.profiles;
            try {
              localStorage.setItem(this.profilesKey, JSON.stringify(data.profiles));
            } catch (storageErr) {
              console.warn('Storage quota limit reached on mobile, keeping profiles in memory:', storageErr);
            }
            return data.profiles;
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
  }

  setCurrentUser(user: UserProfile): void {
    if (this.currentUserId && this.currentUserId !== user.id) {
      try {
        localStorage.removeItem(this.conversationsKey);
      } catch {}
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
        if (parsed?.fullName && (parsed.fullName.toLowerCase().includes('maryam') || parsed.fullName.toLowerCase().includes('sarah') || parsed.fullName.toLowerCase().includes('aisha')) && parsed.gender !== 'female') {
          parsed.gender = 'female';
        }
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

  async fetchLikesRemaining(userId: string): Promise<{ likesRemaining: number; isVip: boolean }> {
    const today = new Date().toISOString().slice(0, 10);
    const localKey = `serene_likes_left_${userId}_${today}`;
    const fallbackCount = parseInt(localStorage.getItem(localKey) || '50', 10);
    const fallbackVip = Boolean(localStorage.getItem(`serene_vip_${userId}`) === 'true');

    if (!userId || userId === 'usr_guest') {
      return { likesRemaining: fallbackCount, isVip: fallbackVip };
    }

    try {
      const res = await fetch(`${API_BASE}/wallet/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.wallet) {
          const liveRemaining = data.wallet.likesRemaining ?? fallbackCount;
          const liveVip = Boolean(data.wallet.isVip);
          
          try {
            localStorage.setItem(localKey, liveRemaining.toString());
            localStorage.setItem(`serene_vip_${userId}`, liveVip ? 'true' : 'false');
          } catch {}

          const cur = this.getCurrentUser();
          if (cur.id === userId && cur.isVip !== liveVip) {
            this.setCurrentUser({ ...cur, isVip: liveVip });
            window.dispatchEvent(new CustomEvent('serene_vip_updated', { detail: { userId, isVip: liveVip } }));
          }

          return { likesRemaining: liveRemaining, isVip: liveVip };
        }
      }
    } catch (e) {
      console.warn('Live wallet sync notice:', e);
    }
    return { likesRemaining: fallbackCount, isVip: fallbackVip };
  }

  async consumeDailyLike(userId: string): Promise<{ success: boolean; likesRemaining: number }> {
    const today = new Date().toISOString().slice(0, 10);
    const localKey = `serene_likes_left_${userId}_${today}`;
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
      if (targetGender && p.gender && p.gender.toLowerCase() !== targetGender) return false;
      seen.add(p.id);
      return true;
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

    const data = localStorage.getItem(this.conversationsKey);
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
      localStorage.setItem(this.conversationsKey, JSON.stringify(conversations));
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

  async sendMatchAction(targetUserId: string, action: 'liked' | 'passed'): Promise<{ isMutual: boolean; conversationId?: string; message?: string }> {
    const user = this.getCurrentUser();
    const allProf = this.getAllProfiles();
    const targetProf = allProf.find(p => p.id === targetUserId);

    const actionItem = {
      id: targetUserId,
      fullName: targetProf?.fullName || 'Candidate',
      age: targetProf?.age || 26,
      gender: targetProf?.gender || (user.gender === 'male' ? 'female' : 'male'),
      location: targetProf?.location || 'Global',
      profession: targetProf?.profession || 'Professional',
      marriageTimeline: targetProf?.marriageTimeline || 'within_1_year',
      bio: targetProf?.bio || 'Seeking a pious spouse for marriage.',
      photos: targetProf?.photos || [],
      action: action,
      actionTime: new Date().toISOString()
    };

    if (action === 'liked') {
      const likesKey = `serene_likes_sent_${user.id}`;
      const localLikes = this.getUserLikesSent(user.id).filter(l => l.id !== targetUserId);
      localLikes.unshift(actionItem);
      localStorage.setItem(likesKey, JSON.stringify(localLikes));

      const passedKey = `serene_passed_${user.id}`;
      const localPassed = this.getUserPassed(user.id).filter(p => p.id !== targetUserId);
      localStorage.setItem(passedKey, JSON.stringify(localPassed));
    } else if (action === 'passed') {
      const passedKey = `serene_passed_${user.id}`;
      const localPassed = this.getUserPassed(user.id).filter(p => p.id !== targetUserId);
      localPassed.unshift(actionItem);
      localStorage.setItem(passedKey, JSON.stringify(localPassed));

      const likesKey = `serene_likes_sent_${user.id}`;
      const localLikes = this.getUserLikesSent(user.id).filter(l => l.id !== targetUserId);
      localStorage.setItem(likesKey, JSON.stringify(localLikes));
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
          action
        })
      });
      const data = await res.json();
      return {
        isMutual: Boolean(data.isMutual),
        conversationId: data.conversationId,
        message: data.message
      };
    } catch {
      return { isMutual: false };
    }
  }

  async fetchLikedYouCandidates(): Promise<UserProfile[]> {
    const user = this.getCurrentUser();

    // 1. Try remote API first

    try {
      const res = await fetch(`${API_BASE}/matches/received?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.candidates) && data.candidates.length > 0) {
        return data.candidates;
      }
    } catch {}

    // 2. Check local-storage incoming interest cache
    const localKey = `serene_liked_you_${user.id}`;
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }

    // 3. Genuine zero-state: Return empty array if no real incoming likes
    return [];
  }


  async fetchMutualMatches(): Promise<UserProfile[]> {
    const user = this.getCurrentUser();
    try {
      const res = await fetch(`${API_BASE}/matches/mutual?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.matches)) {
        return data.matches;
      }
    } catch {}
    return [];
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
          [...localList, ...remoteList].forEach(item => {
            if (item && item.id) map.set(item.id, { ...item });
          });
          return Array.from(map.values());
        };

        const mergedLikes = mergeMap(localLikes, data.sentLikes || []);
        const mergedPassed = mergeMap(localPassed, data.passed || []);
        const mergedBlocked = mergeMap(localBlocked, data.blocked || []);

        localStorage.setItem(`serene_likes_sent_${user.id}`, JSON.stringify(mergedLikes));
        localStorage.setItem(`serene_passed_${user.id}`, JSON.stringify(mergedPassed));
        localStorage.setItem(`serene_blocked_${user.id}`, JSON.stringify(mergedBlocked));

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
      localStorage.setItem(localKey, JSON.stringify(localBlocked));
    }

    // Remove from active conversations
    const convs = this.getConversations().filter(c => c.otherUser?.id !== targetId);
    localStorage.setItem(this.conversationsKey, JSON.stringify(convs));

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
    const localKey = `serene_blocked_${user.id}`;
    try {
      const localBlocked = JSON.parse(localStorage.getItem(localKey) || '[]');
      const updated = localBlocked.filter((b: any) => b.id !== targetId);
      localStorage.setItem(localKey, JSON.stringify(updated));
    } catch {}

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
      const res = await fetch(`${API_BASE}/conversations?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.conversations)) {
        const localConvs = this.getConversations();
        const convMap = new Map<string, Conversation>();

        // Preload local conversations so messages and local drafts are preserved
        localConvs.forEach(c => {
          if (c && c.id) convMap.set(c.id, c);
        });

        data.conversations
          .filter((rc: any) => rc.participantOne === user.id || rc.participantTwo === user.id)
          .forEach((rc: any) => {
            const existing = convMap.get(rc.id);
            convMap.set(rc.id, {
              id: rc.id,
              participantOne: rc.participantOne,
              participantTwo: rc.participantTwo,
              otherUser: rc.otherUser || existing?.otherUser,
              lastMessageText: rc.lastMessageText || existing?.lastMessageText || 'You matched! Start with Bismillah.',
              lastMessageSenderId: rc.lastMessageSenderId || existing?.lastMessageSenderId || 'system',
              lastMessageTime: rc.lastMessageTime || existing?.lastMessageTime || 'Just now',
              unreadCount: rc.unreadCount || 0,
              waliName: rc.waliName || existing?.waliName,
              status: rc.status || existing?.status || 'active',
              messages: existing?.messages && existing.messages.length > 0 ? existing.messages : (rc.messages || [])
            });
          });

        const mergedList = Array.from(convMap.values());
        localStorage.setItem(this.conversationsKey, JSON.stringify(mergedList));
        return mergedList;
      }
    } catch {}
    return this.getConversations();
  }

  createMatchConversation(profile: UserProfile): Conversation {
    const user = this.getCurrentUser();
    const convId = `conv_${[user.id, profile.id].sort().join('_')}`;

    const conversations = this.getConversations();
    const existing = conversations.find(c => c.id === convId || c.otherUser?.id === profile.id);
    if (existing) return existing;

    const newConv: Conversation = {
      id: convId,
      participantOne: user.id,
      participantTwo: profile.id,
      otherUser: profile,
      lastMessageText: "You matched! Start with Bismillah.",
      lastMessageSenderId: 'system',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      status: 'active',
      messages: []
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

  async fetchConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    if (!conversationId) return [];
    try {
      const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        const conversations = this.getConversations();
        const conv = conversations.find(c => c.id === conversationId);
        const mappedMessages: ChatMessage[] = data.messages.map((m: any) => ({
          id: m.id || 'msg_' + Math.random().toString(36).substring(2, 7),
          senderId: m.senderId || m.sender_id,
          senderName: m.senderName || m.sender_name || 'Member',
          text: m.text || m.message_text || m.content || '',
          timestamp: m.timestamp && (m.timestamp.includes('T') || m.timestamp.includes('-') || m.timestamp.includes(':'))
            ? (isNaN(new Date(m.timestamp).getTime()) ? m.timestamp : new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            : (m.timestamp || 'Just now'),
          isRead: true,
          waliNotified: true
        }));

        if (conv) {
          conv.messages = mappedMessages;
          if (mappedMessages.length > 0) {
            const last = mappedMessages[mappedMessages.length - 1];
            conv.lastMessageText = last.text;
            conv.lastMessageSenderId = last.senderId;
            conv.lastMessageTime = last.timestamp;
          }
          localStorage.setItem(this.conversationsKey, JSON.stringify(conversations));
        }
        return mappedMessages;
      }
    } catch (err) {
      console.warn('Fetch messages notice:', err);
    }
    const localConv = this.getConversations().find(c => c.id === conversationId);
    return localConv?.messages || [];
  }
}

export const dbService = new DBService();
