import type { UserProfile, Conversation, ChatMessage, FilterState } from '../types';

export const API_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8787' : 'https://serene-union-api.brandracker.workers.dev')) + '/api';

class DBService {
  private profilesKey = 'serene_real_profiles_v3';
  private conversationsKey = 'serene_conversations_v1';
  private userKey = 'serene_current_user_v1';
  private currentUserId = '';

  constructor() {
    const saved = localStorage.getItem(this.userKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id) this.currentUserId = parsed.id;
      } catch {}
    }
  }

  async fetchLiveProfiles(): Promise<UserProfile[]> {
    try {
      const user = this.getCurrentUser();
      const res = await fetch(`${API_BASE}/profiles/discover?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.profiles)) {
        localStorage.setItem(this.profilesKey, JSON.stringify(data.profiles));
        return data.profiles;
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
      localStorage.removeItem(this.conversationsKey);
    }
    this.currentUserId = user.id;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getCurrentUser(): UserProfile {
    const saved = localStorage.getItem(this.userKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.fullName && (parsed.fullName.toLowerCase().includes('maryam') || parsed.fullName.toLowerCase().includes('sarah') || parsed.fullName.toLowerCase().includes('aisha')) && parsed.gender !== 'female') {
          parsed.gender = 'female';
          localStorage.setItem(this.userKey, JSON.stringify(parsed));
        }
        return parsed;
      } catch {}
    }

    return this.getGuestUser();
  }

  getAllProfiles(): UserProfile[] {
    const data = localStorage.getItem(this.profilesKey);
    return data ? JSON.parse(data) : [];
  }

  getDiscoverFeed(filters?: FilterState): UserProfile[] {
    const user = this.getCurrentUser();
    const targetGender = user.gender === 'female' ? 'male' : (user.gender === 'male' ? 'female' : undefined);

    // Exclude current user, same gender (Islamic matrimony rule), and duplicates
    const seen = new Set<string>();
    const all = this.getAllProfiles().filter(p => {
      if (!p.id || p.id === user.id || seen.has(p.id)) return false;
      if (targetGender && p.gender && p.gender.toLowerCase() !== targetGender) return false;
      seen.add(p.id);
      return true;
    });

    if (!filters) return all;

    return all.filter(p => {
      if (p.age && (p.age < filters.minAge || p.age > filters.maxAge)) return false;
      if (filters.sects.length > 0 && p.religiousProfile?.sect && !filters.sects.includes(p.religiousProfile.sect)) return false;
      if (filters.practiceLevels.length > 0 && p.religiousProfile?.practiceLevel && !filters.practiceLevels.includes(p.religiousProfile.practiceLevel)) return false;
      if (filters.marriageTimelines.length > 0 && p.marriageTimeline && !filters.marriageTimelines.includes(p.marriageTimeline)) return false;
      return true;
    });
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
          senderId: user.id,
          senderName: user.fullName,
          text
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
  }

  async sendMatchAction(targetUserId: string, action: 'liked' | 'passed'): Promise<{ isMutual: boolean; conversationId?: string; message?: string }> {
    const user = this.getCurrentUser();
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
    try {
      const res = await fetch(`${API_BASE}/matches/received?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.candidates)) {
        return data.candidates;
      }
    } catch {}
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

  async fetchLiveConversations(): Promise<Conversation[]> {
    try {
      const user = this.getCurrentUser();
      if (!user?.id || user.id === 'usr_guest') return [];
      const res = await fetch(`${API_BASE}/conversations?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.conversations)) {
        const userConversations: Conversation[] = data.conversations
          .filter((rc: any) => rc.participantOne === user.id || rc.participantTwo === user.id)
          .map((rc: any) => ({
            id: rc.id,
            participantOne: rc.participantOne,
            participantTwo: rc.participantTwo,
            otherUser: rc.otherUser,
            lastMessageText: rc.lastMessageText || 'You matched! Start with Bismillah.',
            lastMessageSenderId: rc.lastMessageSenderId || 'system',
            lastMessageTime: rc.lastMessageTime || 'Just now',
            unreadCount: 0,
            waliName: rc.waliName,
            status: rc.status || 'active',
            messages: []
          }));

        localStorage.setItem(this.conversationsKey, JSON.stringify(userConversations));
        return userConversations;
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
      waliObserverId: profile.wali ? 'wali_' + profile.id : undefined,
      waliName: profile.wali ? `${profile.wali.name} (${profile.wali.relationship})` : undefined,
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
}

export const dbService = new DBService();
