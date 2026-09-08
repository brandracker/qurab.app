import React from 'react';
import { ArrowLeft, BookOpen, Heart, CheckCircle2, CreditCard, Trash2, Mail } from 'lucide-react';

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
            aria-label="Go Back"
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
            Halal Covenant & Agreement
          </span>
          <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
            Terms of Service
          </h1>
          <p className="text-xs text-secondary leading-relaxed">
            Effective: September 4, 2026 · Qurb Halal Matrimony (qurb.app)
          </p>
        </div>

        {/* Covenant Box */}
        <div className="p-4 rounded-2xl bg-pastel-mint border border-pastel-mint-border mb-5 shadow-subtle">
          <div className="flex items-center gap-2 mb-1.5 text-pastel-mint-text">
            <Heart className="w-4 h-4 shrink-0" />
            <span className="font-serif font-bold text-xs">Halal Matrimony Covenant</span>
          </div>
          <p className="text-xs text-on-surface leading-relaxed">
            Qurb is strictly dedicated to lawful Islamic marriage (Nikah). By registering or using our platform, you make a solemn covenant that you are seeking a righteous spouse upon the Quran and Sunnah with genuine and sincere intentions.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4 text-xs text-secondary leading-relaxed">
          {/* Section 1: Eligibility */}
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <h2 className="font-serif font-bold text-sm text-on-surface">1. Eligibility Requirements</h2>
            <p className="text-on-surface">To register and maintain an account on Qurb, you must:</p>
            <ul className="list-disc pl-4 space-y-1 text-secondary mt-1">
              <li>Be at least <strong>18 years of age</strong> (or legal majority in your country).</li>
              <li>Be Islamically and legally eligible to enter into Nikah.</li>
              <li>Provide honest, authentic, and accurate biographical details.</li>
              <li>Act purely for marriage, never for dating, casual encounters, or commercial promotion.</li>
            </ul>
          </div>

          {/* Section 2: Islamic Code of Conduct */}
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-2">
            <h2 className="font-serif font-bold text-sm text-on-surface">2. Islamic Code of Conduct</h2>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-surface-variant border border-outline">
                <strong className="block text-[11px] text-on-surface mb-0.5">Strictly Matrimonial</strong>
                <span className="text-[10px] text-secondary">Casual dating, non-marital friendships, or hookups are strictly prohibited and result in permanent removal.</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-variant border border-outline">
                <strong className="block text-[11px] text-on-surface mb-0.5">Zero Abuse & Respectful Adab</strong>
                <span className="text-[10px] text-secondary">Vulgarity, harassment, stalking, offensive comments, or explicit imagery result in an immediate permanent ban.</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-variant border border-outline">
                <strong className="block text-[11px] text-on-surface mb-0.5">No Financial Solicitation</strong>
                <span className="text-[10px] text-secondary">Soliciting funds, loans, commercial business, or third-party contact gathering is strictly forbidden.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Modesty, Voice Greetings & Chaperone */}
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <h2 className="font-serif font-bold text-sm text-on-surface">3. Modesty Shield, Voice & Chaperone</h2>
            <ul className="list-disc pl-4 space-y-1.5 text-secondary mt-1">
              <li><strong>Modesty Shield:</strong> Photos may be blurred by default. Unblurring requires mutual 1-to-1 approval. Taking screenshots or disseminating photos without consent is strictly prohibited.</li>
              <li><strong>Halal Voice Greetings:</strong> Voice recordings must remain respectful and dignified. Background music or provocative audio is prohibited.</li>
              <li><strong>Wali (Guardian) Participation:</strong> Sisters may invite or provide contact details for their Wali to chaperone conversations. All users agree to honor family chaperone involvement.</li>
            </ul>
          </div>

          {/* Section 4: In-App Purchases & Subscriptions */}
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <div className="flex items-center gap-2 text-on-surface">
              <CreditCard className="w-4 h-4 text-primary shrink-0" />
              <h2 className="font-serif font-bold text-sm">4. Google Play Billing & Subscriptions</h2>
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-secondary mt-1">
              <li><strong>Free Tier:</strong> Basic features, verified profile discovery, and daily likes are provided free. Additional likes can be replenished via rewarded video ads.</li>
              <li><strong>Qurb Barakah VIP Club:</strong> A monthly auto-renewing subscription unlocking premium benefits (See Who Liked You, unlimited likes, 20 monthly direct salams, and priority matching). Billing is processed through <strong>Google Play In-App Billing</strong> on Android and Google Pay on web.</li>
              <li><strong>How to Cancel:</strong> You can manage or cancel your subscription at any time directly through Google Play Store: <em>Google Play Store &gt; Profile icon &gt; Payments & Subscriptions &gt; Subscriptions &gt; Qurb &gt; Cancel Subscription</em>. You retain access until the end of the paid period.</li>
              <li><strong>Consumables:</strong> Direct Salams (packs of 20) and 24-Hour City Spotlight Boosts are one-time purchases and non-refundable once activated.</li>
            </ul>
          </div>

          {/* Section 5: Account Deletion */}
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <div className="flex items-center gap-2 text-on-surface">
              <Trash2 className="w-4 h-4 text-error shrink-0" />
              <h2 className="font-serif font-bold text-sm text-error">5. Account Deletion & Termination</h2>
            </div>
            <p className="text-on-surface">
              You may terminate your account at any time in compliance with Google Play Data Safety rules:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-secondary mt-1">
              <li><strong>In-App Deletion:</strong> Go to <strong>Settings & Privacy &gt; Delete Profile Permanently</strong>. Once confirmed, all your data, chats, voice recordings, and photos are purged from our live databases.</li>
              <li><strong>Email Deletion:</strong> Contact <a href="mailto:privacy@qurb.app" className="font-bold text-primary underline">privacy@qurb.app</a> to request data erasure.</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="bg-surface-variant p-4 rounded-2xl border border-outline space-y-1">
            <div className="flex items-center gap-1.5 text-on-surface font-serif font-bold text-xs">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Legal & Support Inquiries</span>
            </div>
            <p className="text-[11px] text-secondary">
              For questions regarding these Terms of Service or community guidance:
            </p>
            <p className="text-[11px] font-bold text-primary">legal@qurb.app · support@qurb.app</p>
            <p className="text-[10px] text-secondary">
              Official web URL: <a href="https://qurb.app/terms" target="_blank" rel="noreferrer" className="underline text-on-surface font-semibold">https://qurb.app/terms</a>
            </p>
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
