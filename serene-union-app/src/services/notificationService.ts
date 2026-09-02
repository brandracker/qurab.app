import { dbService } from './dbService';

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
        message: conv.lastMessageText || 'Mutual matrimonial interest confirmed. Chaperoned chat is active.',
        time: timeAgo,
        timestamp: Date.now() - (idx + 1) * 3600000,
        read: idx > 0,
        actionLabel: 'Open Chat',
        targetId: conv.id,
        avatarUrl: other.photos && other.photos.length > 0 ? other.photos[0] : undefined
      });
    });

    // If user has a Wali linked, add real Wali confirmation
    if (user.wali) {
      notifications.push({
        id: 'notif_wali_linked',
        type: 'wali',
        title: 'Wali Chaperone Active',
        message: `Guardian ${user.wali.name} (${user.wali.relationship}) is registered to monitor communications with modesty.`,
        time: '1d ago',
        timestamp: Date.now() - 86400000,
        read: true
      });
    }

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
    return newNotif;
  }

  markAllAsRead(): void {
    const notifications = this.getNotifications().map(n => ({ ...n, read: true }));
    this.save(notifications);
  }

  markAsRead(id: string): void {
    const notifications = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    this.save(notifications);
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
