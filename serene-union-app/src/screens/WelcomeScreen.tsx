import React from 'react';

interface Props {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onGetStarted, onLogin }) => {
  return (
    <main className="w-full max-w-max-width mx-auto min-h-screen flex flex-col justify-between relative px-container-padding pb-8 bg-background text-on-background">
      {/* Progress Indicator */}
      <header className="w-full pt-8 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs font-semibold text-secondary">Step 1 of 8</span>
          <span className="font-sans text-xs font-semibold text-secondary">Welcome</span>
        </div>
        <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
          <div className="bg-tertiary-container h-full rounded-full" style={{ width: '12.5%' }}></div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center space-y-section-gap text-center animate-fade-in my-auto">
        {/* Logo Container with luxury glow */}
        <div className="relative group cursor-pointer w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-125 animate-pulse"></div>
          <div className="w-full h-full bg-surface-container-low rounded-full shadow-2xl border border-surface-variant/50 z-10 flex items-center justify-center p-6 transition-all duration-300 hover:scale-105">
            <img
              alt="Qurab Logo"
              className="w-28 h-28 object-contain"
              src="/icon.svg"
            />
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-on-surface tracking-tight">Qurab</h1>
            <span className="text-primary text-2xl font-bold">قُرب</span>
          </div>
          <p className="font-serif text-base text-secondary italic">Finding your spouse, the pure halal way.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full pb-4">
        <button
          onClick={onGetStarted}
          className="w-full bg-primary-container text-on-primary font-sans font-semibold text-sm py-4 rounded-full flex items-center justify-center space-x-2 hover:brightness-110 transition-all duration-300 active:scale-95 shadow-[0_12px_32px_rgba(26,43,60,0.05)]"
        >
          <span>Get Started</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <div className="mt-4 text-center">
          <button
            onClick={onLogin}
            className="font-sans text-xs text-secondary hover:text-primary transition-colors"
          >
            Already have an account? Log in
          </button>
        </div>
      </div>
    </main>
  );
};
