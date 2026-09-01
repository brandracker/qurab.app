import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  CheckCheck, 
  Trash2,
  ChevronRight
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
  avatarUrl?: string;
}

interface Props {
  isOpen: boolean;
  onBack: () => void;
  onNavigateToMatches?: () => void;
  onNavigateToChat?: (convId?: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'like',
    title: 'New Interest Received',
    message: 'A practicing candidate from Lahore expressed interest in your matrimonial biodata.',
    time: '10m ago',
    read: false,
    actionLabel: 'View Candidate',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
  },
  {
    id: 'n2',
    type: 'salam',
    title: 'Direct Salam Request',
    message: 'Tariq sent you a Direct Salam pass with a sincere marriage intent note.',
    time: '1h ago',
    read: false,
    actionLabel: 'View Salam Note',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
  },
  {
    id: 'n3',
    type: 'match',
    title: 'Mutual Match Confirmed! 🎉',
    message: 'You and Maryam both expressed mutual interest. Chaperoned chat is now unlocked!',
    time: '3h ago',
    read: false,
    actionLabel: 'Start Chat',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'
  },
  {
    id: 'n4',
    type: 'wali',
    title: 'Wali Guardian Linked',
    message: 'Guardian Tariq Al-Mansoor was successfully linked to oversee communications with modesty.',
    time: '1d ago',
    read: true
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Deen Compatibility Alert',
    message: '5 new verified Sunni/Hanafi candidates matching your 5 daily prayers criteria joined Qurab.',
    time: '2d ago',
    read: true,
    actionLabel: 'Explore Matches'
  }
];

export const NotificationsScreen: React.FC<Props> = ({
  isOpen,
  onBack,
  onNavigateToMatches,
  onNavigateToChat
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('serene_notifications_v1');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeCategory, setActiveCategory] = useState<'all' | 'interests' | 'matches' | 'wali'>('all');

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('serene_notifications_v1');
      if (saved) setNotifications(JSON.parse(saved));
    };
    window.addEventListener('serene_notifications_updated', handleUpdate);
    return () => window.removeEventListener('serene_notifications_updated', handleUpdate);
  }, []);

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
    const updated = notifications.map(n => n.id === item.id ? { ...n, read: true } : n);
    saveNotifications(updated);

    if (item.type === 'like' || item.type === 'salam') {
      if (onNavigateToMatches) onNavigateToMatches();
      onBack();
    } else if (item.type === 'match') {
      if (onNavigateToChat) onNavigateToChat();
      onBack();
    } else if (item.type === 'system') {
      onBack();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredItems = notifications.filter(n => {
    if (activeCategory === 'interests') return n.type === 'like' || n.type === 'salam';
    if (activeCategory === 'matches') return n.type === 'match';
    if (activeCategory === 'wali') return n.type === 'wali' || n.type === 'system';
    return true;
  });

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
    <div className="absolute inset-0 z-50 bg-white flex flex-col select-none text-on-surface animate-fade-in font-sans">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-20 bg-white px-4 py-3.5 border-b border-outline flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-on-surface hover:bg-outline transition-colors shadow-subtle"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-bold text-on-surface">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.2 rounded-full shadow-subtle">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[11px] text-secondary">Match activity, direct salams & updates</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="px-2.5 py-1.5 rounded-full bg-surface-variant hover:bg-outline text-secondary hover:text-on-surface text-xs font-bold transition-all flex items-center gap-1 shadow-subtle"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="text-[11px]">Read All</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              title="Clear all"
              className="w-8 h-8 rounded-full bg-surface-variant hover:bg-pastel-rose text-secondary hover:text-error flex items-center justify-center transition-all shadow-subtle"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Category Pills Bar */}
      <div className="px-4 py-2.5 bg-surface-variant border-b border-outline flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'interests', label: 'Interests & Salams', count: notifications.filter(n => n.type === 'like' || n.type === 'salam').length },
          { id: 'matches', label: 'Mutual Matches', count: notifications.filter(n => n.type === 'match').length },
          { id: 'wali', label: 'Wali & Deen', count: notifications.filter(n => n.type === 'wali' || n.type === 'system').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeCategory === tab.id
                ? 'bg-primary text-white shadow-brand'
                : 'bg-white text-secondary border border-outline hover:text-on-surface shadow-subtle'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-surface-variant text-secondary'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Notification List */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-pastel-rose text-primary flex items-center justify-center mb-3 shadow-subtle">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-base font-bold text-on-surface">No Notifications</h3>
            <p className="text-xs text-secondary max-w-xs mt-1 leading-relaxed">
              You are all caught up! When suitors express interest or send direct salams, they will appear here in real-time.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 shadow-subtle ${
                !item.read
                  ? 'bg-white border-pastel-rose-border ring-1 ring-pastel-rose-border/60 hover:bg-pastel-rose/30'
                  : 'bg-surface-variant border-outline hover:bg-white'
              }`}
            >
              {/* Avatar or Icon Badge */}
              {item.avatarUrl ? (
                <div className="relative w-11 h-11 rounded-2xl overflow-hidden shrink-0 border border-outline shadow-subtle">
                  <img src={item.avatarUrl} alt={item.title} className="w-full h-full object-cover" />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border border-white ${getBadgeBg(item.type)}`}>
                    {getIcon(item.type)}
                  </div>
                </div>
              ) : (
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-subtle ${getBadgeBg(item.type)}`}>
                  {getIcon(item.type)}
                </div>
              )}

              {/* Text & Quick Actions */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className={`text-xs font-bold truncate ${!item.read ? 'text-on-surface font-semibold' : 'text-secondary'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-secondary shrink-0">{item.time}</span>
                </div>

                <p className="text-xs text-secondary leading-relaxed">
                  {item.message}
                </p>

                {item.actionLabel && (
                  <div className="mt-2.5 flex items-center gap-1">
                    <span className="text-xs font-bold text-primary bg-pastel-rose px-3 py-1 rounded-full border border-pastel-rose-border flex items-center gap-1 hover:bg-pastel-rose/80 transition-colors">
                      <span>{item.actionLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-primary" />
                    </span>
                  </div>
                )}
              </div>

              {/* Unread Pink Dot */}
              {!item.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};
export default NotificationsScreen;
