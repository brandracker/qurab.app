import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
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
      'Flexible as schedules permit with unconditional respect for both sides.'
    ]
  },
  {
    id: 12,
    category: 'family' as const,
    pillar: 'Family & In-Laws',
    question: 'What is your perspective on joint vs independent living after marriage?',
    options: [
      'Independent living for privacy and strengthening our marriage.',
      'Open to living with in-laws or nearby to support elderly parents.',
      'Flexible start with a clear plan to transition to independent living.'
    ]
  },
  {
    id: 13,
    category: 'family' as const,
    pillar: 'Family & In-Laws',
    question: 'How should extended family involvement in marriage decisions be handled?',
    options: [
      'Keep marital discussions private between spouses; seek advice only when necessary.',
      'Value parental wisdom and regularly seek their counsel on major decisions.',
      'Set clear and loving boundaries while honoring parents with utmost adab.'
    ]
  },
  {
    id: 14,
    category: 'family' as const,
    pillar: 'Family & In-Laws',
    question: 'What is your vision for children’s Islamic schooling and upbringing?',
    options: [
      'Islamic school / Hifz program integrated into comprehensive education.',
      'Strong home Islamic tarbiyah alongside excellent academic schooling.',
      'Balanced approach with Quran classes and weekend Islamic programs.'
    ]
  },
  {
    id: 15,
    category: 'family' as const,
    pillar: 'Family & In-Laws',
    question: 'How do you navigate dividing holidays (Eid) between both families?',
    options: [
      'Alternate Eids fairly between both families each year.',
      'Celebrate together as one big extended gathering when possible.',
      'Split the days of Eid between both sides lovingly.'
    ]
  },

  // 4. LIFESTYLE & SOCIAL
  {
    id: 16,
    category: 'lifestyle' as const,
    pillar: 'Lifestyle & Social',
    question: 'What is your view on social media usage and sharing family life online?',
    options: [
      'High privacy: avoid posting pictures or private family life online.',
      'Moderate: share milestones with close friends and family only.',
      'Open: active presence while maintaining Islamic modesty.'
    ]
  },
  {
    id: 17,
    category: 'lifestyle' as const,
    pillar: 'Lifestyle & Social',
    question: 'How do you spend your free time and weekends?',
    options: [
      'Home-centered, reading, cooking, and quality time with family.',
      'Active outdoors, fitness, travel, and community events.',
      'Mix of personal hobbies, learning, and quiet downtime.'
    ]
  },
  {
    id: 18,
    category: 'lifestyle' as const,
    pillar: 'Lifestyle & Social',
    question: 'What is your approach to halal entertainment, music, and media?',
    options: [
      'Strict: avoid mainstream music and focus on beneficial audio/podcasts.',
      'Moderate: enjoy wholesome media and mainstream entertainment within limits.',
      'Pragmatic: general balance focusing on positive messages.'
    ]
  },
  {
    id: 19,
    category: 'lifestyle' as const,
    pillar: 'Lifestyle & Social',
    question: 'What is your preference regarding work-life balance and career ambition?',
    options: [
      'High ambition balanced with strict family-first boundaries.',
      'Stable work with primary focus on home, deen, and children.',
      'Entrepreneurial / high-growth path with mutual understanding.'
    ]
  },
  {
    id: 20,
    category: 'lifestyle' as const,
    pillar: 'Lifestyle & Social',
    question: 'What is your ideal holiday destination and travel style?',
    options: [
      'Spiritual journeys (Umrah, Islamic heritage sites) as top priority.',
      'Nature, scenic adventures, and exploring diverse cultures.',
      'Relaxing resort getaways and peaceful retreats.'
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

    localStorage.setItem(`serene_quiz_${userId}`, JSON.stringify(answersList));

    try {
      await fetch(`${API_BASE}/compatibility/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers: answersList })
      });
    } catch {}

    setIsSaving(false);
    onCompleted(answersList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs px-4 font-sans animate-fade-in select-none text-on-surface">
      <div className="w-full max-w-[460px] bg-white rounded-[36px] p-5 sm:p-6 shadow-2xl border border-outline flex flex-col relative overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-outline">
          <button
            onClick={() => {
              if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
              else onClose();
            }}
            className="w-8 h-8 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-on-surface hover:bg-outline transition-colors shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 font-serif text-xs font-bold text-on-surface">
            <span className="text-primary">{currentQ.pillar}</span>
            <span className="text-secondary font-mono text-[11px]">({currentIdx + 1}/{total})</span>
          </div>
          <button onClick={onClose} className="text-xs text-secondary hover:text-on-surface font-bold px-2.5 py-1 rounded-full bg-surface-variant">
            Exit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mb-4">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Question Title */}
        <div className="mb-4 min-h-[58px]">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">
            Question {currentIdx + 1} of {total}
          </span>
          <h2 className="font-serif text-base font-bold text-on-surface leading-snug">
            {currentQ.question}
          </h2>
        </div>

        {/* 3 Options */}
        <div className="space-y-2 mb-4">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = answers[currentQ.id] === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelect(optIdx)}
                className={`w-full p-3 sm:p-3.5 rounded-2xl text-left border transition-all flex items-start gap-2.5 shadow-subtle ${
                  isSelected
                    ? 'border-primary bg-pastel-rose text-on-surface shadow-brand'
                    : 'border-outline bg-white hover:bg-surface-variant text-on-surface'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected ? 'border-primary bg-primary text-white' : 'border-outline bg-white'
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5" />}
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
export default CompatibilityQuizModal;
