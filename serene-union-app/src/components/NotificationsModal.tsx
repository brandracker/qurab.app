import React, { useState } from 'react';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Check, 
  Trash2,
  ExternalLink
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'like' | 'match' | 'salam' | 'wali' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  targetId?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMatches?: () => void;
  onNavigateToChat?: (convId?: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'like',
    title: 'New Interest Received',
    message: 'A practicing candidate from Lahore expressed interest in your biodata.',
    time: '10m ago',
    read: false,
    actionLabel: 'View in Matches'
  },
  {
    id: 'n2',
    type: 'salam',
    title: 'Direct Salam Request',
    message: 'Tariq sent you a Direct Salam pass with personal note.',
    time: '1h ago',
    read: false,
    actionLabel: 'View Salam'
  },
  {
    id: 'n3',
    type: 'match',
    title: 'Mutual Match Confirmed! 🎉',
    message: 'You and Maryam both expressed mutual interest. Chat is now unlocked!',
    time: '3h ago',
    read: true,
    actionLabel: 'Open Chat'
  },
  {
    id: 'n4',
    type: 'wali',
    title: 'Wali Chaperone Active',
    message: 'Guardian Tariq Al-Mansoor was linked to oversee halal communications.',
    time: '1d ago',
    read: true
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Deen Compatibility Update',
    message: '5 new verified Sunni/Hanafi candidates matching your prayer criteria joined Qurab.',
    time: '2d ago',
    read: true,
    actionLabel: 'Explore Feed'
  }
];

export const NotificationsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigateToMatches,
  onNavigateToChat
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('serene_notifications_v1');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const saveNotifications = (items: NotificationItem[]) => {
    setNotifications(items);
    localStorage.setItem('serene_notifications_v1', JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('serene_notifications_updated'));
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const handleClearAll = () => {
    saveNotifications([]);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Mark as read
    const updated = notifications.map(n => n.id === item.id ? { ...n, read: true } : n);
    saveNotifications(updated);

    if (item.type === 'like' || item.type === 'salam') {
      if (onNavigateToMatches) onNavigateToMatches();
      onClose();
    } else if (item.type === 'match') {
      if (onNavigateToChat) onNavigateToChat();
      onClose();
    } else if (item.type === 'system') {
      onClose();
    }
  };

  const filteredItems = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-primary" />;
      case 'match':
        return <Sparkles className="w-4 h-4 text-primary" />;
      case 'salam':
        return <MessageCircle className="w-4 h-4 text-emerald-600" />;
      case 'wali':
        return <ShieldCheck className="w-4 h-4 text-pastel-mint-text" />;
      default:
        return <Bell className="w-4 h-4 text-secondary" />;
    }
  };

  const getBadgeBg = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
      case 'match':
        return 'bg-pastel-rose border-pastel-rose-border';
      case 'salam':
      case 'wali':
        return 'bg-pastel-mint border-pastel-mint-border';
      default:
        return 'bg-surface-variant border-outline';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs px-0 sm:px-4 select-none text-on-surface animate-fade-in">
      <div className="w-full max-w-[440px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl border border-outline overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-outline flex items-center justify-between bg-white sticky top-0 z-10 shadow-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pastel-rose border border-pastel-rose-border flex items-center justify-center text-primary shadow-subtle">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base font-bold text-on-surface">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.2 rounded-full shadow-subtle">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-secondary">Match requests, salams and halal updates</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="w-8 h-8 rounded-full bg-surface-variant text-secondary hover:text-on-surface flex items-center justify-center transition-colors shadow-subtle text-xs"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-variant text-secondary hover:text-on-surface flex items-center justify-center transition-colors shadow-subtle"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="px-5 py-2.5 bg-surface-variant border-b border-outline flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-white text-on-surface border border-outline shadow-subtle'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeFilter === 'unread'
                  ? 'bg-white text-primary border border-pastel-rose-border shadow-subtle'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[11px] text-secondary hover:text-error transition-colors flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-secondary mb-2">
                <Bell className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-xs font-bold text-on-surface">No notifications found</p>
              <p className="text-[11px] text-secondary mt-0.5">You're all caught up with your matrimonial activity!</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 shadow-subtle ${
                  !item.read 
                    ? 'bg-white border-pastel-rose-border ring-1 ring-pastel-rose-border/50' 
                    : 'bg-surface-variant border-outline hover:bg-white'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-subtle ${getBadgeBg(item.type)}`}>
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className={`text-xs font-bold truncate ${!item.read ? 'text-on-surface' : 'text-secondary'}`}>
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-secondary shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-secondary mt-0.5 leading-relaxed line-clamp-2">
                    {item.message}
                  </p>

                  {item.actionLabel && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
                      <span>{item.actionLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
export default NotificationsModal;
