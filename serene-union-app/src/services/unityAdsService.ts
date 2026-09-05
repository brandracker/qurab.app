/**
 * Unity Ads Service for Qurb Islamic Matrimony
 * Configured with live Unity Monetization Dashboard credentials:
 * - Application: Qurb (Game ID: 800368124)
 * - Placement ID: Rewarded_Android
 * - Format: Rewarded Video
 */

import { Capacitor, registerPlugin } from '@capacitor/core';
import { API_BASE } from './dbService';

export interface UnityAdsConfig {
  gameId: string;
  placementId: string;
  adFormat: 'Rewarded' | 'Interstitial' | 'Banner';
  appName: string;
  testMode: boolean;
}

export const UNITY_ADS_CONFIG: UnityAdsConfig = {
  gameId: '800368124',
  placementId: 'Rewarded_Android',
  adFormat: 'Rewarded',
  appName: 'Qurb',
  testMode: true
};

interface UnityAdsPluginInterface {
  showRewardedAd(options: { userId: string; rewardType: string }): Promise<{ rewarded: boolean; userId: string; rewardType: string }>;
  isAdReady(): Promise<{ ready: boolean }>;
}

const UnityAdsNative = registerPlugin<UnityAdsPluginInterface>('UnityAdsPlugin');

class UnityAdsService {
  private config: UnityAdsConfig = UNITY_ADS_CONFIG;

  public getConfig(): UnityAdsConfig {
    return this.config;
  }

  /**
   * Check if running in a native Android app
   */
  public isNativeBridgeAvailable(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Initialize Unity Ads SDK
   */
  public async initialize(): Promise<boolean> {
    return true;
  }

  /**
   * Show native Android Unity Ads Fullscreen Rewarded Video
   */
  public async showNativeRewardedAd(userId: string, rewardType: 'likes' | 'salam' | 'messages' | 'photo_unblur' = 'likes'): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;

    try {
      const res = await UnityAdsNative.showRewardedAd({ userId, rewardType });
      if (res?.rewarded) {
        await this.claimReward(userId, rewardType);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Native Unity Ads playback notice:', err);
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
        body: JSON.stringify({ userId, rewardType, placementId: this.config.placementId })
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch (err) {
      console.warn('Reward claim error:', err);
      return false;
    }
  }
}

export const unityAdsService = new UnityAdsService();
export default unityAdsService;
