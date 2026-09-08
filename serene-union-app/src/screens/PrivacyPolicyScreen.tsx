import React from 'react';
import { ArrowLeft, Shield, Lock, CheckCircle2, EyeOff, CreditCard, Trash2, Mail } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const PrivacyPolicyScreen: React.FC<Props> = ({ onBack }) => {
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
            <Shield className="w-4 h-4 text-primary" />
            <span>Privacy Policy</span>
          </div>
          <div className="w-9" />
        </div>

        {/* Title */}
        <div className="mb-5">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-2">
            Amanah & Privacy
          </span>
          <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-secondary leading-relaxed">
            Effective: September 4, 2026 · Qurb Halal Matrimony (qurb.app)
          </p>
        </div>

        {/* Islamic Covenant Box */}
        <div className="p-4 rounded-2xl bg-pastel-rose border border-pastel-rose-border mb-5 shadow-subtle">
          <div className="flex items-center gap-2 mb-1.5 text-primary">
            <Lock className="w-4 h-4 shrink-0" />
            <span className="font-serif font-bold text-xs">Our Sacred Privacy Promise (Amanah)</span>
          </div>
          <p className="text-xs text-on-surface leading-relaxed">
            At Qurb, we treat your matrimonial biodata, voice recordings, and photographs as a sacred trust (Amanah). We do not sell your personal data, nor do we monetize your information with third-party tracking or advertising networks.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4 text-xs text-secondary leading-relaxed">
          {/* Section 1 */}
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-2">
            <div className="flex items-center gap-2 text-on-surface">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <h2 className="font-serif font-bold text-sm">1. Information We Collect</h2>
            </div>
            <p className="text-on-surface">We collect information strictly necessary to facilitate halal Islamic matchmaking:</p>
            <ul className="list-disc pl-4 space-y-1.5 text-secondary mt-1">
              <li><strong>Account Credentials:</strong> Full name, verified email address, Google Profile ID, and authentication tokens.</li>
              <li><strong>Matrimonial Biodata:</strong> Age, height, city/country, education, profession, citizenship, family background, and Nikah timeline.</li>
              <li><strong>Religious Values:</strong> Practice level, sect, madhhab, prayer frequency, and halal lifestyle commitments.</li>
              <li><strong>Modest Photographs:</strong> Photos uploaded to your profile, protected by default with our 1-to-1 Modesty Shield.</li>
              <li><strong>Voice Greetings:</strong> Optional 10–15s halal voice recordings you choose to share with potential suitors.</li>
              <li><strong>Family Chaperone (Wali):</strong> Optional guardian contact name, phone number, and relationship for sisters seeking chaperoned communication.</li>
              <li><strong>Transaction Records:</strong> Purchase tokens and subscription status processed securely via Google Play Billing or Google Pay. We never store or see your raw payment card numbers.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-2">
            <div className="flex items-center gap-2 text-on-surface">
              <Lock className="w-4 h-4 text-primary shrink-0" />
              <h2 className="font-serif font-bold text-sm">2. Google User Data Compliance</h2>
            </div>
            <p className="text-on-surface">
              Qurb's use and transfer of information received from Google APIs adheres strictly to the <strong>Google API Services User Data Policy</strong>, including the Limited Use requirements:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-secondary mt-1">
              <li>We request only basic profile information (name, email address) for verified login.</li>
              <li>Google user data is never sold, leased, or transferred to third-party data brokers or advertisers.</li>
              <li>Authentication data is used exclusively to protect account security and prevent fraudulent bots.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-2">
            <div className="flex items-center gap-2 text-on-surface">
              <EyeOff className="w-4 h-4 text-primary shrink-0" />
              <h2 className="font-serif font-bold text-sm">3. Islamic Modesty Shield & Photo Privacy</h2>
            </div>
            <p className="text-on-surface">
              In accordance with Islamic modesty principles, members can enable our <strong>Modesty Shield</strong>. When enabled, your photos remain blurred on the public Discover feed and are revealed only upon mutual 1-to-1 consent. Unauthorized screenshotting or sharing of revealed photos is strictly forbidden.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-2">
            <div className="flex items-center gap-2 text-on-surface">
              <CreditCard className="w-4 h-4 text-primary shrink-0" />
              <h2 className="font-serif font-bold text-sm">4. In-App Purchases & Google Play Billing</h2>
            </div>
            <p className="text-on-surface">
              All in-app purchases and subscriptions in our Android mobile app (such as Qurb Barakah VIP, 24-Hour Spotlight Boosts, and Direct Salams) are processed exclusively through <strong>Google Play In-App Billing</strong>. On web browsers, transactions are processed via Google Pay. All financial details are tokenized and encrypted by Google; Qurb does not process or retain payment credentials.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-2">
            <div className="flex items-center gap-2 text-on-surface">
              <Trash2 className="w-4 h-4 text-error shrink-0" />
              <h2 className="font-serif font-bold text-sm text-error">5. Account Deletion & Data Rights</h2>
            </div>
            <p className="text-on-surface">
              In full compliance with Google Play Data Safety standards, you maintain total ownership of your personal data:
            </p>
            <ul className="list-disc pl-4 space-y-1.5 text-secondary mt-1">
              <li><strong>In-App Instant Deletion:</strong> You can permanently delete your account at any time by going to <strong>Settings & Privacy &gt; Delete Profile Permanently</strong>. Confirming deletion immediately and permanently erases your profile, photos, voice notes, match history, and messages from our live Cloudflare databases.</li>
              <li><strong>Email Deletion Request:</strong> If you are unable to access the app, email <a href="mailto:privacy@qurb.app" className="font-bold text-primary underline">privacy@qurb.app</a> with the subject "Data Deletion Request". Your request will be fulfilled within 48 hours.</li>
            </ul>
          </div>

          {/* Contact Box */}
          <div className="bg-surface-variant p-4 rounded-2xl border border-outline space-y-1.5">
            <div className="flex items-center gap-1.5 text-on-surface font-serif font-bold text-xs">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Contact Privacy & Data Protection Team</span>
            </div>
            <p className="text-[11px] text-secondary">
              For privacy inquiries, data subject access requests, or policy questions:
            </p>
            <p className="text-[11px] font-bold text-primary">
              privacy@qurb.app · support@qurb.app
            </p>
            <p className="text-[10px] text-secondary">
              Official web URL: <a href="https://qurb.app/privacy-policy" target="_blank" rel="noreferrer" className="underline text-on-surface font-semibold">https://qurb.app/privacy-policy</a>
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
          <span>I Understand & Agree</span>
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicyScreen;
