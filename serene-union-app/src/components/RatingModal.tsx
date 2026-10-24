import React, { useState } from 'react';
import { Star, X, MessageSquareHeart, CheckCircle2, HeartHandshake, ArrowRight } from 'lucide-react';
import { ratingService } from '../services/ratingService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const RatingModal: React.FC<Props> = ({ isOpen, onClose, userId }) => {
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoveredStars, setHoveredStars] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [step, setStep] = useState<'rating' | 'feedback_submitted'>('rating');

  if (!isOpen) return null;

  const handleDismiss = () => {
    ratingService.dismiss(14);
    onClose();
  };

  const handleContinue = async () => {
    if (selectedStars >= 4) {
      ratingService.openPlayStore();
      onClose();
    } else {
      if (feedbackText.trim().length > 0) {
        await ratingService.submitPrivateFeedback(selectedStars, feedbackText.trim(), userId);
      } else {
        ratingService.markAsRated();
      }
      setStep('feedback_submitted');
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const activeStarCount = hoveredStars || selectedStars;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in font-sans select-none text-on-surface">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-outline relative flex flex-col items-center text-center animate-slide-up">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-variant text-secondary hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'feedback_submitted' ? (
          <div className="py-6 flex flex-col items-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-3 shadow-subtle">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-on-surface mb-1">
              JazakAllah Khair!
            </h3>
            <p className="text-xs text-secondary leading-relaxed max-w-[240px]">
              Your sincere feedback has been received and will help improve Qurb for the entire Ummah.
            </p>
          </div>
        ) : (
          <>
            {/* Header Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-pastel-rose text-primary border border-pastel-rose-border flex items-center justify-center mb-3 shadow-subtle">
              {selectedStars >= 4 ? (
                <HeartHandshake className="w-7 h-7 text-primary" />
              ) : (
                <MessageSquareHeart className="w-7 h-7 text-primary" />
              )}
            </div>

            {/* Title & Subtitle */}
            <h2 className="font-serif text-xl font-bold text-on-surface mb-1">
              {selectedStars >= 4 ? 'Enjoying Your Journey on Qurb?' : 'Help Us Improve Qurb'}
            </h2>
            <p className="text-xs text-secondary mb-4 leading-relaxed max-w-[280px]">
              {selectedStars >= 4
                ? 'Your sincere rating helps more intentional Muslims discover halal life partners.'
                : 'We value your experience deeply. Tell us what we can do better.'}
            </p>

            {/* Interactive Stars */}
            <div className="flex items-center gap-1.5 mb-4 py-1" role="radiogroup" aria-label="Rating Stars">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= activeStarCount;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedStars(star)}
                    onMouseEnter={() => setHoveredStars(star)}
                    onMouseLeave={() => setHoveredStars(0)}
                    className="p-1 transition-transform active:scale-125 hover:scale-110 cursor-pointer focus:outline-none"
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]'
                          : 'fill-transparent text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* 1-3 Stars: Internal Feedback Box (Protects Play Store) */}
            {selectedStars < 4 && (
              <div className="w-full mb-3 text-left animate-fade-in">
                <label className="block text-[11px] font-bold text-secondary mb-1">
                  How can we improve your experience? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what felt missing or how we can serve you better..."
                  className="w-full bg-surface-variant/40 border border-outline rounded-2xl p-2.5 text-xs text-on-surface placeholder:text-secondary/60 outline-none focus:bg-white focus:border-primary transition-all resize-none"
                />
              </div>
            )}

            {/* Positive 4-5 Stars Reassurance Pill */}
            {selectedStars >= 4 && (
              <div className="w-full mb-3 py-2 px-3 rounded-xl bg-pastel-rose/40 border border-pastel-rose-border text-[11px] text-primary font-medium flex items-center justify-center gap-1.5 animate-fade-in">
                <span>⭐ Takes only 10 seconds on Google Play</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full space-y-2">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {selectedStars >= 4
                    ? 'Rate on Google Play ⭐'
                    : 'Submit Private Feedback'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-2 text-xs font-semibold text-secondary hover:text-on-surface transition-colors cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default RatingModal;
