import { API_BASE } from './apiConfig';
import { profileService } from './profileService';

export const walletService = {
  getTodayLikeKey(userId: string): string {
    const today = new Date().toISOString().slice(0, 10);
    return `serene_likes_left_${userId}_${today}`;
  },

  getDirectSalams(userId: string): number {
    try {
      const saved = localStorage.getItem(`serene_salams_left_${userId}`);
      return saved !== null ? parseInt(saved, 10) : 2;
    } catch { return 2; }
  },

  getAdsWatchedForSalam(userId: string): number {
    try {
      const saved = localStorage.getItem(`serene_salam_ads_${userId}`);
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch { return 0; }
  },

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
  },

  async fetchLikesRemaining(userId: string): Promise<{
    likesRemaining: number;
    isVip: boolean;
    directSalams: number;
    adsWatchedForSalam: number;
    isSpotlightActive: boolean;
    spotlightExpiresAt: string | null;
  }> {
    const localKey = this.getTodayLikeKey(userId);
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

          const cur = profileService.getCurrentUser();
          if (cur.id === userId && cur.isVip !== liveVip) {
            profileService.setCurrentUser({ ...cur, isVip: liveVip });
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
  },

  async consumeDailyLike(userId: string): Promise<{ success: boolean; likesRemaining: number }> {
    const localKey = this.getTodayLikeKey(userId);
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
  },

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
      const res = await fetch(`${API_BASE}/wallet/use-salam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const liveSalams = data.directSalams ?? nextLocal;
          try {
            localStorage.setItem(localKey, liveSalams.toString());
          } catch {}
          window.dispatchEvent(new CustomEvent('serene_salams_updated', { detail: { userId, directSalams: liveSalams } }));
          return { success: true, directSalams: liveSalams };
        }
      }
    } catch (e) {
      console.warn('Consume direct salam notice:', e);
    }
    return { success: true, directSalams: nextLocal };
  }
};
