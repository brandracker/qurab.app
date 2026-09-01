import React from 'react';

interface Props {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onGetStarted, onLogin }) => {
  return (
    <main className="w-full h-full flex flex-col justify-between relative px-6 py-6 bg-background text-on-background overflow-y-auto font-sans select-none">
      
      {/* Top Gold Foil Platform Badge */}
      <header className="w-full pt-3 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent-gold-light/80 border border-accent-gold/40 text-accent-gold-dark text-[11px] font-bold tracking-wider uppercase shadow-2xs">
          <span className="material-symbols-outlined text-[13px] text-accent-gold-dark fill">auto_awesome</span>
          <span>Pure Halal Matrimony</span>
        </div>
      </header>

      {/* Center Hero: Glowing Logo Halo & Typography */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-4 space-y-5 animate-fade-in">
        
        {/* Glowing Logo Container */}
        <div className="relative group flex items-center justify-center">
          {/* Animated Ambient Light Rings */}
          <div className="absolute inset-0 bg-primary/25 rounded-full blur-2xl scale-125 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute inset-0 bg-accent-gold/20 rounded-full blur-xl scale-110" />
          
          {/* Emblem Disk */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-[32px] bg-gradient-to-br from-surface to-surface-variant p-6 shadow-[0_15px_35px_rgba(13,92,58,0.18)] border border-white/80 z-10 flex items-center justify-center transition-transform duration-500 hover:scale-105">
            <img
              alt="Qurab Logo"
              className="w-full h-full object-contain filter drop-shadow-md"
              src="/icon.svg"
            />
          </div>
        </div>

        {/* Title & Arabic Calligraphy */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-on-surface tracking-tight">
              Qurab
            </h1>
            <span className="font-arabic text-primary text-3xl font-bold">
              قُرب
            </span>
          </div>
          <p className="font-serif text-sm sm:text-base text-secondary italic max-w-xs mx-auto leading-relaxed">
            Finding your spouse, the pure halal way — with Barakah and dignity.
          </p>
        </div>

        {/* 3 Halal Trust Highlights */}
        <div className="w-full max-w-xs space-y-2 pt-2 text-left">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface border border-surface-variant/60 shadow-card">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">100% Wali & Chaperone Friendly</h4>
              <p className="text-[10px] text-secondary">Transparent family involvement built-in</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface border border-surface-variant/60 shadow-card">
            <div className="w-8 h-8 rounded-xl bg-accent-gold/15 text-accent-gold-dark flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">shield</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">Modesty Shield Protection</h4>
              <p className="text-[10px] text-secondary">Optional photo blur until mutual consent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Buttons */}
      <div className="w-full pb-2 space-y-3">
        <button
          onClick={onGetStarted}
          className="w-full bg-gradient-to-r from-primary via-primary to-primary-light text-white font-sans font-bold text-sm py-4 rounded-full flex items-center justify-center gap-2 shadow-emerald hover:brightness-110 active:scale-98 transition-all duration-300 relative overflow-hidden group"
        >
          <span className="gold-shimmer absolute inset-0 opacity-40 pointer-events-none" />
          <span>Begin Halal Journey</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

        <div className="text-center">
          <button
            onClick={onLogin}
            className="font-sans text-xs text-secondary hover:text-primary font-semibold transition-colors py-1"
          >
            Already a member? <span className="text-primary font-bold underline">Sign In</span>
          </button>
        </div>
      </div>
    </main>
  );
};
export default WelcomeScreen;

