import React from 'react';
import { HeartHandshake, ShieldCheck, EyeOff, ArrowRight } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onLogin?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
  onBackToLanding?: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ 
  onGetStarted, 
  onLogin,
  onOpenPrivacyPolicy,
  onOpenTerms,
  onBackToLanding
}) => {
  return (
    <main className="relative w-full h-full min-h-[600px] flex flex-col justify-between overflow-hidden font-sans select-none text-white">
      {/* 1. Cinematic Halal Couple Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
        style={{ backgroundImage: "url('/halal_couple_bg.jpg')" }}
      />

      {/* 2. Multi-stop Luxury Vignette & Dark Gradient Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(12, 16, 14, 0.55) 0%, rgba(12, 16, 14, 0.15) 30%, rgba(12, 16, 14, 0.72) 65%, rgba(12, 16, 14, 0.96) 100%)'
        }}
      />

      {/* 3. Top Header: Pure Halal Matrimony Badge */}
      <header className={`relative z-10 w-full pt-5 px-6 flex ${onBackToLanding ? 'items-center justify-between' : 'flex-col items-center'}`}>
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="text-[11px] font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow"
          >
            ← Website
          </button>
        )}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-lg text-white text-[11px] font-bold tracking-wider uppercase">
          <HeartHandshake className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>Pure Halal Matrimony</span>
        </div>
        {onBackToLanding && <div className="w-16" />}
      </header>

      {/* 4. Center-Bottom Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end pb-3 px-6 text-center animate-fade-in">
        
        {/* Emblem Container with Subtle Glassmorphism Glow */}
        <div className="mb-2 p-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 shadow-2xl">
          <img
            alt="Qurb Logo"
            className="w-12 h-12 object-contain drop-shadow-md"
            src="/white-icon.svg"
          />
        </div>

        {/* Sacred Bismillah */}
        <div 
          className="text-base sm:text-lg text-white/95 tracking-wider mb-1 drop-shadow"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-lg mb-1">
          Qurb
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-xs sm:text-sm text-white/90 max-w-xs mx-auto leading-relaxed font-medium drop-shadow mb-3">
          Finding your righteous spouse the pure halal way — with Barakah, modesty & family involvement.
        </p>

        {/* 2 Halal Trust Highlights (Frosted Glassmorphism Cards) */}
        <div className="w-full max-w-xs space-y-2 text-left">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">100% Verified Profiles</h4>
              <p className="text-[10px] text-white/75">Serious marriage seekers committed to Sunnah</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-[#FF2560]/25 border border-[#FF2560]/40 text-[#FF4D7D] flex items-center justify-center shrink-0">
              <EyeOff className="w-4 h-4 text-[#FF4D7D]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Modesty Shield Protection</h4>
              <p className="text-[10px] text-white/75">Photo blur until mutual consent</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Call to Action Buttons */}
      <div className="relative z-10 w-full px-6 pb-6 pt-2 space-y-2.5">
        <button
          onClick={onGetStarted}
          className="w-full bg-[#FF2560] hover:bg-[#D8134B] text-white font-sans font-bold text-xs sm:text-sm py-3.5 rounded-full flex items-center justify-center gap-2 shadow-xl shadow-[#FF2560]/30 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          <span>Begin Halal Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center">
          <button
            onClick={onLogin || onGetStarted}
            className="font-sans text-xs text-white/85 hover:text-white font-medium transition-colors py-1 cursor-pointer"
          >
            Already a member? <span className="text-[#FF8DA7] font-bold underline">Sign In</span>
          </button>
        </div>

        <div className="text-center pt-1 text-[10.5px] text-white/60 space-x-1">
          <span>By continuing, you agree to our</span>
          <button
            type="button"
            onClick={onOpenTerms || (() => { window.location.href = '/terms'; })}
            className="underline hover:text-white cursor-pointer inline"
          >
            Terms
          </button>
          <span>&</span>
          <button
            type="button"
            onClick={onOpenPrivacyPolicy || (() => { window.location.href = '/privacy-policy'; })}
            className="underline hover:text-white cursor-pointer inline"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </main>
  );
};

export default WelcomeScreen;
