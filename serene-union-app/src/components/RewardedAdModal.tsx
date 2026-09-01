import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X, PlayCircle, Gift, CheckCircle2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs px-4 font-sans animate-fade-in select-none text-on-surface">
      <div className="w-full max-w-[440px] bg-white rounded-[36px] overflow-hidden shadow-2xl border border-outline flex flex-col relative animate-slide-up">
        
        {/* Top Ad Banner Header */}
        <div className="p-3.5 bg-surface-variant flex items-center justify-between border-b border-outline">
          <div className="flex items-center gap-2">
            <span className="bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border text-[10px] font-bold px-2 py-0.2 rounded-full font-mono uppercase">
              Rewarded Sponsor
            </span>
            <span className="text-xs font-bold text-on-surface">Reward in: {timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-7 h-7 rounded-full bg-white border border-outline flex items-center justify-center text-secondary hover:text-on-surface transition-colors shadow-subtle"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            {isCompleted && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white border border-outline flex items-center justify-center text-secondary hover:text-on-surface transition-colors shadow-subtle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Video / Creative Simulator */}
        <div className="relative w-full h-60 bg-[#1e1014] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-3 shadow-brand animate-pulse">
            <PlayCircle className="w-8 h-8" />
          </div>

          <h3 className="font-serif text-base font-bold text-white mb-1 flex items-center gap-1.5">
            <span>Qurab Islamic Matrimony</span>
            <span className="font-arabic text-primary-light text-xs font-bold">قُرب</span>
          </h3>
          <p className="text-xs text-white/80 max-w-xs leading-relaxed">
            Discover thousands of verified practicing Muslim singles seeking sincere, blessed Nikah.
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
        <div className="p-5 bg-white flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-1.5 text-primary font-bold text-xs bg-pastel-rose px-3 py-1 rounded-full border border-pastel-rose-border">
            <Gift className="w-3.5 h-3.5 text-primary" />
            <span>Reward: {getRewardTitle()}</span>
          </div>

          {isCompleted ? (
            <button
              onClick={handleClaim}
              className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Claim {getRewardTitle()} Now 🎉</span>
            </button>
          ) : (
            <div className="w-full py-2.5 rounded-full bg-surface-variant text-secondary font-sans text-xs font-medium text-center border border-outline">
              Please watch video ({timeLeft}s remaining to unlock)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RewardedAdModal;
