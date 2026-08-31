import React, { useState } from 'react';
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
    <div className="w-full max-w-[480px] min-h-screen bg-surface flex flex-col mx-auto relative shadow-2xl overflow-hidden border-x border-surface-variant/40">
      {/* Top Header */}
      {step > 0 && (
        <header className="sticky top-0 bg-surface/90 backdrop-blur-md px-6 h-16 flex items-center justify-between z-20 border-b border-surface-variant/30">
          <button
            onClick={() => setStep(prev => prev - 1)}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-primary hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-on-surface">
            <img src="/icon.svg" alt="Qurab" className="w-4 h-4 object-contain" />
            <span>Qurab</span>
            <span className="text-primary text-xs font-semibold">قُرب</span>
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
        <div className="flex-1 flex flex-col justify-between p-8 text-center islamic-pattern relative animate-fade-in">
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Logo Badge */}
            <div className="w-24 h-24 rounded-3xl bg-surface-container-low border border-surface-variant/50 flex items-center justify-center shadow-2xl mb-6 p-4 transform hover:scale-105 transition-transform">
              <img src="/icon.svg" alt="Qurab" className="w-16 h-16 object-contain" />
            </div>

            <span className="text-xs uppercase tracking-widest font-semibold text-tertiary-container mb-2">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </span>
            <div className="flex items-center justify-center gap-2 mb-3">
              <h1 className="font-serif text-4xl font-bold text-on-surface">
                Qurab
              </h1>
              <span className="text-primary text-2xl font-bold">قُرب</span>
            </div>
            <p className="text-secondary text-sm max-w-[280px] leading-relaxed">
              A dignified, faith-centered platform designed for pure halal Muslim matrimony.
            </p>
          </div>

          <div className="space-y-3 w-full">
            <button
              onClick={() => setStep(1)}
              className="w-full py-4 bg-primary text-on-primary rounded-full font-medium text-sm hover:brightness-105 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Begin with Bismillah</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
            <p className="text-xs text-secondary">
              Wali-inclusive · Modesty Protection · Verified Community
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Phone & OTP Verification */}
      {step === 1 && (
        <main className="flex-1 p-6 flex flex-col justify-between animate-fade-in">
          <div className="space-y-6 pt-4">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">Verify Your Number</h2>
              <p className="text-xs text-secondary">
                We'll send a 6-digit code to verify your matrimonial profile.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/50 rounded-xl p-3 focus-within:border-primary">
                <span className="text-sm font-medium text-primary">🇺🇸 +1</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 019-2834"
                  className="flex-1 bg-transparent text-sm focus:outline-none text-on-surface"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 text-center">
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
                    className="w-11 h-12 text-center text-lg font-bold bg-surface-container-low border border-outline-variant/60 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-4 bg-primary text-on-primary rounded-full font-medium text-sm hover:brightness-105 active:scale-98 transition-all shadow-md mt-6"
          >
            Verify & Continue
          </button>
        </main>
      )}

      {/* Step 2: Marriage Intent */}
      {step === 2 && (
        <main className="flex-1 p-6 flex flex-col justify-between animate-fade-in">
          <div className="space-y-6 pt-2">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">What are you looking for?</h2>
              <p className="text-xs text-secondary">Your intention helps us find meaningful, aligned matches.</p>
            </div>

            <div className="space-y-3">
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
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    intent === opt.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-semibold text-sm text-on-surface">{opt.title}</span>
                    {intent === opt.id && (
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full py-4 bg-primary text-on-primary rounded-full font-medium text-sm hover:brightness-105 active:scale-98 transition-all shadow-md mt-6"
          >
            Continue
          </button>
        </main>
      )}

      {/* Step 3: Basic Info */}
      {step === 3 && (
        <main className="flex-1 p-6 flex flex-col justify-between animate-fade-in overflow-y-auto">
          <div className="space-y-4 pt-2">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">Tell us about yourself</h2>
              <p className="text-xs text-secondary">This helps personalize your matrimonial profile.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    gender === 'male' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-secondary'
                  }`}
                >
                  Brother (Male)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    gender === 'female' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-secondary'
                  }`}
                >
                  Sister (Female)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Current Location / City
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(4)}
            className="w-full py-4 bg-primary text-on-primary rounded-full font-medium text-sm hover:brightness-105 active:scale-98 transition-all shadow-md mt-6"
          >
            Continue
          </button>
        </main>
      )}

      {/* Step 4: Religious Practice */}
      {step === 4 && (
        <main className="flex-1 p-6 flex flex-col justify-between animate-fade-in">
          <div className="space-y-6 pt-2">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">How would you describe your practice?</h2>
              <p className="text-xs text-secondary">Helps ensure spiritual harmony and mutual expectations.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'practicing' as PracticeLevel, label: 'Practicing', desc: 'Prays regularly, observes halal strictly' },
                { id: 'moderately_practicing' as PracticeLevel, label: 'Moderately Practicing', desc: 'Striving on deen, continuous improvement' },
                { id: 'cultural' as PracticeLevel, label: 'Cultural Muslim', desc: 'Values Islamic heritage & family values' },
                { id: 'revert' as PracticeLevel, label: 'Revert to Islam', desc: 'Embraced Islam, growing steadily in deen' }
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => setPracticeLevel(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    practiceLevel === item.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-serif font-semibold text-sm text-on-surface">{item.label}</span>
                    {practiceLevel === item.id && (
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    )}
                  </div>
                  <span className="text-xs text-on-surface-variant">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(5)}
            className="w-full py-4 bg-primary text-on-primary rounded-full font-medium text-sm hover:brightness-105 active:scale-98 transition-all shadow-md mt-6"
          >
            Continue
          </button>
        </main>
      )}

      {/* Step 5: Profile Creation & Modesty Blur */}
      {step === 5 && (
        <main className="flex-1 p-6 flex flex-col justify-between animate-fade-in overflow-y-auto">
          <div className="space-y-5 pt-2">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">Complete Your Profile</h2>
              <p className="text-xs text-secondary">Set up your modesty preferences and bio.</p>
            </div>

            {/* Photo Modesty Blur Toggle */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-serif font-semibold text-sm text-on-surface block">Blur My Photos</span>
                <span className="text-xs text-on-surface-variant">Visible only upon mutual match or request</span>
              </div>
              <button
                type="button"
                onClick={() => setBlurPhotos(!blurPhotos)}
                className={`w-12 h-7 rounded-full transition-colors relative ${blurPhotos ? 'bg-primary' : 'bg-surface-variant'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform transform ${blurPhotos ? 'translate-x-6' : 'translate-x-1'} top-1 absolute`} />
              </button>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                About Me & Marriage Goals
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your values, passions, and what you seek in a spouse..."
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-4 bg-primary text-on-primary rounded-full font-medium text-sm hover:brightness-105 active:scale-98 transition-all shadow-lg mt-6 flex items-center justify-center gap-2"
          >
            <span>Explore Matrimonial Matches</span>
            <span className="material-symbols-outlined text-lg">check</span>
          </button>
        </main>
      )}
    </div>
  );
};
