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
        {/* Logo Container with subtle glow */}
        <div className="relative group cursor-pointer w-48 h-48 sm:w-56 sm:h-56">
          <div className="absolute inset-0 bg-primary-container rounded-full opacity-10 blur-2xl scale-110 group-hover:scale-125 transition-transform duration-700"></div>
          <div className="absolute inset-2 bg-surface-container-low rounded-full shadow-[0_12px_32px_rgba(26,43,60,0.05)] border border-surface-variant z-10 flex items-center justify-center overflow-hidden transition-all duration-300">
            <img
              alt="Serene Union Logo"
              className="w-full h-full object-cover p-4"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkNUCBmUWhsT7EbneIajWVYwI_WgOdE7sGMdHw3XrsA2ksJOTWyb3gDCPKE60IRtNTfMyNXenGDBCQIgQtD9QTu9VIyJBKo2plv2Ztn1TCfIhEzv9AwasEYacUyBENbACcJuB0H-Hpz_eQR8ViFo8w11SrComXZTCppWo5pbjBUpF-bPA4g9GxNkXZzaFrSfqYEHrSUY3ckB4i9P97PvJKJj7_flXQUYGiCkxj4nK3CIYMAej2FzJoTw"
            />
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-bold text-primary tracking-tight">Serene Union</h1>
          <p className="font-serif text-xl text-secondary italic">Finding your spouse, the halal way.</p>
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
