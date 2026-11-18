/**
 * Meta Audience Network Ads Service for Qurb Islamic Matrimony
 * Configured with Live Meta Monetization credentials:
 * - Property: Qurb (Find Your Deen Mate)
 * - Placement ID: 2431468010959063_2431468194292378
 */

import { Capacitor, registerPlugin } from '@capacitor/core';
import { API_BASE } from './dbService';

export interface MetaAdsConfig {
  placementId: string;
  appName: string;
  testMode: boolean;
}

export const META_ADS_CONFIG: MetaAdsConfig = {
  placementId: '2431468010959063_2431468194292378',
  appName: 'Qurb',
  testMode: false
};

interface MetaAdsPluginInterface {
  showRewardedAd(options: { userId: string; rewardType: string; placementId?: string }): Promise<{ rewarded: boolean; userId: string; rewardType: string }>;
  isAdReady(): Promise<{ ready: boolean }>;
  prepareRewardedAd(options?: { placementId?: string }): Promise<{ ready: boolean; buffered: boolean }>;
}

const MetaAdsNative = registerPlugin<MetaAdsPluginInterface>('MetaAdsPlugin');

class MetaAdsService {
  private config: MetaAdsConfig = META_ADS_CONFIG;
  private isPreparing: boolean = false;

  public getConfig(): MetaAdsConfig {
    return this.config;
  }

  /**
   * Check if running in native Android application
   */
  public isNativeBridgeAvailable(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Pre-buffer Meta Audience Network rewarded ad just-in-time
   */
  public async prepareRewardedAd(): Promise<boolean> {
    if (!this.isNativeBridgeAvailable() || this.isPreparing) {
      return false;
    }
    this.isPreparing = true;
    try {
      if (typeof MetaAdsNative.prepareRewardedAd === 'function') {
        const res = await MetaAdsNative.prepareRewardedAd({ placementId: this.config.placementId });
        return !!res?.ready;
      }
      return false;
    } catch (err) {
      console.warn('Meta Ads prepareRewardedAd notice:', err);
      return false;
    } finally {
      this.isPreparing = false;
    }
  }

  /**
   * Check if Meta rewarded video is pre-buffered and ready
   */
  public async isAdReady(): Promise<boolean> {
    if (!this.isNativeBridgeAvailable()) {
      return false;
    }
    try {
      if (typeof MetaAdsNative.isAdReady === 'function') {
        const res = await MetaAdsNative.isAdReady();
        return !!res?.ready;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Show native Meta Fullscreen Rewarded Video Ad with status
   */
  public async showRewardedAdWithStatus(userId: string, rewardType: 'likes' | 'salam' | 'messages' | 'photo_unblur' | 'undo' = 'likes'): Promise<{ rewarded: boolean; failedToLoad: boolean }> {
    if (!this.isNativeBridgeAvailable()) {
      return { rewarded: false, failedToLoad: true };
    }

    try {
      const res = await MetaAdsNative.showRewardedAd({ userId, rewardType, placementId: this.config.placementId });
      if (res && res.rewarded) {
        await this.claimReward(userId, rewardType);
        return { rewarded: true, failedToLoad: false };
      }
      return { rewarded: false, failedToLoad: false };
    } catch (err: any) {
      const errorMessage = err?.message ? String(err.message) : 'Meta ad failed to load';
      console.warn('Meta Ads playback notice:', errorMessage);
      return { rewarded: false, failedToLoad: true };
    }
  }

  /**
   * Show native Meta Fullscreen Rewarded Video Ad
   */
  public async showRewardedAd(userId: string, rewardType: 'likes' | 'salam' | 'messages' | 'photo_unblur' | 'undo' = 'likes'): Promise<boolean> {
    const result = await this.showRewardedAdWithStatus(userId, rewardType);
    return result.rewarded;
  }

  /**
   * Claim reward from Cloudflare D1 Backend
   */
  public async claimReward(userId: string, rewardType: 'likes' | 'salam' | 'messages' | 'photo_unblur' | 'undo' = 'likes'): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/wallet/reward-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rewardType, placementId: this.config.placementId })
      });
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
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Meta Ads reward claim error:', err);
      return false;
    }
  }
}

export const metaAdsService = new MetaAdsService();
export default metaAdsService;
