import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X, PlayCircle, Gift, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { unityAdsService, UNITY_ADS_CONFIG } from '../services/unityAdsService';

interface Props {
  userId: string;
  rewardType?: 'likes' | 'salam' | 'messages' | 'photo_unblur';
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: () => void;
}

export const RewardedAdModal: React.FC<Props> = ({ userId, rewardType = 'likes', isOpen, onClose, onRewardClaimed }) => {
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(5);
      setIsCompleted(false);
      setIsClaiming(false);
      return;
    }

    // Direct, reliable 5-second sponsor countdown
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
    if (isClaiming) return;
    setIsClaiming(true);
    try {
      await unityAdsService.claimReward(userId, rewardType);
    } catch {}

    onRewardClaimed();
    onClose();
  };

  const getRewardTitle = () => {
    if (rewardType === 'salam') return '+1 Direct Salam Pass';
    return '+10 Extra Discover Likes';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 font-sans select-none text-on-surface">
      <div className="w-full max-w-[440px] bg-white rounded-[32px] overflow-hidden shadow-2xl border border-outline flex flex-col relative animate-slide-up">
        
        {/* Top Ad Banner Header */}
        <div className="p-3.5 bg-surface-variant flex items-center justify-between border-b border-outline">
          <div className="flex items-center gap-2">
            <span className="bg-pastel-amber text-pastel-amber-text border border-pastel-amber-border text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wide">
              Unity Ads · Rewarded Sponsor
            </span>
            <span className="text-xs font-bold text-on-surface">
              {isCompleted ? 'Reward Unlocked!' : `Reward in: ${timeLeft}s`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-7 h-7 rounded-full bg-white border border-outline flex items-center justify-center text-secondary hover:text-on-surface transition-colors shadow-subtle"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white border border-outline flex items-center justify-center text-secondary hover:text-on-surface transition-colors shadow-subtle"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video / Creative Simulator */}
        <div className="relative w-full h-64 bg-gradient-to-br from-[#1e1014] via-[#2d1820] to-[#120a0d] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-primary/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-gold/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-rose-400 text-white flex items-center justify-center mb-3 shadow-brand animate-pulse">
              <PlayCircle className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-1.5">
              Qurab Islamic Matrimony
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h3>

            <p className="text-xs text-white/85 max-w-xs leading-relaxed mb-3">
              Discover thousands of verified practicing Muslim singles seeking sincere, blessed Nikah.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-mono border border-white/20 backdrop-blur-none">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unity Placement: {UNITY_ADS_CONFIG.placementId} ({UNITY_ADS_CONFIG.gameId})</span>
            </div>
          </div>

          {/* Ad Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
            <div
              className="h-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-1000 ease-linear"
              style={{ width: `${Math.min(100, Math.max(0, ((5 - timeLeft) / 5) * 100))}%` }}
            />
          </div>
        </div>

        {/* Reward Claim Area */}
        <div className="p-5 bg-white flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-1.5 text-primary font-bold text-xs bg-pastel-rose px-3.5 py-1 rounded-full border border-pastel-rose-border">
            <Gift className="w-3.5 h-3.5 text-primary" />
            <span>Reward: {getRewardTitle()}</span>
          </div>

          {isCompleted ? (
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{isClaiming ? 'Crediting Likes...' : `Claim ${getRewardTitle()} Now 🎉`}</span>
            </button>
          ) : (
            <div className="w-full py-3 rounded-full bg-surface-variant text-secondary font-sans text-xs font-medium text-center border border-outline flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>Please watch video ({timeLeft}s remaining to unlock)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardedAdModal;
