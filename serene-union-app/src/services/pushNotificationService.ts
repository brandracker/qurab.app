import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App as CapacitorApp } from '@capacitor/app';
import { dbService, API_BASE } from './dbService';

class PushNotificationService {
  private isInitialized = false;
  private isForeground = true;

  public getIsForeground(): boolean {
    return this.isForeground;
  }

  /**
   * Initializes Push Notifications & Local Notification Channels on native Android
   */
  async init(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      // Track app active / background state for foreground suppression
      CapacitorApp.addListener('appStateChange', (state) => {
        this.isForeground = state.isActive;
        console.log('[Push] App active state:', this.isForeground);
      });

      // 1. Create Android Notification Channels (Messages & Incoming Calls)
      await PushNotifications.createChannel({
        id: 'qurb_messages',
        name: 'Messages & Matches',
        description: 'Instant notifications for new matrimonial messages, likes, and matches',
        importance: 5, // High importance (heads-up banner + sound)
        visibility: 1, // Public (shows on lockscreen)
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#FF2560'
      }).catch(err => {
        console.warn('[Push] Channel creation notice:', err);
      });

      await PushNotifications.createChannel({
        id: 'qurb_calls_v2',
        name: 'Incoming Calls',
        description: 'Full-screen incoming audio and video calls',
        importance: 5,
        visibility: 1,
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#10B981'
      }).catch(err => {
        console.warn('[Push] Call channel creation notice:', err);
      });

      // 2. Request Notification Permissions (Android 13+ POST_NOTIFICATIONS)
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt' || permStatus.receive === 'prompt-with-rationale') {
        permStatus = await PushNotifications.requestPermissions();
      }

      await LocalNotifications.requestPermissions().catch(() => {});

      if (permStatus.receive === 'granted') {
        // 3. Register with Google FCM
        await PushNotifications.register();
      }

      // 4. Handle Registration Token
      PushNotifications.addListener('registration', async (token) => {
        console.log('[Push] Native FCM registration token received:', token.value.slice(0, 15) + '...');
        localStorage.setItem('qurb_fcm_token', token.value);
        
        const currentUser = dbService.getCurrentUser();
        if (currentUser?.id && currentUser.id !== 'usr_guest') {
          await this.syncTokenWithBackend(currentUser.id, token.value);
        }
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.warn('[Push] Registration error notice:', error);
      });

      // 5. Handle Foreground & Background Push Notification
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('[Push] Notification received (isForeground:', this.isForeground, '):', notification);
        const data = notification.data || {};
        
        // WhatsApp-Style Incoming Call Push
        if (data.type === 'incoming_call') {
          window.dispatchEvent(
            new CustomEvent('qurb_incoming_call_push', { detail: data })
          );

          LocalNotifications.schedule({
            notifications: [
              {
                id: 999999,
                title: notification.title || `Incoming ${data.callType === 'video' ? 'Video' : 'Audio'} Call 📞`,
                body: notification.body || `${data.callerName || 'Match'} is calling you on Qurb...`,
                channelId: 'qurb_calls',
                extra: data,
                sound: 'default'
              }
            ]
          }).catch(() => {});
          return;
        }

        // Dispatch soft in-app event so UI badges, chats, and bells update in real-time
        window.dispatchEvent(
          new CustomEvent('qurb_push_received', { detail: { notification, isForeground: this.isForeground } })
        );

        // Only show noisy system tray banner if app is currently in background
        if (!this.isForeground) {
          this.showLocalNotification(
            notification.title || 'New Matrimonial Update 💖',
            notification.body || 'You have a new update in Qurb.',
            data
          );
        }
      });

      // 6. Handle Tap on Push Notification
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('[Push] Action performed on notification:', notification);
        const data = notification.notification.data || {};
        if (data.type === 'incoming_call') {
          window.dispatchEvent(
            new CustomEvent('qurb_incoming_call_push', { detail: data })
          );
        } else if (data.conversationId) {
          window.dispatchEvent(
            new CustomEvent('qurb_open_chat', { detail: { conversationId: data.conversationId } })
          );
        } else if (data.type === 'like' || data.type === 'match' || data.targetTab === 'matches') {
          window.dispatchEvent(
            new CustomEvent('qurb_navigate_tab', { detail: { tab: 'matches' } })
          );
        } else if (data.targetTab) {
          window.dispatchEvent(
            new CustomEvent('qurb_navigate_tab', { detail: { tab: data.targetTab } })
          );
        }
      });

      // 7. Handle Tap on Local Notification
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        const extra = notification.notification.extra || {};
        if (extra.type === 'incoming_call') {
          window.dispatchEvent(
            new CustomEvent('qurb_incoming_call_push', { detail: extra })
          );
        } else if (extra.conversationId) {
          window.dispatchEvent(
            new CustomEvent('qurb_open_chat', { detail: { conversationId: extra.conversationId } })
          );
        } else if (extra.type === 'like' || extra.type === 'match' || extra.targetTab === 'matches') {
          window.dispatchEvent(
            new CustomEvent('qurb_navigate_tab', { detail: { tab: 'matches' } })
          );
        } else if (extra.targetTab) {
          window.dispatchEvent(
            new CustomEvent('qurb_navigate_tab', { detail: { tab: extra.targetTab } })
          );
        }
      });

      // 8. Check if native Android cold boot captured a pending incoming call
      if (typeof window !== 'undefined' && window.AndroidAudioBridge?.getPendingIncomingCall) {
        try {
          const pendingJson = window.AndroidAudioBridge.getPendingIncomingCall();
          if (pendingJson) {
            const pendingData = JSON.parse(pendingJson);
            if (pendingData && pendingData.type === 'incoming_call') {
              console.log('[Push] Dispatching native pending incoming call from cold boot:', pendingData);
              window.dispatchEvent(
                new CustomEvent('qurb_incoming_call_push', { detail: pendingData })
              );
            }
          }
        } catch (e) {
          console.warn('[Push] Error reading native pending call:', e);
        }
      }

    } catch (err) {
      console.warn('[Push] Initialization notice:', err);
    }
  }

  /**
   * Syncs saved user FCM token with Cloudflare D1
   */
  async syncSavedToken(userId: string): Promise<boolean> {
    if (!userId || userId === 'usr_guest') return false;
    const token = localStorage.getItem('qurb_fcm_token');
    if (token) {
      return await this.syncTokenWithBackend(userId, token);
    }
    return false;
  }

  /**
   * Syncs user FCM token with Cloudflare D1
   */
  async syncTokenWithBackend(userId: string, token: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/users/push-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token })
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Displays an immediate native Android banner notification with sound
   */
  async showLocalNotification(title: string, body: string, extraData?: Record<string, any> | string, force: boolean = false): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    if (this.isForeground && !force) return;

    const extra = typeof extraData === 'string' ? { conversationId: extraData } : (extraData || {});

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 1000000),
            title,
            body,
            channelId: 'qurb_messages',
            extra,
            sound: 'default'
          }
        ]
      });
    } catch (err) {
      console.warn('[LocalNotification] Dispatch notice:', err);
    }
  }
}

export const pushNotificationService = new PushNotificationService();
