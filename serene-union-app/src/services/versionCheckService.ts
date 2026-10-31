import { Capacitor } from '@capacitor/core';
import { API_BASE } from './dbService';

export interface VersionPolicy {
  success: boolean;
  minSupportedVersionCode: number;
  latestVersionCode: number;
  latestVersionName: string;
  forceUpdateEnabled: boolean;
  forceUpdateRequired: boolean;
  softUpdateAvailable: boolean;
  title: string;
  message: string;
  playStoreUrl: string;
}

// Current client build constants (synchronized with android/app/build.gradle)
export const CURRENT_CLIENT_VERSION_CODE = 44;
export const CURRENT_CLIENT_VERSION_NAME = '1.0.43';

class VersionCheckService {
  private cachedPolicy: VersionPolicy | null = null;
  private currentVersionCode: number = CURRENT_CLIENT_VERSION_CODE;
  private currentVersionName: string = CURRENT_CLIENT_VERSION_NAME;
  private isChecking: boolean = false;

  constructor() {
    this.initClientVersion();
  }

  private async initClientVersion() {
    if (Capacitor.isNativePlatform()) {
      try {
        const { App } = await import('@capacitor/app');
        const info = await App.getInfo();
        if (info.build) {
          const parsed = parseInt(info.build, 10);
          if (!isNaN(parsed) && parsed > 0) {
            this.currentVersionCode = parsed;
          }
        }
        if (info.version) {
          this.currentVersionName = info.version;
        }
      } catch (err) {
        console.warn('App.getInfo notice:', err);
      }
    }
  }

  public getClientInfo() {
    return {
      versionCode: this.currentVersionCode,
      versionName: this.currentVersionName
    };
  }

  /**
   * Check for remote version policy and hard-update locks
   */
  public async checkVersion(forceRefresh: boolean = false): Promise<VersionPolicy | null> {
    if (this.isChecking) return this.cachedPolicy;
    if (this.cachedPolicy && !forceRefresh) return this.cachedPolicy;

    this.isChecking = true;
    try {
      await this.initClientVersion();

      const url = `${API_BASE}/version/check?versionCode=${this.currentVersionCode}&versionName=${encodeURIComponent(this.currentVersionName)}`;
      const res = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: VersionPolicy = await res.json();
      this.cachedPolicy = data;
      return data;
    } catch (err) {
      console.warn('Version check error:', err);
      return this.cachedPolicy;
    } finally {
      this.isChecking = false;
    }
  }

  public clearCache() {
    this.cachedPolicy = null;
  }
}

export const versionCheckService = new VersionCheckService();
