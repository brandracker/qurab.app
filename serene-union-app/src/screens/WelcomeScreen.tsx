import React from 'react';
import { Sparkles, ShieldCheck, EyeOff, ArrowRight } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onLogin?: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onGetStarted, onLogin }) => {
  return (
    <main className="w-full h-full flex flex-col justify-between px-6 py-6 bg-white text-on-surface overflow-y-auto font-sans select-none">
      
      {/* Top Header Badge */}
      <header className="w-full pt-2 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-rose border border-pastel-rose-border text-primary text-[11px] font-bold tracking-wide uppercase">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Pure Halal Matrimony</span>
        </div>
      </header>

      {/* Center Hero: Official Logo & Clean Typography */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-3 space-y-5 animate-fade-in">
        
        {/* Logo Container */}
        <div className="flex items-center justify-center p-3">
          <img
            alt="Qurab Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
            src="/icon.svg"
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            Qurab
          </h1>
          <p className="font-sans text-xs sm:text-sm text-secondary max-w-xs mx-auto leading-relaxed">
            Finding your righteous spouse the pure halal way — with Barakah, respect & family involvement.
          </p>
        </div>


        {/* 2 Halal Trust Highlights (Pastel Colors, Lucide Icons) */}
        <div className="w-full max-w-xs space-y-2 pt-2 text-left">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-pastel-mint border border-pastel-mint-border shadow-subtle">
            <div className="w-8 h-8 rounded-xl bg-white text-pastel-mint-text flex items-center justify-center shrink-0 shadow-subtle">
              <ShieldCheck className="w-4 h-4 text-pastel-mint-text" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">100% Verified Islamic Profiles</h4>
              <p className="text-[10px] text-secondary">Serious marriage seekers committed to Sunnah</p>
            </div>

          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-pastel-rose border border-pastel-rose-border shadow-subtle">
            <div className="w-8 h-8 rounded-xl bg-white text-primary flex items-center justify-center shrink-0 shadow-subtle">
              <EyeOff className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">Modesty Shield Protection</h4>
              <p className="text-[10px] text-secondary">Optional photo blur until mutual consent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Buttons (Clean Solid #FF2560, Zero Gradients) */}
      <div className="w-full pb-2 space-y-3">
        <button
          onClick={onGetStarted}
          className="w-full bg-primary text-white font-sans font-bold text-xs sm:text-sm py-4 rounded-full flex items-center justify-center gap-2 shadow-brand hover:bg-primary-dark active:scale-98 transition-all duration-150"
        >
          <span>Begin Halal Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center">
          <button
            onClick={onLogin || onGetStarted}
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


