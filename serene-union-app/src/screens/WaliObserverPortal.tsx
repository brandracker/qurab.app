import React, { useState } from 'react';

interface Props {
  onBackToApp?: () => void;
}

export const WaliObserverPortal: React.FC<Props> = ({ onBackToApp }) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showClosureModal, setShowClosureModal] = useState(false);

  return (
    <div className="w-full min-h-screen bg-background text-on-background font-sans flex flex-col items-center">
      {/* Top Banner */}
      <header className="w-full max-w-xl bg-surface border-b border-surface-variant/40 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-surface-container-low border border-surface-variant/40 flex items-center justify-center p-2 shadow-sm">
            <img src="/icon.svg" alt="Qurab" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-serif text-base font-bold text-on-surface">
              <span>Qurab</span>
              <span className="text-primary text-xs font-semibold">قُرب</span>
            </div>
            <p className="text-[10px] text-secondary font-medium uppercase tracking-wider">Official Wali Chaperone Portal</p>
          </div>
        </div>
        {onBackToApp && (
          <button onClick={onBackToApp} className="text-xs text-primary font-semibold hover:underline">
            Back to App
          </button>
        )}
      </header>

      {/* Main Chaperone Container */}
      <main className="w-full max-w-xl p-6 space-y-6">
        {/* Guardian Status Card */}
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-5 flex items-start gap-4">
          <span className="material-symbols-outlined text-3xl text-primary flex-shrink-0 mt-0.5">shield_person</span>
          <div>
            <h2 className="font-serif text-base font-bold text-primary">Assalamu Alaikum, Tariq Al-Mansoor</h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              You are registered as the active <strong>Guardian (Wali)</strong> for Aisha Al-Mansoor. All communications with potential suitors are transparently logged here for your review and peace of mind.
            </p>
          </div>
        </div>

        {/* Prospective Suitor Profile Card */}
        <div className="bg-surface rounded-3xl p-6 border border-surface-container-highest shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-variant/30">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Prospective Match</span>
            <span className="bg-tertiary-container/20 text-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold">Mutual Match</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80"
              alt="Tariq Hussain"
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            />
            <div>
              <h3 className="font-serif text-xl font-bold text-on-surface">Tariq Hussain, 30</h3>
              <p className="text-xs text-secondary">Financial Analyst · Columbia University</p>
              <p className="text-xs text-primary font-semibold mt-0.5">New York, USA · Practicing (Sunni / Hanafi)</p>
            </div>
          </div>

          <div className="bg-surface-container-high rounded-2xl p-4 text-xs text-on-surface-variant leading-relaxed">
            <p className="font-semibold text-on-surface mb-1">Intent & Deen Relationship:</p>
            "Seeking marriage within 1 year. Regular with 5 daily prayers, active in community volunteering. Striving to build a peaceful household upon the Sunnah."
          </div>
        </div>

        {/* Transparent Conversation Log */}
        <div className="bg-surface rounded-3xl p-6 border border-surface-container-highest shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">chat</span>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Chaperoned Chat Log</span>
            </div>
            <span className="text-[10px] text-secondary">Logged in Real-Time (JSONL)</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto p-2">
            <div className="bg-surface-container-low p-3.5 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-primary">Aisha Al-Mansoor</span>
                <span className="text-[9px] text-secondary">Yesterday 2:30 PM</span>
              </div>
              <p className="text-xs text-on-surface">Assalamu alaikum, Tariq. It’s nice to connect with you. I read in your profile that you enjoy hiking.</p>
            </div>

            <div className="bg-primary/10 p-3.5 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-on-surface">Tariq Hussain</span>
                <span className="text-[9px] text-secondary">Yesterday 2:34 PM</span>
              </div>
              <p className="text-xs text-on-surface">Wa alaikum assalam, Aisha. Yes, I find peace in nature. It helps me disconnect and reflect.</p>
            </div>

            <div className="bg-surface-container-low p-3.5 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-primary">Aisha Al-Mansoor</span>
                <span className="text-[9px] text-secondary">Yesterday 2:40 PM</span>
              </div>
              <p className="text-xs text-on-surface">Family is very important to me too. How often do you get to see your family?</p>
            </div>
          </div>
        </div>

        {/* Guardian Action Controls */}
        <div className="bg-surface rounded-3xl p-6 border border-surface-container-highest shadow-sm text-center">
          <h3 className="font-serif text-base font-bold text-on-surface mb-1">Wali Oversight Actions</h3>
          <p className="text-xs text-secondary mb-5">You may grant your blessing to proceed or request a respectful closure.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setConsentGiven(true)}
              className={`flex-1 py-3.5 rounded-full font-semibold text-xs shadow transition-all flex items-center justify-center gap-2 ${
                consentGiven ? 'bg-primary text-on-primary' : 'bg-primary text-on-primary hover:brightness-110'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{consentGiven ? 'check_circle' : 'thumb_up'}</span>
              <span>{consentGiven ? 'Wali Blessing Recorded' : 'Approve Match & Give Consent'}</span>
            </button>

            <button
              onClick={() => setShowClosureModal(true)}
              className="py-3.5 px-6 rounded-full border border-secondary text-secondary font-semibold text-xs hover:bg-surface-variant transition-colors"
            >
              Request Closure
            </button>
          </div>
        </div>

        {/* Closure Modal */}
        {showClosureModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-surface max-w-sm w-full rounded-3xl p-6 text-center animate-scale-in">
              <span className="material-symbols-outlined text-4xl text-error mb-2">cancel</span>
              <h3 className="font-serif text-lg font-bold text-on-surface mb-2">Request Respectful Closure</h3>
              <p className="text-xs text-secondary mb-6 leading-relaxed">
                A courteous notification will be sent to conclude the communication with dignity and mutual respect.
              </p>
              <button
                onClick={() => setShowClosureModal(false)}
                className="w-full py-3 bg-error text-white font-semibold text-xs rounded-full mb-2"
              >
                Confirm Closure
              </button>
              <button
                onClick={() => setShowClosureModal(false)}
                className="text-xs text-secondary font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
