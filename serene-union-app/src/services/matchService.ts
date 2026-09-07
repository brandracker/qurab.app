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

  async sendMatchAction(targetUserId: string, action: 'liked' | 'passed'): Promise<{ isMutual: boolean; conversationId?: string; message?: string }> {
    const user = profileService.getCurrentUser();
    
    let allProf: UserProfile[] = [];
    try {
      const stored = localStorage.getItem(PROFILES_KEY);
      if (stored) allProf = JSON.parse(stored);
    } catch {}
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
      action,
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
    window.dispatchEvent(new CustomEvent('serene_block_updated'));

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
