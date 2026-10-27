import React, { useEffect } from 'react';
import { Megaphone, X, Check, ExternalLink, Sparkles } from 'lucide-react';
import { backNavigationService } from '../services/backNavigationService';

export const PLAY_STORE_UPDATE_URL = 'https://play.google.com/store/apps/details?id=app.qurb.serene&pcampaignid=web_share';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  actionText?: string;
  onAction?: () => void;
  actionUrl?: string;
}

export const AnnouncementModal: React.FC<Props> = ({
  isOpen,
  title,
  message,
  onClose,
  actionText = 'Alhamdulillah, Understood',
  onAction,
  actionUrl
}) => {
  useEffect(() => {
    if (!isOpen) return;
    return backNavigationService.register(() => {
      onClose();
      return true;
    });
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isUpdateAnnouncement = 
    Boolean(actionUrl) || 
    title.toLowerCase().includes('update') || 
    message.toLowerCase().includes('play store') || 
    message.toLowerCase().includes('update');

  const targetUrl = actionUrl || PLAY_STORE_UPDATE_URL;

  const handleOpenPlayStore = () => {
    if (onAction) onAction();
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs px-4 font-sans select-none text-on-surface animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-outline flex flex-col relative animate-scale-up">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-neutral-900 p-5 text-white relative overflow-hidden">
          {/* Subtle Ambient circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border border-amber-400/20 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full border border-emerald-400/20 pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-md">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Official Announcement
                </span>
                <h3 className="font-serif text-lg font-bold text-white leading-snug">
                  {title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Close Announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-secondary leading-relaxed whitespace-pre-line">
            {message}
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            {isUpdateAnnouncement && (
              <button
                type="button"
                onClick={handleOpenPlayStore}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer border border-emerald-400/30"
              >
                <ExternalLink className="w-4 h-4 text-emerald-200" />
                <span>Update on Google Play Store 🚀</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onAction) onAction();
                onClose();
              }}
              className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer ${
                isUpdateAnnouncement
                  ? 'bg-surface-variant hover:bg-outline text-secondary border border-outline'
                  : 'bg-primary hover:bg-primary-dark text-white shadow-brand'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{actionText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
