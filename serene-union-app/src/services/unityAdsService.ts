/**
 * Unity Ads Service for Qurb Islamic Matrimony
 * Configured with live Unity Monetization Dashboard credentials:
 * - Application: Qurb (Game ID: 800368124)
 * - Placement ID: Rewarded_Android
 * - Format: Rewarded Video
 */

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
  testMode: false
};

class UnityAdsService {
  private config: UnityAdsConfig = UNITY_ADS_CONFIG;
  private isInitialized: boolean = false;

  public getConfig(): UnityAdsConfig {
    return this.config;
  }

  /**
   * Check if running in a native Android wrapper with Unity Ads native bridge
   */
  public isNativeBridgeAvailable(): boolean {
    return Boolean(
      (window as any).AndroidUnityAds?.showRewardedAd ||
      (window as any).UnityAds || 
      (window as any).Capacitor?.Plugins?.UnityAds ||
      (window as any).AndroidBridge?.showRewardedAd
    );
  }

  /**
   * Show native Android Unity Ads Rewarded Video
   */
  public showNativeRewardedAd(userId: string, rewardType: 'likes' | 'salam' | 'messages' | 'photo_unblur' = 'likes'): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).AndroidUnityAds?.showRewardedAd) {
        const handler = (_e: any) => {
          window.removeEventListener('unity_ad_completed', handler);
          this.claimReward(userId, rewardType).then(() => resolve(true));
        };
        window.addEventListener('unity_ad_completed', handler);
        (window as any).AndroidUnityAds.showRewardedAd(userId, rewardType);
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Initialize Unity Ads SDK
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      if (this.isNativeBridgeAvailable()) {
        const nativeAds = (window as any).UnityAds || (window as any).Capacitor?.Plugins?.UnityAds;
        if (nativeAds?.initialize) {
          await nativeAds.initialize({
            gameId: this.config.gameId,
            testMode: this.config.testMode
          });
        }
      }
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.warn('Unity Ads initialization warning:', error);
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
