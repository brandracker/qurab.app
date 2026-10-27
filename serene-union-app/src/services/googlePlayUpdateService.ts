import { Capacitor, registerPlugin } from '@capacitor/core';

export interface AppUpdateInfoResult {
  updateAvailability: number;
  isUpdateAvailable: boolean;
  availableVersionCode: number;
  isImmediateAllowed: boolean;
  isFlexibleAllowed: boolean;
  installStatus?: number;
  error?: string;
}

export interface AppUpdateResult {
  resultCode: number;
  success: boolean;
  canceled?: boolean;
}

interface AppUpdatePluginInterface {
  checkAppUpdate(): Promise<AppUpdateInfoResult>;
  startImmediateUpdate(): Promise<AppUpdateResult>;
  completeFlexibleUpdate(): Promise<{ success: boolean }>;
}

const AppUpdateNative = registerPlugin<AppUpdatePluginInterface>('AppUpdatePlugin');

class GooglePlayUpdateService {
  public isNativeAndroid(): boolean {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
  }

  /**
   * Query Google Play Store API for in-app update availability
   */
  public async checkAppUpdate(): Promise<AppUpdateInfoResult | null> {
    if (!this.isNativeAndroid()) return null;
    try {
      if (typeof AppUpdateNative.checkAppUpdate === 'function') {
        return await AppUpdateNative.checkAppUpdate();
      }
    } catch (e) {
      console.warn('Google Play In-App Update check notice:', e);
    }
    return null;
  }

  /**
   * Start Google Play's native full-screen immediate update flow
   */
  public async startImmediateUpdate(): Promise<boolean> {
    if (!this.isNativeAndroid()) return false;
    try {
      if (typeof AppUpdateNative.startImmediateUpdate === 'function') {
        const res = await AppUpdateNative.startImmediateUpdate();
        return Boolean(res?.success);
      }
    } catch (e) {
      console.warn('Google Play Immediate Update launch notice:', e);
    }
    return false;
  }
}

export const googlePlayUpdateService = new GooglePlayUpdateService();
