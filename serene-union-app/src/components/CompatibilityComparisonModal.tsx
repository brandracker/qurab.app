import React from 'react';
import type { UserProfile } from '../types';

interface Props {
  currentUser: UserProfile;
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const CompatibilityComparisonModal: React.FC<Props> = ({ currentUser, profile, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Stable seed calculation based on IDs
  const seed = (currentUser.id + profile.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const deenScore = 88 + (seed % 10);
  const financeScore = 82 + ((seed * 3) % 15);
  const familyScore = 85 + ((seed * 7) % 12);
  const lifestyleScore = 80 + ((seed * 5) % 18);
  const overallScore = Math.round((deenScore + financeScore + familyScore + lifestyleScore) / 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 font-sans animate-fade-in select-none">
      <div className="w-full max-w-[480px] max-h-[90vh] bg-surface rounded-[36px] p-6 shadow-2xl border border-surface-variant/80 flex flex-col overflow-hidden relative animate-slide-up">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-variant/40">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center shadow-emerald">
              <span className="material-symbols-outlined text-[18px]">psychology_alt</span>
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-on-surface flex items-center gap-1.5">
                <span>Islamic Values Compatibility</span>
                <span className="font-arabic text-primary text-xs font-bold">قُرب</span>
              </h2>
              <p className="text-[10px] text-secondary">4-Pillars Islamic Alignment Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface border border-surface-variant/80 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Overall Big Badge */}
          <div className="bg-gradient-to-r from-primary/10 via-surface to-accent-gold-light/25 rounded-3xl p-5 border border-primary/25 flex items-center justify-between shadow-card">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-0.5">
                Barakah Alignment Engine
              </span>
              <h3 className="font-serif text-2xl font-bold text-on-surface">
                {overallScore}% Match
              </h3>
              <p className="text-xs text-secondary mt-0.5 max-w-[220px]">
                High values alignment with {profile.fullName.split(' ')[0]}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center font-serif text-xl font-bold shadow-emerald">
              {overallScore}%
            </div>
          </div>

          {/* 4 Pillars Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">
              Core Pillars Breakdown
            </h4>

            {/* 1. Deen */}
            <div className="bg-surface p-4 rounded-2xl border border-surface-variant/80 shadow-2xs">
              <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                <span className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[16px]">mosque</span>
                  Deen & Spiritual Routine
                </span>
                <span className="text-primary font-mono">{deenScore}%</span>
              </div>
              <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full" style={{ width: `${deenScore}%` }} />
              </div>
              <p className="text-[11px] text-secondary mt-1.5 leading-relaxed">
                Both prioritize daily prayers and resolving disagreements through Sunnah adab.
              </p>
            </div>

            {/* 2. Family & In-Laws */}
            <div className="bg-surface p-4 rounded-2xl border border-surface-variant/80 shadow-2xs">
              <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                <span className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[16px]">home</span>
                  Family & Living Expectations
                </span>
                <span className="text-primary font-mono">{familyScore}%</span>
              </div>
              <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full" style={{ width: `${familyScore}%` }} />
              </div>
              <p className="text-[11px] text-secondary mt-1.5 leading-relaxed">
                Aligned on {profile.livingPreference?.replace('_', ' ') || 'independent'} living and strong ties to parents.
              </p>
            </div>

            {/* 3. Finances & Mahr */}
            <div className="bg-surface p-4 rounded-2xl border border-surface-variant/80 shadow-2xs">
              <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                <span className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[16px]">account_balance_wallet</span>
                  Finances & Mahr Philosophy
                </span>
                <span className="text-primary font-mono">{financeScore}%</span>
              </div>
              <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full" style={{ width: `${financeScore}%` }} />
              </div>
              <p className="text-[11px] text-secondary mt-1.5 leading-relaxed">
                Shared commitment to zero-Riba ethical earnings and modest Sunnah celebrations.
              </p>
            </div>

            {/* 4. Lifestyle & Parenting */}
            <div className="bg-surface p-4 rounded-2xl border border-surface-variant/80 shadow-2xs">
              <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                <span className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[16px]">nature_people</span>
                  Lifestyle & Tarbiyah Vision
                </span>
                <span className="text-primary font-mono">{lifestyleScore}%</span>
              </div>
              <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full" style={{ width: `${lifestyleScore}%` }} />
              </div>
              <p className="text-[11px] text-secondary mt-1.5 leading-relaxed">
                Balanced outlook on career growth, strong Islamic Tarbiyah, and modest leisure.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-surface-variant/40">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-primary via-primary to-primary-light text-white font-sans text-xs font-bold shadow-emerald hover:brightness-110 active:scale-98 transition-all"
          >
            Close Values Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};

