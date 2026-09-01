import React, { useState } from 'react';
import { API_BASE } from '../services/dbService';

export interface QuizAnswer {
  questionId: number;
  category: 'deen' | 'finance' | 'family' | 'lifestyle';
  selectedOption: number;
}

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (answers: QuizAnswer[]) => void;
}

export const COMPATIBILITY_QUESTIONS = [
  // 1. DEEN & SPIRITUALITY
  {
    id: 1,
    category: 'deen' as const,
    pillar: 'Deen & Spirituality',
    question: 'How do you handle interpersonal disagreements from an Islamic viewpoint?',
    options: [
      'Take time to cool down with du’a, then speak calmly and directly.',
      'Seek immediate reconciliation and apologize even if not fully at fault.',
      'Consult trusted Islamic scholars or elders for objective guidance.'
    ]
  },
  {
    id: 2,
    category: 'deen' as const,
    pillar: 'Deen & Spirituality',
    question: 'What is your aspiration for congregational prayer (Salah) at home?',
    options: [
      'Pray together as a family whenever we are home together.',
      'Encourage each other lovingly without strict policing.',
      'Personal responsibility, each person maintains their individual routine.'
    ]
  },
  {
    id: 3,
    category: 'deen' as const,
    pillar: 'Deen & Spirituality',
    question: 'How do you balance cultural traditions with authentic Sunnah practices?',
    options: [
      'Sunnah and Quran always take precedence over cultural expectations.',
      'Embrace culture as long as it doesn’t directly contradict Islamic principles.',
      'Value cultural heritage as a vital part of family identity.'
    ]
  },
  {
    id: 4,
    category: 'deen' as const,
    pillar: 'Deen & Spirituality',
    question: 'What role does ongoing Islamic learning play in your weekly routine?',
    options: [
      'Regularly attend halaqas, lectures, or study with a teacher.',
      'Listen to podcasts and read books independently.',
      'Focus primarily on fulfilling obligatory pillars.'
    ]
  },
  {
    id: 5,
    category: 'deen' as const,
    pillar: 'Deen & Spirituality',
    question: 'How do you practice charity (Sadaqah) and community service?',
    options: [
      'Set aside a fixed monthly percentage of income for regular Sadaqah.',
      'Give spontaneous charity whenever a righteous cause arises.',
      'Focus on fulfilling annual Zakat obligations.'
    ]
  },

  // 2. FINANCES & MAHR
  {
    id: 6,
    category: 'finance' as const,
    pillar: 'Household Finances',
    question: 'How should household expenses and savings be managed?',
    options: [
      'Husband provides fully for essentials; wife’s income is solely hers unless gifted.',
      'Joint collaborative budgeting where both contribute to shared goals.',
      'Open discussion and flexible division based on current financial standing.'
    ]
  },
  {
    id: 7,
    category: 'finance' as const,
    pillar: 'Household Finances',
    question: 'What is your approach to debt, interest (Riba), and investments?',
    options: [
      'Strict zero-Riba policy; only 100% Shariah-compliant funds and cash buying.',
      'Avoid major interest, striving to minimize any non-halal exposure.',
      'Standard pragmatic financial planning within halal limits.'
    ]
  },
  {
    id: 8,
    category: 'finance' as const,
    pillar: 'Household Finances',
    question: 'What is your philosophy on the wedding ceremony and celebration budget?',
    options: [
      'Simple, modest Sunnah Walima without extravagant spending.',
      'Moderate family celebration balancing tradition and savings.',
      'Large memorable celebration shared with extended community.'
    ]
  },
  {
    id: 9,
    category: 'finance' as const,
    pillar: 'Household Finances',
    question: 'How should major financial decisions (e.g. buying a house) be made?',
    options: [
      'Mutual consensus after detailed discussion and Istikhara.',
      'Husband takes ultimate responsibility after consulting his wife.',
      'Consult financial experts alongside mutual agreement.'
    ]
  },
  {
    id: 10,
    category: 'finance' as const,
    pillar: 'Household Finances',
    question: 'How do you prioritize long-term savings vs enjoying life today?',
    options: [
      'Aggressive savings for Hajj, property, and children’s future.',
      'Balanced lifestyle with moderate savings and regular halal travel.',
      'Live comfortably within means without over-stressing the distant future.'
    ]
  },

  // 3. FAMILY & IN-LAWS
  {
    id: 11,
    category: 'family' as const,
    pillar: 'Family & In-Laws',
    question: 'How often do you expect to visit each other’s parents and extended family?',
    options: [
      'Weekly or multiple times a week as a top priority.',
      'Bi-weekly or monthly, balancing our independent nuclear family routine.',
      'Flexible based on work schedules and distance.'
    ]
  },
  {
    id: 12,
    category: 'family' as const,
    pillar: 'Family & In-Laws',
    question: 'How should in-laws’ advice and boundaries be navigated in marital decisions?',
    options: [
      'Marital affairs stay strictly private between husband and wife with utmost adab to parents.',
      'Seek elders’ blessings and input on major life transitions.',
      'Handle on a case-by-case basis depending on the sensitivity.'
    ]
  },
  {
    id: 13,
    category: 'family' as const,
    pillar: 'Family & In-Laws',
    question: 'What is your approach to caring for elderly parents in the future?',
    options: [
      'Welcome parents to live with us and care for them directly with love.',
      'Ensure they have premium housing nearby with frequent daily visits.',
      'Cooperate with siblings to share the blessing of their care.'
    ]
  },
  {
    id: 14,
    category: 'family' as const,
    pillar: 'Family & In-Laws',
    question: 'How do you handle family gatherings and Eid holidays?',
    options: [
      'Alternate Eids and holidays equally between both families.',
      'Celebrate with the larger extended joint family together.',
      'Flexible planning based on travel and convenience.'
    ]
  },
  {
    id: 15,
    category: 'family' as const,
    pillar: 'Family & In-Laws',
    question: 'What is your view on privacy within the home from visiting relatives?',
    options: [
      'Essential private sanctuary with scheduled advance notice for guests.',
      'Warm open-door hospitality for close family at all times.',
      'Balanced hospitality that respects private rest hours.'
    ]
  },

  // 4. LIFESTYLE, LEISURE & PARENTING
  {
    id: 16,
    category: 'lifestyle' as const,
    pillar: 'Lifestyle & Parenting',
    question: 'What does your ideal weekend look like?',
    options: [
      'Islamic classes, peaceful home time, and quality Quran reading.',
      'Outdoor nature hikes, fitness, and family dinners.',
      'Hosting friends and community volunteering.'
    ]
  },
  {
    id: 17,
    category: 'lifestyle' as const,
    pillar: 'Lifestyle & Parenting',
    question: 'What is your aspiration for raising children in modern society?',
    options: [
      'Islamic schooling or homeschooling with strong Tarbiyah foundation.',
      'Standard high-ranking schooling supplemented with intensive home deen classes.',
      'Focus on strong character and critical thinking within an Islamic framework.'
    ]
  },
  {
    id: 18,
    category: 'lifestyle' as const,
    pillar: 'Lifestyle & Parenting',
    question: 'How do you view social media usage and public sharing of personal life?',
    options: [
      'High privacy; zero or minimal public sharing of family pictures (protecting from Nazar).',
      'Moderate and modest sharing with close friends and family only.',
      'Normal everyday social media usage within halal boundaries.'
    ]
  },
  {
    id: 19,
    category: 'lifestyle' as const,
    pillar: 'Lifestyle & Parenting',
    question: 'How do you balance career ambitions with home life and marital quality time?',
    options: [
      'Strict boundaries on work hours so family time is never compromised.',
      'Hard work during work hours, but evenings dedicated completely to spouse.',
      'Support each other’s ambitious goals with flexible home routines.'
    ]
  },
  {
    id: 20,
    category: 'lifestyle' as const,
    pillar: 'Lifestyle & Parenting',
    question: 'What is your dream vacation / travel goal with your spouse?',
    options: [
      'Umrah and visiting Islamic historical landmarks (Medina, Al-Quds, Istanbul).',
      'Scenic nature retreats and quiet relaxation in peaceful landscapes.',
      'Exciting cultural exploration and worldwide travel.'
    ]
  }
];

