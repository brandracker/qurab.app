import React, { useState, useEffect } from 'react';
import { API_BASE } from '../services/dbService';

interface Props {
  userId: string;
  rewardType: 'messages' | 'salam' | 'photo_unblur';
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: () => void;
}

export const RewardedAdModal: React.FC<Props> = ({ userId, rewardType, isOpen, onClose, onRewardClaimed }) => {
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
    if (rewardType === 'messages') return '+10 Free Messages';
    if (rewardType === 'salam') return '+1 Direct Salam Pass';
    return 'Instant Photo Reveal';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4 font-sans animate-fade-in">
      <div className="w-full max-w-[440px] bg-surface rounded-[32px] overflow-hidden shadow-2xl border border-surface-variant flex flex-col relative">
        
        {/* Top Ad Banner Header */}
        <div className="p-4 bg-surface-container-high flex items-center justify-between border-b border-surface-variant/40">
          <div className="flex items-center gap-2">
            <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
              Sponsored Ad
            </span>
            <span className="text-xs font-bold text-on-surface">Reward in: {timeLeft}s</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-secondary hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            {isCompleted && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Video / Creative Simulator */}
        <div className="relative w-full h-64 bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#154212_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center mb-3 animate-pulse">
            <span className="material-symbols-outlined text-3xl">play_circle</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-white mb-1">
            Serene Barakah Life
          </h3>
          <p className="text-xs text-white/70 max-w-xs leading-relaxed">
            Discover thousands of verified practicing Muslim singles seeking sincere Nikah.
          </p>

          {/* Ad Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${((15 - timeLeft) / 15) * 100}%` }}
            />
          </div>
        </div>

        {/* Reward Claim Area */}
        <div className="p-6 bg-surface flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <span className="material-symbols-outlined text-xl">card_giftcard</span>
            <span>Reward: {getRewardTitle()}</span>
          </div>

          {isCompleted ? (
            <button
              onClick={handleClaim}
              className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Claim {getRewardTitle()} Now 🎉</span>
            </button>
          ) : (
            <div className="w-full py-3 rounded-full bg-surface-container-high text-secondary font-sans text-xs font-medium text-center">
              Please watch video ({timeLeft}s remaining to unlock)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
