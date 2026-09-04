import React from 'react';
import { ArrowLeft, Shield, Lock, CheckCircle2 } from 'lucide-react';

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
            Effective: September 4, 2026 · Qurab Halal Matrimony
          </p>
        </div>

        {/* Islamic Covenant Box */}
        <div className="p-4 rounded-2xl bg-pastel-rose border border-pastel-rose-border mb-5 shadow-subtle">
          <div className="flex items-center gap-2 mb-1.5 text-primary">
            <Lock className="w-4 h-4 shrink-0" />
            <span className="font-serif font-bold text-xs">Our Sacred Privacy Promise</span>
          </div>
          <p className="text-xs text-on-surface leading-relaxed">
            At Qurab, we treat your personal biodata and photographs as a sacred trust (Amanah). We do not sell your personal data, nor do we monetize your information with third-party advertisers.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4 text-xs text-secondary leading-relaxed">
          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <h2 className="font-serif font-bold text-sm text-on-surface">1. Information We Collect</h2>
            <p className="text-on-surface">We collect information you provide directly during registration and biodata creation:</p>
            <ul className="list-disc pl-4 space-y-1 text-secondary mt-1">
              <li><strong>Account Info:</strong> Name, verified email address, Google Profile ID, and authentication tokens.</li>
              <li><strong>Matrimonial Biodata:</strong> Age, height, location, education, career, citizenship, family background, and marriage timeline.</li>
              <li><strong>Religious Values:</strong> Practice level, sect, madhhab, prayer routine, and halal dietary commitment.</li>
              <li><strong>Photographs:</strong> Uploaded pictures protected by our optional 1-to-1 Modesty Shield.</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <h2 className="font-serif font-bold text-sm text-on-surface">2. Google User Data Compliance</h2>
            <p className="text-on-surface">
              Qurab's use of information received from Google APIs adheres to the <strong>Google API Services User Data Policy</strong>, including the Limited Use requirements.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-secondary mt-1">
              <li>We request only basic profile info (name, email) for verified account creation.</li>
              <li>Google data is never sold, transferred, or used for advertising.</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <h2 className="font-serif font-bold text-sm text-on-surface">3. Photo Modesty Shield</h2>
            <p className="text-on-surface">
              Members can enable our Modesty Shield. Photos remain blurred on the Discover feed and are only unblurred on a 1-to-1 basis upon mutual consent.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-outline shadow-subtle space-y-1.5">
            <h2 className="font-serif font-bold text-sm text-on-surface">4. Account Deletion & Data Rights</h2>
            <p className="text-on-surface">
              You maintain full control over your data. You may delete your account at any time via Settings, which immediately expunges your profile, photos, and messages from our active databases.
            </p>
          </div>

          <div className="bg-surface-variant p-4 rounded-2xl border border-outline space-y-1">
            <h2 className="font-serif font-bold text-xs text-on-surface">Contact Privacy Support</h2>
            <p className="text-[11px] text-secondary">
              For any data privacy inquiries or requests, contact our team at:
            </p>
            <p className="text-[11px] font-bold text-primary">privacy@qurb.app · support@qurb.app</p>
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
