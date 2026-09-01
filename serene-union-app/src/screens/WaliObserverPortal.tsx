import React, { useState } from 'react';
import { ShieldCheck, MessageCircle, CheckCircle2, ThumbsUp, XCircle } from 'lucide-react';


interface Props {
  onBackToApp?: () => void;
}

export const WaliObserverPortal: React.FC<Props> = ({ onBackToApp }) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showClosureModal, setShowClosureModal] = useState(false);

  return (
    <div className="w-full min-h-screen bg-background text-on-surface font-sans flex flex-col items-center select-none">
      {/* Top Banner */}
      <header className="w-full max-w-xl bg-white border-b border-outline px-5 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-pastel-rose border border-pastel-rose-border flex items-center justify-center p-1.5 shadow-subtle">
            <img src="/icon.svg" alt="Qurab" className="w-5 h-5 object-contain" />
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
      <main className="w-full max-w-xl p-5 space-y-4">
        {/* Guardian Status Card (Pastel Mint) */}
        <div className="bg-pastel-mint border border-pastel-mint-border rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 shadow-subtle">
          <ShieldCheck className="w-7 h-7 text-pastel-mint-text shrink-0 mt-0.5" />
          <div>
            <h2 className="font-serif text-sm font-bold text-pastel-mint-text">Assalamu Alaikum, Tariq Al-Mansoor</h2>
            <p className="text-xs text-on-surface mt-1 leading-relaxed">
              You are registered as the active <strong>Guardian (Wali)</strong> for Aisha Al-Mansoor. All communications with potential suitors are transparently logged here for your review and peace of mind.
            </p>
          </div>
        </div>

        {/* Prospective Suitor Profile Card */}
        <div className="bg-white rounded-3xl p-5 border border-outline shadow-subtle">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-outline">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Prospective Match</span>
            <span className="bg-pastel-rose text-primary border border-pastel-rose-border px-2.5 py-0.5 rounded-full text-[10px] font-bold">Mutual Match</span>
          </div>

          <div className="flex items-center gap-3.5 mb-3.5">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80"
              alt="Tariq Hussain"
              className="w-14 h-14 rounded-full object-cover border-2 border-primary"
            />
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">Tariq Hussain, 30</h3>
              <p className="text-xs text-secondary">Financial Analyst · Columbia University</p>
              <p className="text-xs text-primary font-semibold mt-0.5">New York, USA · Practicing (Sunni / Hanafi)</p>
            </div>
          </div>

          <div className="bg-surface-variant rounded-2xl p-3.5 text-xs text-on-surface leading-relaxed border border-outline">
            <p className="font-semibold text-on-surface mb-0.5">Intent & Deen Relationship:</p>
            "Seeking marriage within 1 year. Regular with 5 daily prayers, active in community volunteering. Striving to build a peaceful household upon the Sunnah."
          </div>
        </div>

        {/* Transparent Conversation Log */}
        <div className="bg-white rounded-3xl p-5 border border-outline shadow-subtle">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-outline">
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Chaperoned Chat Log</span>
            </div>
            <span className="text-[10px] text-secondary">Logged in Real-Time</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto p-1">
            <div className="bg-surface-variant p-3 rounded-2xl border border-outline">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[11px] font-bold text-primary">Aisha Al-Mansoor</span>
                <span className="text-[9px] text-secondary">Yesterday 2:30 PM</span>
              </div>
              <p className="text-xs text-on-surface">Assalamu alaikum, Tariq. It’s nice to connect with you. I read in your profile that you enjoy hiking.</p>
            </div>

            <div className="bg-pastel-rose p-3 rounded-2xl border border-pastel-rose-border">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[11px] font-bold text-on-surface">Tariq Hussain</span>
                <span className="text-[9px] text-secondary">Yesterday 2:34 PM</span>
              </div>
              <p className="text-xs text-on-surface">Wa alaikum assalam, Aisha. Yes, I find peace in nature. It helps me disconnect and reflect.</p>
            </div>

            <div className="bg-surface-variant p-3 rounded-2xl border border-outline">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[11px] font-bold text-primary">Aisha Al-Mansoor</span>
                <span className="text-[9px] text-secondary">Yesterday 2:40 PM</span>
              </div>
              <p className="text-xs text-on-surface">Family is very important to me too. How often do you get to see your family?</p>
            </div>
          </div>
        </div>

        {/* Guardian Action Controls */}
        <div className="bg-white rounded-3xl p-5 border border-outline shadow-subtle text-center">
          <h3 className="font-serif text-sm font-bold text-on-surface mb-0.5">Wali Oversight Actions</h3>
          <p className="text-xs text-secondary mb-4">You may grant your blessing to proceed or request a respectful closure.</p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => setConsentGiven(true)}
              className={`flex-1 py-3 rounded-full font-semibold text-xs shadow-brand transition-all flex items-center justify-center gap-1.5 ${
                consentGiven ? 'bg-pastel-mint text-pastel-mint-text border border-pastel-mint-border' : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {consentGiven ? <CheckCircle2 className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" />}
              <span>{consentGiven ? 'Wali Blessing Recorded' : 'Approve Match & Give Consent'}</span>
            </button>

            <button
              onClick={() => setShowClosureModal(true)}
              className="py-3 px-5 rounded-full border border-outline text-secondary font-semibold text-xs hover:bg-surface-variant transition-colors"
            >
              Request Closure
            </button>
          </div>
        </div>

        {/* Closure Modal */}
        {showClosureModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full rounded-3xl p-6 text-center animate-scale-in border border-outline shadow-2xl">
              <XCircle className="w-10 h-10 text-error mx-auto mb-2" />
              <h3 className="font-serif text-base font-bold text-on-surface mb-1">Request Respectful Closure</h3>
              <p className="text-xs text-secondary mb-5 leading-relaxed">
                A courteous notification will be sent to conclude the communication with dignity and mutual respect.
              </p>
              <button
                onClick={() => setShowClosureModal(false)}
                className="w-full py-2.5 bg-error text-white font-semibold text-xs rounded-full mb-2 hover:brightness-110 transition-all"
              >
                Confirm Closure
              </button>
              <button
                onClick={() => setShowClosureModal(false)}
                className="text-xs text-secondary font-semibold hover:text-on-surface transition-colors"
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
export default WaliObserverPortal;

