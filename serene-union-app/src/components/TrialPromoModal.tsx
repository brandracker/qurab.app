import React, { useEffect } from 'react';
import { X, Crown, CheckCircle2, RotateCcw, Mail, Eye, ShieldCheck, ArrowRight } from 'lucide-react';
import { backNavigationService } from '../services/backNavigationService';

interface TrialPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrial: () => void;
}

export const TrialPromoModal: React.FC<TrialPromoModalProps> = ({
  isOpen,
  onClose,
  onStartTrial
}) => {
  useEffect(() => {
    if (!isOpen) return;
    return backNavigationService.register(() => {
      onClose();
      return true;
    });
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-promo-title"
    >
      <div 
        className="relative w-full max-w-sm bg-neutral-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-scale-up text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Floating Cross (X) Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close 7-day trial promo"
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer shadow-lg active:scale-90"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Generated Luxury Promo Banner Image */}
        <div className="relative w-full h-44 bg-gradient-to-b from-emerald-950 via-stone-900 to-neutral-900 overflow-hidden flex items-center justify-center">
          <img
            src="/trial_promo_banner.jpg"
            alt="7-Day Free Trial Qurb Barakah VIP"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Graceful fallback if image fails to load
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30 pointer-events-none" />

          {/* Qurb App Icon Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
            <img src="/icon.svg" alt="Qurb" className="w-4 h-4 object-contain" />
            <span className="text-[11px] font-bold font-serif tracking-wide text-white">Qurb VIP</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-3.5">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-bold text-amber-300 font-mono uppercase tracking-wider mb-1.5">
              <Crown className="w-3 h-3 text-amber-300" />
              <span>Special Matrimony Gift</span>
            </div>
            <h3 id="trial-promo-title" className="font-serif text-xl font-bold text-white tracking-tight leading-tight">
              Start Your 7-Day Free Trial
            </h3>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              Experience the full power of <strong className="text-amber-300">Qurb Barakah VIP Club</strong> with 7 days 100% free. Find your righteous spouse with premium privileges.
            </p>
          </div>

          {/* Key VIP Benefits */}
          <div className="grid grid-cols-1 gap-2 bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-2.5 text-xs text-neutral-200">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="flex-1"><strong>Unlimited Daily Likes</strong> (No swipe limits)</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-neutral-200">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-3.5 h-3.5" />
              </div>
              <span className="flex-1"><strong>Unlimited Undo / Rewind</strong> passed profiles</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-neutral-200">
              <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="flex-1"><strong>20 Direct Salam Passes</strong> included</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-neutral-200">
              <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <span className="flex-1"><strong>See Who Liked You</strong> &amp; 100% Ad-Free</span>
            </div>
          </div>

          {/* Pricing & Google Play Guarantee */}
          <div className="flex items-center justify-between px-1 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>PKR 0 today · 7 days free</span>
            </span>
            <span className="text-amber-300 font-medium">Cancel anytime</span>
          </div>

          {/* CTA Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartTrial();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-primary text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-900/40 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/30"
            >
              <Crown className="w-4 h-4 text-amber-200" />
              <span>Claim 7-Day Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-center text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
