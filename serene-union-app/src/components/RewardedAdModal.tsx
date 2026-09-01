import React, { useState, useEffect } from 'react';
import { API_BASE } from '../services/dbService';

interface Props {
  userId: string;
  rewardType?: 'likes' | 'salam' | 'messages' | 'photo_unblur';
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: () => void;
}

export const RewardedAdModal: React.FC<Props> = ({ userId, rewardType = 'likes', isOpen, onClose, onRewardClaimed }) => {
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(15);
      setIsCompleted(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = async () => {
    try {
      await fetch(`${API_BASE}/wallet/reward-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rewardType })
      });
    } catch {}

    onRewardClaimed();
    onClose();
  };

  const getRewardTitle = () => {
    if (rewardType === 'salam') return '+1 Direct Salam Pass';
    return '+10 Extra Discover Likes';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4 font-sans animate-fade-in select-none">
      <div className="w-full max-w-[440px] bg-surface rounded-[36px] overflow-hidden shadow-2xl border border-surface-variant/80 flex flex-col relative animate-slide-up">
        
        {/* Top Ad Banner Header */}
        <div className="p-4 bg-surface-variant/50 flex items-center justify-between border-b border-surface-variant/40">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono uppercase shadow-xs">
              Rewarded Sponsor
            </span>
            <span className="text-xs font-bold text-on-surface">Reward in: {timeLeft}s</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-surface border border-surface-variant/80 flex items-center justify-center text-secondary hover:text-on-surface transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            {isCompleted && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface border border-surface-variant/80 flex items-center justify-center text-secondary hover:text-on-surface transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Video / Creative Simulator */}
        <div className="relative w-full h-64 bg-[#081B12] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary-light text-white border border-primary-light/40 flex items-center justify-center mb-3 shadow-emerald animate-pulse">
            <span className="material-symbols-outlined text-3xl">play_circle</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
            <span>Qurab Islamic Matrimony</span>
            <span className="font-arabic text-accent-gold text-sm">قُرب</span>
          </h3>
          <p className="text-xs text-white/80 max-w-xs leading-relaxed">
            Discover thousands of verified practicing Muslim singles seeking sincere, blessed Nikah.
          </p>

          {/* Ad Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/15">
            <div
              className="h-full bg-gradient-to-r from-primary-light via-accent-gold to-primary transition-all duration-1000 ease-linear"
              style={{ width: `${((15 - timeLeft) / 15) * 100}%` }}
            />
          </div>
        </div>

        {/* Reward Claim Area */}
        <div className="p-6 bg-surface flex flex-col items-center gap-3.5 text-center">
          <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-lg text-accent-gold-dark">card_giftcard</span>
            <span>Reward: {getRewardTitle()}</span>
          </div>

          {isCompleted ? (
            <button
              onClick={handleClaim}
              className="w-full py-4 rounded-full bg-gradient-to-r from-primary via-primary to-primary-light text-white font-sans text-xs font-bold shadow-emerald hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <span className="gold-shimmer absolute inset-0 opacity-30 pointer-events-none" />
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Claim {getRewardTitle()} Now 🎉</span>
            </button>
          ) : (
            <div className="w-full py-3.5 rounded-full bg-surface-variant/60 text-secondary font-sans text-xs font-medium text-center border border-surface-variant/80">
              Please watch video ({timeLeft}s remaining to unlock)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

