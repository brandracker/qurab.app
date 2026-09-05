/**
 * Google AdMob Service for Qurb Islamic Matrimony
 * Configured with Google's Official Universal Rewarded Video Test Ad Unit ID:
 * - App ID: ca-app-pub-3940256099942544~3347511713
 * - Rewarded Unit ID: ca-app-pub-3940256099942544/5224354917
 */

import { Capacitor, registerPlugin } from '@capacitor/core';
import { API_BASE } from './dbService';

export interface AdMobConfig {
  appId: string;
  rewardedAdUnitId: string;
  appName: string;
  testMode: boolean;
}

export const ADMOB_CONFIG: AdMobConfig = {
  appId: 'ca-app-pub-3940256099942544~3347511713',
  rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917',
  appName: 'Qurb',
  testMode: true
};

interface AdMobPluginInterface {
  showRewardedAd(options: { userId: string; rewardType: string }): Promise<{ rewarded: boolean; userId: string; rewardType: string; amount?: number }>;
  isAdReady(): Promise<{ ready: boolean }>;
}

const AdMobNative = registerPlugin<AdMobPluginInterface>('AdMobPlugin');

class AdMobService {
  private config: AdMobConfig = ADMOB_CONFIG;

  public getConfig(): AdMobConfig {
    return this.config;
  }

  /**
   * Check if running in native Android application
   */
  public isNativeBridgeAvailable(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Check if Google AdMob rewarded video is pre-buffered and ready
   */
  public async isAdReady(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const res = await AdMobNative.isAdReady();
      return Boolean(res?.ready);
    } catch {
      return false;
    }
  }

  /**
   * Show native Google AdMob Fullscreen Rewarded Video Ad
   */
  public async showRewardedAd(userId: string, rewardType: 'likes' | 'salam' | 'messages' | 'photo_unblur' = 'likes'): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;

    try {
      const res = await AdMobNative.showRewardedAd({ userId, rewardType });
      if (res?.rewarded) {
        await this.claimReward(userId, rewardType);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('AdMob playback notice:', err);
      return false;
    }
  }

  /**
   * Claim reward from Cloudflare D1 Backend
   */
  public async claimReward(userId: string, rewardType: 'likes' | 'salam' | 'messages' | 'photo_unblur' = 'likes'): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/wallet/reward-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rewardType, placementId: this.config.rewardedAdUnitId })
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch (err) {
      console.warn('AdMob reward claim error:', err);
      return false;
    }
  }
}

export const admobService = new AdMobService();
export default admobService;
