import type { UserProfile } from '../types';
import { API_BASE } from './apiConfig';
import { profileService, PROFILES_KEY } from './profileService';

export const matchService = {
  getUserLikesSent(userId: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(`serene_likes_sent_${userId}`) || '[]');
    } catch { return []; }
  },

  getUserPassed(userId: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(`serene_passed_${userId}`) || '[]');
    } catch { return []; }
  },

  getUserBlocked(userId: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(`serene_blocked_${userId}`) || '[]');
    } catch { return []; }
  },

  async fetchLikedYouCandidates(): Promise<UserProfile[]> {
    const user = profileService.getCurrentUser();
    try {
      const res = await fetch(`${API_BASE}/matches/received?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.candidates) && data.candidates.length > 0) {
        return data.candidates;
      }
    } catch {}

    const localKey = `serene_liked_you_${user.id}`;
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [];
  },

  async fetchMutualMatches(): Promise<UserProfile[]> {
    const user = profileService.getCurrentUser();
    try {
      const res = await fetch(`${API_BASE}/matches/mutual?userId=${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.matches)) {
        return data.matches;
      }
    } catch {}
    return [];
  },

  async fetchActivityHub(): Promise<{ sentLikes: any[]; passed: any[]; blocked: any[] }> {
    const user = profileService.getCurrentUser();
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
        return {
          sentLikes: mergeMap(localLikes, data.sentLikes || []),
          passed: mergeMap(localPassed, data.passed || []),
          blocked: mergeMap(localBlocked, data.blocked || [])
        };
      }
    } catch {}

    return { sentLikes: localLikes, passed: localPassed, blocked: localBlocked };
  },

  async sendMatchAction(
    targetUserId: string, 
    action: 'liked' | 'passed',
    targetProfile?: Partial<UserProfile>
  ): Promise<{ isMutual: boolean; conversationId?: string; message?: string }> {
    const user = profileService.getCurrentUser();
    
    let allProf: UserProfile[] = [];
    try {
      const stored = localStorage.getItem(PROFILES_KEY);
      if (stored) allProf = JSON.parse(stored);
    } catch {}
    const cachedProf = allProf.find(p => p.id === targetUserId);
    const prof = targetProfile || cachedProf;

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
      action,
      actionTime: new Date().toISOString()
    };

    if (action === 'liked') {
      const likesKey = `serene_likes_sent_${user.id}`;
      const localLikes = this.getUserLikesSent(user.id).filter(l => l.id !== targetUserId);
      localLikes.unshift(actionItem);
      try { localStorage.setItem(likesKey, JSON.stringify(localLikes)); } catch {}

      const passedKey = `serene_passed_${user.id}`;
      const localPassed = this.getUserPassed(user.id).filter(p => p.id !== targetUserId);
      try { localStorage.setItem(passedKey, JSON.stringify(localPassed)); } catch {}
    } else if (action === 'passed') {
      const passedKey = `serene_passed_${user.id}`;
      const localPassed = this.getUserPassed(user.id).filter(p => p.id !== targetUserId);
      localPassed.unshift(actionItem);
      try { localStorage.setItem(passedKey, JSON.stringify(localPassed)); } catch {}

      const likesKey = `serene_likes_sent_${user.id}`;
      const localLikes = this.getUserLikesSent(user.id).filter(l => l.id !== targetUserId);
      try { localStorage.setItem(likesKey, JSON.stringify(localLikes)); } catch {}
    }

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
  },

  resetPassedProfiles(userId: string): void {
    try {
      localStorage.removeItem(`serene_passed_${userId}`);
      window.dispatchEvent(new CustomEvent('serene_activity_updated'));
    } catch {}
  },

  async blockProfile(targetUserId: string, reason?: string): Promise<boolean> {
    const user = profileService.getCurrentUser();
    const blockListKey = `serene_blocked_${user.id}`;
    const localBlocked = this.getUserBlocked(user.id).filter(b => b.id !== targetUserId);
    localBlocked.unshift({ id: targetUserId, reason: reason || 'Incompatible match', blockedAt: new Date().toISOString() });
    localStorage.setItem(blockListKey, JSON.stringify(localBlocked));

    // Clean up local conversations
    try {
      const convs = JSON.parse(localStorage.getItem('serene_real_conversations_v3') || '[]');
      const filtered = convs.filter((c: any) => c.otherUser?.id !== targetUserId && c.participantOne !== targetUserId && c.participantTwo !== targetUserId);
      localStorage.setItem('serene_real_conversations_v3', JSON.stringify(filtered));
    } catch {}

    // Clean up local liked you
    try {
      const likedYou = JSON.parse(localStorage.getItem(`serene_liked_you_${user.id}`) || '[]');
      localStorage.setItem(`serene_liked_you_${user.id}`, JSON.stringify(likedYou.filter((p: any) => p.id !== targetUserId)));
    } catch {}

    // Clean up local mutual
    try {
      const mutual = JSON.parse(localStorage.getItem(`serene_mutual_matches_${user.id}`) || '[]');
      localStorage.setItem(`serene_mutual_matches_${user.id}`, JSON.stringify(mutual.filter((p: any) => p.id !== targetUserId)));
    } catch {}

    // Clean up local sent likes
    try {
      const sentLikes = JSON.parse(localStorage.getItem(`serene_likes_sent_${user.id}`) || '[]');
      localStorage.setItem(`serene_likes_sent_${user.id}`, JSON.stringify(sentLikes.filter((p: any) => p.id !== targetUserId)));
    } catch {}

    window.dispatchEvent(new CustomEvent('serene_block_updated', { detail: { targetId: targetUserId } }));
    window.dispatchEvent(new CustomEvent('serene_conversations_updated'));
    window.dispatchEvent(new CustomEvent('serene_matches_updated'));
    window.dispatchEvent(new CustomEvent('serene_activity_updated'));

    try {
      const res = await fetch(`${API_BASE}/matches/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, targetId: targetUserId, reason: reason || 'Incompatible match' })
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return true;
    }
  },

  async unblockProfile(targetId: string): Promise<boolean> {
    const user = profileService.getCurrentUser();
    const blockListKey = `serene_blocked_${user.id}`;
    const localBlocked = this.getUserBlocked(user.id).filter(b => b.id !== targetId);
    localStorage.setItem(blockListKey, JSON.stringify(localBlocked));
    window.dispatchEvent(new CustomEvent('serene_block_updated'));

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
};
