import React from 'react';
import { ArrowLeft, BookOpen, Heart, CheckCircle2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const TermsScreen: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-background font-sans overflow-y-auto pb-24 select-none text-on-surface">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pt-1">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-outline flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-subtle cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 font-serif text-xs font-bold text-on-surface">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Terms of Service</span>
          </div>
          <div className="w-9" />
        </div>

        {/* Title */}
        <div className="mb-5">
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-2">
            Halal Covenant
          </span>
          <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
            Terms of Service
          </h1>
          <p className="text-xs text-secondary leading-relaxed">
            Effective: September 4, 2026 · Qurb Halal Matrimony
          </p>
        </div>

        {/* Covenant Box */}
        <div className="p-4 rounded-2xl bg-pastel-mint border border-pastel-mint-border mb-5 shadow-subtle">
          <div className="flex items-center gap-2 mb-1.5 text-pastel-mint-text">
            <Heart className="w-4 h-4 shrink-0" />
            <span className="font-serif font-bold text-xs">Halal Matrimony Agreement</span>
          </div>
          <p className="text-xs text-on-surface leading-relaxed">
            Qurb is strictly dedicated to lawful Islamic marriage (Nikah). By registering, you confirm that you are seeking a righteous spouse upon the Quran & Sunnah with honest intentions.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4 text-xs text-secondary leading-relaxed">
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <h2 className="font-serif font-bold text-sm text-on-surface">1. Eligibility</h2>
            <p className="text-on-surface">To use Qurb, you must:</p>
            <ul className="list-disc pl-4 space-y-1 text-secondary mt-1">
              <li>Be at least 18 years old.</li>
              <li>Be legally and Islamically eligible for marriage.</li>
              <li>Provide honest and truthful biographical details.</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <h2 className="font-serif font-bold text-sm text-on-surface">2. Code of Conduct & Modesty</h2>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-surface-variant border border-outline">
                <strong className="block text-[11px] text-on-surface">Strictly Matrimonial</strong>
                <span className="text-[10px] text-secondary">Casual dating, non-marital relationships, or hookups are strictly prohibited.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-variant border border-outline">
                <strong className="block text-[11px] text-on-surface">Zero Abuse Tolerance</strong>
                <span className="text-[10px] text-secondary">Harassment, offensive remarks, or explicit messages lead to immediate permanent ban.</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <h2 className="font-serif font-bold text-sm text-on-surface">3. Community Safety & Reports</h2>
            <p className="text-on-surface">
              Members can report or block suspicious profiles at any time. Our moderation team reviews flagged interactions to preserve the purity and safety of our platform.
            </p>
          </div>

          <div className="bg-surface-variant p-4 rounded-2xl border border-outline space-y-1">
            <h2 className="font-serif font-bold text-xs text-on-surface">Legal & Support Inquiries</h2>
            <p className="text-[11px] text-secondary">
              For legal notices or questions regarding these terms:
            </p>
            <p className="text-[11px] font-bold text-primary">legal@qurb.app · support@qurb.app</p>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <button
          onClick={onBack}
          className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I Accept the Terms</span>
        </button>
      </div>
    </div>
  );
};
export default TermsScreen;
