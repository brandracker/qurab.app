import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface DirectSalamModalProps {
  candidate: UserProfile;
  passesRemaining: number;
  onClose: () => void;
  onSend: (message: string) => Promise<void> | void;
}

const GREETING_TEMPLATES = [
  "Assalamu Alaikum! I would be honored to get to know your biodata for marriage.",
  "Assalamu Alaikum! Truly inspired by your Deen, career dedication, and family values.",
  "Assalamu Alaikum! Would love to introduce myself and discuss mutual marriage expectations."
];

export const DirectSalamModal: React.FC<DirectSalamModalProps> = ({
  candidate,
  passesRemaining,
  onClose,
  onSend
}) => {
  const [message, setMessage] = useState(GREETING_TEMPLATES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const candidateFirstName = candidate.fullName?.split(' ')[0] || 'Candidate';
  const avatarUrl = candidate.photos?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&q=80';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSend(message.trim() || GREETING_TEMPLATES[0]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="direct-salam-title"
    >
      <div 
        className="relative w-full max-w-md bg-surface border border-emerald-500/20 rounded-3xl p-6 shadow-2xl overflow-hidden animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-secondary hover:text-on-surface p-2 rounded-full hover:bg-surface-variant transition-colors"
          aria-label="Close Direct Salam Modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header with Candidate Spotlight */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={candidate.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/60 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px] shadow">
              ✨
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Direct Salam Pass
              </span>
              <span className="text-[11px] text-secondary">
                {passesRemaining} {passesRemaining === 1 ? 'pass' : 'passes'} left
              </span>
            </div>
            <h2 id="direct-salam-title" className="text-lg font-bold text-on-surface mt-1">
              Send Salam to {candidateFirstName}
            </h2>
            <p className="text-xs text-secondary">
              {candidate.age ? `${candidate.age} yrs · ` : ''}{candidate.profession || 'Practicing Professional'} · {candidate.location}
            </p>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2">
            Quick Islamic Opening Lines
          </label>
          <div className="space-y-1.5">
            {GREETING_TEMPLATES.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMessage(tpl)}
                className={`w-full text-left text-xs p-2.5 rounded-xl border transition-all duration-200 ${
                  message === tpl
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-medium'
                    : 'border-border/60 hover:border-border hover:bg-surface-variant text-on-surface/80'
                }`}
              >
                &ldquo;{tpl}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Custom Message Area */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="salam-message-input" className="text-xs font-semibold text-on-surface">
                Personalized Note
              </label>
              <span className={`text-[11px] ${message.length > 280 ? 'text-amber-400 font-bold' : 'text-secondary'}`}>
                {message.length} / 300
              </span>
            </div>

            <textarea
              id="salam-message-input"
              rows={3}
              maxLength={300}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write a thoughtful, respectful Islamic opening greeting..."
              className="w-full text-xs p-3 rounded-xl bg-surface-variant border border-border focus:border-emerald-500 focus:outline-none text-on-surface placeholder:text-secondary/60 resize-none transition-all"
            />
            
            <p className="text-[10px] text-secondary/80 mt-1 flex items-center gap-1">
              <span>🛡️</span> Wali chaperone transparency active. Keep interactions pure &amp; respectful.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-secondary hover:text-on-surface hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="flex-[2] py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Sending Salam...</span>
                </>
              ) : (
                <>
                  <span>Send Blessed Salam</span>
                  <span>✨</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
