import { dbService, API_BASE } from './dbService';

export interface LiveNotification {
  id: string;
  type: 'like' | 'match' | 'salam' | 'wali' | 'message' | 'system';
  title: string;
  message: string;
  time: string;
  timestamp: number;
  read: boolean;
  actionLabel?: string;
  targetId?: string;
  avatarUrl?: string;
}

class NotificationService {
  private getStorageKey(): string {
    const user = dbService.getCurrentUser();
    return `serene_live_notifications_${user.id || 'guest'}`;
  }

  hasUnread(): boolean {
    return this.getNotifications().some(n => !n.read);
  }

  async syncLiveNotifications(): Promise<LiveNotification[]> {
    const user = dbService.getCurrentUser();
    if (!user || user.id === 'usr_guest') return this.getNotifications();

    const existingNotifs = this.getNotifications();
    let hasNew = false;

    try {
      // 1. Fetch live D1 notifications first
      const notifRes = await fetch(`${API_BASE}/notifications?userId=${user.id}`);
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        if (notifData.success && Array.isArray(notifData.notifications) && notifData.notifications.length > 0) {
          const map = new Map<string, LiveNotification>();
          notifData.notifications.forEach((n: any) => map.set(n.id, n));
          existingNotifs.forEach(n => {
            if (!map.has(n.id)) map.set(n.id, n);
          });
          const merged = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
          this.save(merged);
          return merged;
        }
      }

      // 2. Fetch live mutual matches from Cloudflare D1
      const matchRes = await fetch(`${API_BASE}/matches/mutual?userId=${user.id}`);
      const matchData = await matchRes.json();

      if (matchData.success && Array.isArray(matchData.matches)) {
        for (const match of matchData.matches) {
          const notifId = `notif_match_${match.id}`;
          const alreadyNotified = existingNotifs.some(
            n => n.id === notifId || (n.type === 'match' && (n.targetId === match.id || n.targetId?.includes(match.id)))
          );

          if (!alreadyNotified) {
            existingNotifs.unshift({
              id: notifId,
              type: 'match',
              title: `Connected with ${match.fullName.split(' ')[0]} 🎉`,
              message: `You and ${match.fullName} are now mutually matched! Say Salam and start your conversation.`,
              time: 'Just now',
              timestamp: Date.now(),
              read: false,
              actionLabel: 'Open Chat',
              targetId: `conv_${[user.id, match.id].sort().join('_')}`,
              avatarUrl: match.photos && match.photos.length > 0 ? match.photos[0] : undefined
            });
            hasNew = true;
          }
        }
      }

      // 3. Fetch live incoming likes from Cloudflare D1
      const likesRes = await fetch(`${API_BASE}/matches/received?userId=${user.id}`);
      const likesData = await likesRes.json();

      if (likesData.success && Array.isArray(likesData.candidates)) {
        for (const candidate of likesData.candidates) {
          const notifId = `notif_like_${candidate.id}`;
          const alreadyNotified = existingNotifs.some(
            n => n.id === notifId || (n.type === 'like' && n.targetId === candidate.id)
          );

          if (!alreadyNotified) {
            existingNotifs.unshift({
              id: notifId,
              type: 'like',
              title: 'New Matrimonial Interest 💖',
              message: `${candidate.fullName.split(' ')[0]} expressed interest in your profile!`,
              time: 'Just now',
              timestamp: Date.now(),
              read: false,
              actionLabel: 'View in Matches',
              targetId: candidate.id,
              avatarUrl: candidate.photos && candidate.photos.length > 0 ? candidate.photos[0] : undefined
            });
            hasNew = true;
          }
        }
      }
    } catch {
      // offline fallback
    }

    if (hasNew) {
      this.save(existingNotifs);
    }
    return existingNotifs;
  }


  getNotifications(): LiveNotification[] {
    const key = this.getStorageKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }

    // Generate initial live notifications based on REAL active user data
    return this.generateFromRealUserData();
  }

  generateFromRealUserData(): LiveNotification[] {
    const user = dbService.getCurrentUser();
    if (!user || user.id === 'usr_guest') return [];

    const notifications: LiveNotification[] = [];
    const conversations = dbService.getConversations();

    // Generate from real active conversations
    conversations.forEach((conv, idx) => {
      const other = conv.otherUser;
      if (!other) return;

      const timeAgo = conv.lastMessageTime || `${(idx + 1) * 2}h ago`;

      // Match notification
      notifications.push({
        id: `notif_match_${conv.id}`,
        type: 'match',
        title: `Connected with ${other.fullName.split(' ')[0]}`,
        message: conv.lastMessageText || 'Mutual matrimonial interest confirmed. Chat is active.',
        time: timeAgo,
        timestamp: Date.now() - (idx + 1) * 3600000,
        read: idx > 0,
        actionLabel: 'Open Chat',
        targetId: conv.id,
        avatarUrl: other.photos && other.photos.length > 0 ? other.photos[0] : undefined
      });
    });

    // Save to storage
    this.save(notifications);
    return notifications;
  }

  addNotification(notif: Omit<LiveNotification, 'id' | 'timestamp' | 'read' | 'time'>): LiveNotification {
    const notifications = this.getNotifications();
    const newNotif: LiveNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      time: 'Just now',
      read: false
    };

    notifications.unshift(newNotif);
    this.save(notifications);

    const user = dbService.getCurrentUser();
    if (user?.id && user.id !== 'usr_guest') {
      fetch(`${API_BASE}/notifications/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          targetId: notif.targetId,
          avatarUrl: notif.avatarUrl,
          actionLabel: notif.actionLabel
        })
      }).catch(() => {});
    }

    return newNotif;
  }

  markAllAsRead(): void {
    const notifications = this.getNotifications().map(n => ({ ...n, read: true }));
    this.save(notifications);

    const user = dbService.getCurrentUser();
    if (user?.id && user.id !== 'usr_guest') {
      fetch(`${API_BASE}/notifications/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      }).catch(() => {});
    }
  }

  markAsRead(id: string): void {
    const notifications = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    this.save(notifications);

    const user = dbService.getCurrentUser();
    if (user?.id && user.id !== 'usr_guest') {
      fetch(`${API_BASE}/notifications/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, notificationId: id })
      }).catch(() => {});
    }
  }

  clearAll(): void {
    this.save([]);
  }

  private save(items: LiveNotification[]): void {
    const key = this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('serene_notifications_updated'));
  }
}

export const notificationService = new NotificationService();
