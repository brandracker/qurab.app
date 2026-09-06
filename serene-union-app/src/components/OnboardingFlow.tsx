import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Check } from 'lucide-react';
import type { MarriageTimeline, PracticeLevel, Gender } from '../types';

interface Props {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);

  // Form State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [intent, setIntent] = useState<MarriageTimeline>('within_1_year');
  const [fullName, setFullName] = useState('Tariq Hussain');
  const [dob, setDob] = useState('1995-11-05');
  const [gender, setGender] = useState<Gender>('male');
  const [location, setLocation] = useState('New York, USA');
  const [practiceLevel, setPracticeLevel] = useState<PracticeLevel>('practicing');
  const [blurPhotos, setBlurPhotos] = useState(false);
  const [bio, setBio] = useState('Balancing deen and ambition. Seeking a righteous companion to build a peaceful household.');

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="w-full max-w-[480px] min-h-screen bg-white flex flex-col mx-auto relative shadow-2xl overflow-hidden border-x border-outline select-none text-on-surface">
      {/* Top Header */}
      {step > 0 && (
        <header className="sticky top-0 bg-white px-5 h-14 flex items-center justify-between z-20 border-b border-outline shadow-subtle">
          <button
            onClick={() => setStep(prev => prev - 1)}
            className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-on-surface">
            <img src="/icon.svg" alt="Qurb" className="w-4 h-4 object-contain" />
            <span>Qurb</span>
          </div>
          <div className="text-xs font-semibold text-secondary">Step {step} of 5</div>
        </header>
      )}

      {/* Progress Bar */}
      {step > 0 && (
        <div className="w-full h-1 bg-surface-variant">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      )}

      {/* Step 0: Welcome Splash Screen */}
      {step === 0 && (
        <div className="flex-1 flex flex-col justify-between p-8 text-center relative animate-fade-in">
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Logo Badge */}
            <div className="w-22 h-22 rounded-3xl bg-pastel-rose border border-pastel-rose-border flex items-center justify-center shadow-subtle mb-5 p-4 transform hover:scale-105 transition-transform">
              <img src="/icon.svg" alt="Qurb" className="w-14 h-14 object-contain" />
            </div>

            <span className="text-xs uppercase tracking-widest font-semibold text-primary mb-1.5">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </span>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">
                Qurb
              </h1>
            </div>
            <p className="text-secondary text-xs max-w-[280px] leading-relaxed">
              A dignified, faith-centered platform designed for pure halal Muslim matrimony.
            </p>
          </div>

          <div className="space-y-3 w-full">
            <button
              onClick={() => setStep(1)}
              className="w-full py-3.5 bg-primary text-white rounded-full font-bold text-xs shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Begin with Bismillah</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-secondary">
              Halal Matrimony · Modesty Protection · Verified Community
            </p>
          </div>

        </div>
      )}

      {/* Step 1: Phone & OTP Verification */}
      {step === 1 && (
        <main className="flex-1 p-6 flex flex-col justify-between animate-fade-in">
          <div className="space-y-5 pt-3">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-1.5">Verify Your Number</h2>
              <p className="text-xs text-secondary">
                We'll send a 6-digit code to verify your matrimonial profile.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <div className="flex items-center gap-2 bg-white border border-outline rounded-2xl p-3 focus-within:border-primary shadow-subtle">
                <span className="text-xs font-bold text-primary">🇺🇸 +1</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 019-2834"
                  className="flex-1 bg-transparent text-xs focus:outline-none text-on-surface"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-10 h-11 text-center text-base font-bold bg-white border border-outline rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none shadow-subtle"
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-primary text-white rounded-full font-bold text-xs shadow-brand hover:bg-primary-dark active:scale-98 transition-all mt-6"
          >
            Verify & Continue
          </button>
        </main>
      )}

      {/* Step 2: Marriage Intent */}
      {step === 2 && (
        <main className="flex-1 p-6 flex flex-col justify-between animate-fade-in">
          <div className="space-y-4 pt-1">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-1.5">What are you looking for?</h2>
              <p className="text-xs text-secondary">Your intention helps us find meaningful, aligned matches.</p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'within_1_year' as MarriageTimeline,
                  title: 'Marriage within 1 year',
                  desc: 'I am ready to settle down soon in a halal union.'
                },
                {
                  id: 'right_person' as MarriageTimeline,
                  title: 'Marriage when I find the right person',
                  desc: 'I am intentional, taking my time to find true compatibility.'
                },
                {
                  id: 'exploring' as MarriageTimeline,
                  title: 'Just exploring / Open-minded',
                  desc: 'Ready to connect respectfully and see where Allah guides.'
                }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setIntent(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    intent === opt.id
                      ? 'border-primary bg-pastel-rose shadow-subtle'
                      : 'border-outline bg-white hover:bg-surface-variant'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-serif font-semibold text-xs text-on-surface">{opt.title}</span>
                    {intent === opt.id && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-[11px] text-secondary">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full py-3 bg-primary text-white rounded-full font-bold text-xs shadow-brand hover:bg-primary-dark active:scale-98 transition-all mt-6"
          >
            Continue
          </button>
        </main>
      )}

      {/* Step 3: Basic Info */}
      {step === 3 && (
        <main className="flex-1 p-6 flex flex-col justify-between animate-fade-in overflow-y-auto">
          <div className="space-y-3.5 pt-1">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-1.5">Tell us about yourself</h2>
              <p className="text-xs text-secondary">This helps personalize your matrimonial profile.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-2xl text-xs focus:outline-none focus:border-primary shadow-subtle"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-2xl text-xs focus:outline-none focus:border-primary shadow-subtle"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    gender === 'male' ? 'bg-primary text-white shadow-brand' : 'bg-white border border-outline text-secondary'
                  }`}
                >
                  Brother (Male)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    gender === 'female' ? 'bg-primary text-white shadow-brand' : 'bg-white border border-outline text-secondary'
                  }`}
                >
                  Sister (Female)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Current Location / City
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-2xl text-xs focus:outline-none focus:border-primary shadow-subtle"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(4)}
            className="w-full py-3 bg-primary text-white rounded-full font-bold text-xs shadow-brand hover:bg-primary-dark active:scale-98 transition-all mt-6"
          >
            Continue
          </button>
        </main>
      )}

      {/* Step 4: Religious Practice */}
      {step === 4 && (
        <main className="flex-1 p-6 flex flex-col justify-between animate-fade-in">
          <div className="space-y-4 pt-1">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-1.5">How would you describe your practice?</h2>
              <p className="text-xs text-secondary">Helps ensure spiritual harmony and mutual expectations.</p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'practicing' as PracticeLevel, label: 'Practicing', desc: 'Prays regularly, observes halal strictly' },
                { id: 'moderately_practicing' as PracticeLevel, label: 'Moderately Practicing', desc: 'Striving on deen, continuous improvement' },
                { id: 'cultural' as PracticeLevel, label: 'Cultural Muslim', desc: 'Values Islamic heritage & family values' },
                { id: 'revert' as PracticeLevel, label: 'Revert to Islam', desc: 'Embraced Islam, growing steadily in deen' }
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => setPracticeLevel(item.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    practiceLevel === item.id
                      ? 'border-primary bg-pastel-mint shadow-subtle'
                      : 'border-outline bg-white hover:bg-surface-variant'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-serif font-semibold text-xs text-on-surface">{item.label}</span>
                    {practiceLevel === item.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-secondary">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(5)}
            className="w-full py-3 bg-primary text-white rounded-full font-bold text-xs shadow-brand hover:bg-primary-dark active:scale-98 transition-all mt-6"
          >
            Continue
          </button>
        </main>
      )}

      {/* Step 5: Profile Creation & Modesty Blur */}
      {step === 5 && (
        <main className="flex-1 p-6 flex flex-col justify-between animate-fade-in overflow-y-auto">
          <div className="space-y-4 pt-1">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-1.5">Complete Your Profile</h2>
              <p className="text-xs text-secondary">Set up your modesty preferences and bio.</p>
            </div>

            {/* Photo Modesty Blur Toggle */}
            <div className="bg-white border border-outline rounded-2xl p-3.5 flex items-center justify-between shadow-subtle">
              <div className="space-y-0.5">
                <span className="font-serif font-semibold text-xs text-on-surface block">Blur My Photos</span>
                <span className="text-[11px] text-secondary">Visible only upon mutual match or request</span>
              </div>
              <button
                type="button"
                onClick={() => setBlurPhotos(!blurPhotos)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${blurPhotos ? 'bg-primary' : 'bg-surface-variant'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${blurPhotos ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                About Me & Marriage Goals
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your values, passions, and what you seek in a spouse..."
                className="w-full p-3 bg-white border border-outline rounded-2xl text-xs focus:outline-none focus:border-primary resize-none shadow-subtle"
              />
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-3 bg-primary text-white rounded-full font-bold text-xs shadow-brand hover:bg-primary-dark active:scale-98 transition-all mt-6 flex items-center justify-center gap-1.5"
          >
            <span>Explore Matrimonial Matches</span>
            <Check className="w-4 h-4" />
          </button>
        </main>
      )}
    </div>
  );
};
export default OnboardingFlow;