export const CompatibilityQuizModal: React.FC<Props> = ({ userId, isOpen, onClose, onCompleted }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = COMPATIBILITY_QUESTIONS[currentIdx];
  const total = COMPATIBILITY_QUESTIONS.length;
  const progress = Math.round(((currentIdx + 1) / total) * 100);

  const handleSelect = (optIdx: number) => {
    const updated = { ...answers, [currentQ.id]: optIdx };
    setAnswers(updated);

    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Finished all 20 questions
      finishQuiz(updated);
    }
  };

  const finishQuiz = async (finalAnswers: Record<number, number>) => {
    setIsSaving(true);
    const answersList: QuizAnswer[] = COMPATIBILITY_QUESTIONS.map(q => ({
      questionId: q.id,
      category: q.category,
      selectedOption: finalAnswers[q.id] ?? 0
    }));

    // Save locally
    localStorage.setItem(`serene_quiz_${userId}`, JSON.stringify(answersList));

    // Save to Cloudflare D1
    try {
      await fetch(`${API_BASE}/compatibility/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          answers: answersList
        })
      });
    } catch {}

    setIsSaving(false);
    onCompleted(answersList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 font-sans animate-fade-in select-none">
      <div className="w-full max-w-[460px] bg-surface rounded-[36px] p-6 shadow-2xl border border-surface-variant/80 flex flex-col relative overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-variant/40">
          <button
            onClick={() => {
              if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
              else onClose();
            }}
            className="w-9 h-9 rounded-full bg-surface border border-surface-variant/80 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-1.5 font-serif text-xs font-bold text-on-surface">
            <span className="text-primary">{currentQ.pillar}</span>
            <span className="text-secondary font-mono text-[11px]">({currentIdx + 1}/{total})</span>
          </div>
          <button onClick={onClose} className="text-xs text-secondary hover:text-on-surface font-bold px-2.5 py-1 rounded-full bg-surface-variant/60">
            Exit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mb-5">
          <div className="bg-gradient-to-r from-primary to-primary-light h-full transition-all duration-300 shadow-emerald" style={{ width: `${progress}%` }} />
        </div>

        {/* Question Title */}
        <div className="mb-5 min-h-[64px]">
          <span className="text-[10px] font-bold text-accent-gold-dark uppercase tracking-widest block mb-1">
            Question {currentIdx + 1} of {total}
          </span>
          <h2 className="font-serif text-base sm:text-lg font-bold text-on-surface leading-snug">
            {currentQ.question}
          </h2>
        </div>

        {/* 3 Options */}
        <div className="space-y-2.5 mb-5">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = answers[currentQ.id] === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelect(optIdx)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl text-left border transition-all flex items-start gap-3 shadow-2xs ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-on-surface shadow-emerald ring-1 ring-primary'
                    : 'border-surface-variant/80 bg-surface hover:bg-surface-variant/40 text-on-surface-variant'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected ? 'border-primary bg-primary text-white' : 'border-surface-variant bg-surface'
                }`}>
                  {isSelected && <span className="material-symbols-outlined text-[13px]">check</span>}
                </div>
                <p className="text-xs leading-relaxed font-medium">{opt}</p>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-secondary text-center">
          {isSaving ? 'Saving to Cloudflare D1...' : 'Your answers calculate authentic values alignment with matches.'}
        </p>
      </div>
    </div>
  );
};

