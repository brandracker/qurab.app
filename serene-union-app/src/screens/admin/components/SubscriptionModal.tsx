import React, { useState } from 'react';
import { X, Crown, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import type { CandidateUser } from '../types';

interface SubscriptionModalProps {
  user: CandidateUser | null;
  onClose: () => void;
  onUpdateSubscription: (
    userId: string,
    tier: string,
    directSalams: number,
    isVip: boolean,
    resetQuotas: boolean
  ) => Promise<void>;
  isSubmitting?: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  user,
  onClose,
  onUpdateSubscription,
  isSubmitting = false
}) => {
  if (!user) return null;

  const currentIsVip = Boolean(user.is_vip);
  const currentTier = user.wallet?.subscription_tier || (currentIsVip ? 'barakah_vip' : 'free');
  const currentSalams = user.wallet?.direct_salams_balance ?? (currentIsVip ? 20 : 2);

  const [selectedTier, setSelectedTier] = useState<string>(currentTier === 'barakah_vip' ? 'barakah_vip' : 'free');
  const [salamsToAdd, setSalamsToAdd] = useState<number>(0);
  const [resetQuotas, setResetQuotas] = useState<boolean>(true);

  const handleSave = async () => {
    const isVip = selectedTier === 'barakah_vip';
    await onUpdateSubscription(user.id, selectedTier, salamsToAdd, isVip, resetQuotas);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0F172A] border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 my-8 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif flex items-center space-x-2">
                <span>Manage Subscription</span>
              </h3>
              <p className="text-xs text-slate-400">
                Candidate: <strong className="text-white">{user.full_name}</strong> ({user.email || user.phone})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Overview */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Current Plan:</span>
            <span className={`font-semibold inline-flex items-center space-x-1 mt-0.5 ${currentIsVip ? 'text-amber-400' : 'text-slate-300'}`}>
              {currentIsVip ? <Crown className="w-3.5 h-3.5" /> : null}
              <span>{currentIsVip ? 'Barakah VIP Active' : 'Standard Free'}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Direct Salams Balance:</span>
            <span className="font-semibold text-emerald-400 mt-0.5 inline-block">
              {currentSalams} Salams Available
            </span>
          </div>
        </div>

        {/* Plan / Tier Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Membership Tier</span>
          </label>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setSelectedTier('barakah_vip')}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                selectedTier === 'barakah_vip'
                  ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
              }`}
            >
              <div className={`mt-0.5 p-1 rounded-lg ${selectedTier === 'barakah_vip' ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-400'}`}>
                <Crown className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Barakah VIP Club</span>
                  {selectedTier === 'barakah_vip' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Unlimited daily likes (9999), 9999 messaging quota, VIP badge & top discover priority.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier('free')}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                selectedTier === 'free'
                  ? 'bg-sky-500/15 border-sky-500/50 shadow-lg shadow-sky-500/10'
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
              }`}
            >
              <div className={`mt-0.5 p-1 rounded-lg ${selectedTier === 'free' ? 'bg-sky-500 text-black' : 'bg-white/10 text-slate-400'}`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Standard / Free Seeker</span>
                  {selectedTier === 'free' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Standard free allowances (50 likes/day, standard daily messages, no VIP badge).
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Bonus Direct Salams to Credit */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bonus Direct Salams to Credit</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 5, 10, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setSalamsToAdd(num)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  salamsToAdd === num
                    ? 'bg-emerald-500/25 border-emerald-500 text-emerald-300 shadow'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {num === 0 ? 'No Extra' : `+${num} Salams`}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Quotas */}
        <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={resetQuotas}
            onChange={(e) => setResetQuotas(e.target.checked)}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
          <span>Instantly reset today's consumed likes and messages to 0</span>
        </label>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 transition-all"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save & Sync Subscription'}
          </button>
        </div>

      </div>
    </div>
  );
};
