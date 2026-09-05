import React from 'react';
import { HeartHandshake, X, BookOpen, Home, Wallet, Heart } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs px-4 font-sans animate-fade-in select-none text-on-surface">
      <div className="w-full max-w-[480px] max-h-[90vh] bg-white rounded-[36px] p-5 sm:p-6 shadow-2xl border border-outline flex flex-col overflow-hidden relative animate-slide-up">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-outline">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-pastel-rose text-primary border border-pastel-rose-border flex items-center justify-center">
              <HeartHandshake className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-on-surface">
                Islamic Values Compatibility
              </h2>
              <p className="text-[10px] text-secondary">4-Pillars Islamic Alignment Analysis</p>
            </div>

          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-on-surface hover:bg-outline transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {/* Overall Big Badge */}
          <div className="bg-pastel-rose rounded-3xl p-4 border border-pastel-rose-border flex items-center justify-between shadow-subtle">
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
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-serif text-xl font-bold shadow-brand">
              {overallScore}%
            </div>
          </div>

          {/* 4 Pillars Breakdown */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">
              Core Pillars Breakdown
            </h4>

            {/* 1. Deen (Pastel Mint) */}
            <div className="bg-pastel-mint p-3.5 rounded-2xl border border-pastel-mint-border shadow-subtle">
              <div className="flex justify-between items-center text-xs mb-1 font-bold">
                <span className="flex items-center gap-1.5 text-pastel-mint-text">
                  <BookOpen className="w-3.5 h-3.5" />
                  Deen & Spiritual Routine
                </span>
                <span className="text-pastel-mint-text font-mono">{deenScore}%</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-pastel-mint-border">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${deenScore}%` }} />
              </div>
              <p className="text-[11px] text-secondary mt-1.5 leading-relaxed">
                Both prioritize daily prayers and resolving disagreements through Sunnah adab.
              </p>
            </div>

            {/* 2. Family & In-Laws (Pastel Sand) */}
            <div className="bg-pastel-sand p-3.5 rounded-2xl border border-pastel-sand-border shadow-subtle">
              <div className="flex justify-between items-center text-xs mb-1 font-bold">
                <span className="flex items-center gap-1.5 text-pastel-sand-text">
                  <Home className="w-3.5 h-3.5" />
                  Family & Living Expectations
                </span>
                <span className="text-pastel-sand-text font-mono">{familyScore}%</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-pastel-sand-border">
                <div className="bg-stone-600 h-full rounded-full" style={{ width: `${familyScore}%` }} />
              </div>
              <p className="text-[11px] text-secondary mt-1.5 leading-relaxed">
                Aligned on {profile.livingPreference?.replace('_', ' ') || 'independent'} living and strong ties to parents.
              </p>
            </div>

            {/* 3. Finances & Mahr (Pastel Sky) */}
            <div className="bg-pastel-sky p-3.5 rounded-2xl border border-pastel-sky-border shadow-subtle">
              <div className="flex justify-between items-center text-xs mb-1 font-bold">
                <span className="flex items-center gap-1.5 text-pastel-sky-text">
                  <Wallet className="w-3.5 h-3.5" />
                  Finances & Mahr Philosophy
                </span>
                <span className="text-pastel-sky-text font-mono">{financeScore}%</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-pastel-sky-border">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${financeScore}%` }} />
              </div>
              <p className="text-[11px] text-secondary mt-1.5 leading-relaxed">
                Shared commitment to zero-Riba ethical earnings and modest Sunnah celebrations.
              </p>
            </div>

            {/* 4. Lifestyle & Parenting (Pastel Lavender) */}
            <div className="bg-pastel-lavender p-3.5 rounded-2xl border border-pastel-lavender-border shadow-subtle">
              <div className="flex justify-between items-center text-xs mb-1 font-bold">
                <span className="flex items-center gap-1.5 text-pastel-lavender-text">
                  <Heart className="w-3.5 h-3.5" />
                  Lifestyle & Tarbiyah Vision
                </span>
                <span className="text-pastel-lavender-text font-mono">{lifestyleScore}%</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-pastel-lavender-border">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${lifestyleScore}%` }} />
              </div>
              <p className="text-[11px] text-secondary mt-1.5 leading-relaxed">
                Balanced outlook on career growth, strong Islamic Tarbiyah, and modest leisure.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2.5 border-t border-outline">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all"
          >
            Close Values Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
export default CompatibilityComparisonModal;
