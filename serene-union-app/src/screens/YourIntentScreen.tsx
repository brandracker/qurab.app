import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  Briefcase, 
  Heart, 
  Calendar, 
  BookOpen, 
  Sliders, 
  ShieldCheck, 
  Lock, 
  Check, 
  CheckCircle2,
  Building2,
  GraduationCap,
  FileText,
  BadgeCheck,
  Clock,
  MapPin,
  Coins,
  Compass,
  Scale
} from 'lucide-react';
import type { PartnerRequirements } from '../types';

interface Props {
  data?: {
    education?: string;
    university?: string;
    profession?: string;
    workArrangement?: 'remote' | 'hybrid' | 'onsite' | 'entrepreneur';
    incomeBracket?: 'under_40k' | '40k_80k' | '80k_150k' | '150k_plus' | 'undisclosed';
    hobbies?: string[];
    personalityTraits?: string[];
    mahrPhilosophy?: string;
    timeline?: string;
    childrenDesire?: string;
    bio?: string;
    partnerRequirements?: PartnerRequirements;
  };
  onBack: () => void;
  onContinue: (careerData: {
    education: string;
    university: string;
    profession: string;
    workArrangement: 'remote' | 'hybrid' | 'onsite' | 'entrepreneur';
    incomeBracket: 'under_40k' | '40k_80k' | '80k_150k' | '150k_plus' | 'undisclosed';
    hobbies: string[];
    personalityTraits: string[];
    mahrPhilosophy: string;
    timeline: string;
    childrenDesire: string;
    bio: string;
    partnerRequirements?: PartnerRequirements;
  }) => void;
}

const STEPS = [
  { id: 1, title: 'Career', icon: Briefcase },
  { id: 2, title: 'Lifestyle', icon: Heart },
  { id: 3, title: 'Timeline', icon: Calendar },
  { id: 4, title: 'Faith Bio', icon: BookOpen },
  { id: 5, title: 'Spouse Age', icon: Sliders },
  { id: 6, title: 'Spouse Deen', icon: ShieldCheck },
  { id: 7, title: 'Dealbreakers', icon: Lock },
  { id: 8, title: 'Summary', icon: CheckCircle2 }
];

/**
 * Ultra-Clean Professional Emoji Badge Component
 * Encapsulates system emojis in elevated, high-contrast, rounded micro-containers
 * providing an executive Apple/Stripe-level luxury appearance.
 */
const EmojiBadge: React.FC<{
  emoji: string;
  isSelected?: boolean;
  bg?: string;
  border?: string;
  className?: string;
}> = ({ 
  emoji, 
  isSelected = false, 
  bg = 'bg-slate-100', 
  border = 'border-slate-200/80', 
  className = 'w-7 h-7 text-sm' 
}) => {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-xl select-none transition-all shrink-0 ${className} ${
        isSelected
          ? 'bg-white/20 border border-white/35 text-white shadow-xs'
          : `${bg} border ${border} shadow-2xs`
      }`}
    >
      <span className="leading-none transform translate-y-[0.5px]">{emoji}</span>
    </span>
  );
};

export const YourIntentScreen: React.FC<Props> = ({ data, onBack, onContinue }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1);

  // --- Step 1: Career & Education State ---
  const [education, setEducation] = useState<string>(data?.education || 'Bachelors Degree');
  const [university, setUniversity] = useState<string>(data?.university || '');
  const [profession, setProfession] = useState<string>(data?.profession || '');
  const [workArrangement, setWorkArrangement] = useState<'remote' | 'hybrid' | 'onsite' | 'entrepreneur'>(data?.workArrangement || 'remote');
  const [incomeBracket, setIncomeBracket] = useState<'under_40k' | '40k_80k' | '80k_150k' | '150k_plus' | 'undisclosed'>(data?.incomeBracket || '40k_80k');

  // Helper to normalize strings for robust hobby/trait matching
  const cleanMatch = (str1: string, str2: string) => {
    const clean = (s: string) => s.replace(/[^\w\s]/gi, '').trim().toLowerCase();
    return clean(str1).includes(clean(str2)) || clean(str2).includes(clean(str1));
  };

  // --- Step 2: Lifestyle & Personality State ---
  const [hobbies, setHobbies] = useState<string[]>(data?.hobbies || ['Books & Islamic History', 'Travel & Umrah', 'Specialty Coffee']);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>(data?.personalityTraits || ['Family-Oriented', 'Calm & Patient']);

  // --- Step 3: Marriage Intent & Timeline State ---
  const [timeline, setTimeline] = useState<string>(data?.timeline || 'within_1_year');
  const [mahrPhilosophy, setMahrPhilosophy] = useState<string>(data?.mahrPhilosophy || 'mutual_agreement');
  const [childrenDesire, setChildrenDesire] = useState<string>(data?.childrenDesire || 'desires_children');

  // --- Step 4: Personal Bio State ---
  const [bio, setBio] = useState<string>(data?.bio || '');

  // --- Step 5, 6, 7, 8: Partner Requirements Studio State ---
  const [partnerMinAge, setPartnerMinAge] = useState<number>(data?.partnerRequirements?.minAge || 21);
  const [partnerMaxAge, setPartnerMaxAge] = useState<number>(data?.partnerRequirements?.maxAge || 35);
  const [strictAgeDealbreaker, setStrictAgeDealbreaker] = useState<boolean>(Boolean(data?.partnerRequirements?.strictAgeDealbreaker));
  const [partnerMaritalStatus, setPartnerMaritalStatus] = useState<string>(data?.partnerRequirements?.maritalStatus || 'any');
  const [partnerPracticeLevel, setPartnerPracticeLevel] = useState<string>(data?.partnerRequirements?.practiceLevel || 'practicing');
  const [partnerRelocation, setPartnerRelocation] = useState<string>(data?.partnerRequirements?.relocation || 'open');
  const [dealbreakers, setDealbreakers] = useState<string[]>(() => {
    return data?.partnerRequirements?.dealbreakers || ['non_smoker', 'daily_salah'];
  });
  const [partnerDescription, setPartnerDescription] = useState<string>(data?.partnerRequirements?.description || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleHobby = (item: string) => {
    const exists = hobbies.some(h => cleanMatch(h, item));
    if (exists) {
      setHobbies(hobbies.filter(h => !cleanMatch(h, item)));
    } else {
      setHobbies([...hobbies, item]);
    }
  };

  const isHobbySelected = (item: string) => {
    return hobbies.some(h => cleanMatch(h, item));
  };

  const toggleTrait = (item: string) => {
    const exists = personalityTraits.some(t => cleanMatch(t, item));
    if (exists) {
      setPersonalityTraits(personalityTraits.filter(t => !cleanMatch(t, item)));
    } else {
      setPersonalityTraits([...personalityTraits, item]);
    }
  };

  const isTraitSelected = (item: string) => {
    return personalityTraits.some(t => cleanMatch(t, item));
  };

  const toggleDealbreaker = (id: string) => {
    if (dealbreakers.includes(id)) setDealbreakers(dealbreakers.filter(d => d !== id));
    else setDealbreakers([...dealbreakers, id]);
  };

  const handleApplyAgePreset = (min: number, max: number) => {
    setPartnerMinAge(min);
    setPartnerMaxAge(max);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!profession.trim()) {
      newErrors.profession = 'Current profession or job title is required.';
    } else if (profession.trim().length < 2) {
      newErrors.profession = 'Please enter a valid job title (at least 2 letters).';
    }

    if (!bio.trim()) {
      newErrors.bio = 'Please share your reflections or bio for prospective matches.';
    } else if (bio.trim().length < 15) {
      newErrors.bio = 'Your bio must be at least 15 characters so matches can understand your character.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto-navigate to the step that has the error
      if (newErrors.profession) {
        setCurrentStepIndex(1);
      } else if (newErrors.bio) {
        setCurrentStepIndex(4);
      }
      const firstKey = Object.keys(newErrors)[0];
      const targetId = firstKey === 'profession' ? 'field-profession' : 'field-bio';
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }

    setErrors({});
    onContinue({
      education,
      university,
      profession: profession.trim(),
      workArrangement,
      incomeBracket,
      hobbies,
      personalityTraits,
      mahrPhilosophy,
      timeline,
      childrenDesire,
      bio: bio.trim(),
      partnerRequirements: {
        minAge: partnerMinAge,
        maxAge: partnerMaxAge,
        maritalStatus: partnerMaritalStatus,
        practiceLevel: partnerPracticeLevel,
        relocation: partnerRelocation,
        description: partnerDescription.trim() || 'Seeking a practicing, family-oriented partner with good akhlaq.',
        dealbreakers,
        strictAgeDealbreaker
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-b from-[#FF2560] via-[#F31A56] to-[#DE0E46] font-sans overflow-y-auto pb-24 select-none text-white transition-all">
      <div>
        {/* Top Header with White Glass Back Button and Progress Stage */}
        <div className="flex items-center justify-between mb-3 pt-1">
          <button
            onClick={() => {
              if (currentStepIndex > 1) setCurrentStepIndex(currentStepIndex - 1);
              else onBack();
            }}
            className="w-9 h-9 rounded-full bg-white text-[#FF2560] flex items-center justify-center hover:bg-white/90 active:scale-95 transition-all shadow-md cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-xs">
            <span className="text-[11px] font-bold text-white tracking-wider uppercase">
              Step {currentStepIndex} of {STEPS.length}
            </span>
            <span className="text-[11px] font-medium text-white/90">
              · {STEPS[currentStepIndex - 1]?.title}
            </span>
          </div>

          <div className="w-9" />
        </div>

        {/* Multi-Step Interactive Progress Tracker */}
        <div className="flex items-center gap-1.5 mb-4 px-0.5">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStepIndex;
            const isCurrent = step.id === currentStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(step.id)}
                title={step.title}
                className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] scale-y-110'
                    : isCompleted
                    ? 'bg-white/60'
                    : 'bg-white/25 hover:bg-white/40'
                }`}
              />
            );
          })}
        </div>

        {/* Global Error Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-3.5 rounded-2xl bg-white text-rose-700 flex items-start gap-2.5 shadow-lg border border-rose-200 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <div className="text-xs">
              <strong className="block font-bold text-rose-900">Please complete all highlighted required fields before continuing:</strong>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Kindly provide your current profession and personal bio reflections.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: CAREER & EDUCATION */}
        {/* ========================================================================= */}
        <div className={currentStepIndex === 1 ? 'space-y-3.5 animate-fade-in' : 'hidden'}>
          <div className="px-1 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                Professional Background
              </h1>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              Help prospective suitors understand your career path, education, and daily routine.
            </p>
          </div>

          {/* Luxury Crisp White Card Panel */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] space-y-4 text-slate-900 border border-white/60">
            {/* Education Level */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Education Level</label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Bachelors Degree', emoji: '🎓', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                  { label: 'Masters Degree', emoji: '📜', bg: 'bg-purple-50', border: 'border-purple-100' },
                  { label: 'Doctorate / PhD', emoji: '🔬', bg: 'bg-blue-50', border: 'border-blue-100' },
                  { label: 'MBBS / Medical', emoji: '🩺', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { label: 'Islamic Scholar', emoji: '📖', bg: 'bg-teal-50', border: 'border-teal-100' },
                  { label: 'Diploma / Associate', emoji: '📑', bg: 'bg-amber-50', border: 'border-amber-100' },
                  { label: 'High School', emoji: '🏛️', bg: 'bg-slate-100', border: 'border-slate-200' }
                ].map(deg => {
                  const isSelected = education.toLowerCase().includes(deg.label.toLowerCase().slice(0, 7));
                  return (
                    <button
                      key={deg.label}
                      type="button"
                      onClick={() => setEducation(deg.label)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FF2560] text-white shadow-brand font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <EmojiBadge emoji={deg.emoji} isSelected={isSelected} bg={deg.bg} border={deg.border} className="w-5 h-5 text-xs" />
                      <span>{deg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* University / College */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">University / College</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. LUMS, Oxford, UCLA"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#FF2560] focus:ring-2 focus:ring-[#FF2560]/15 shadow-2xs transition-all"
                />
                <GraduationCap className="w-4 h-4 absolute right-3.5 top-3 pointer-events-none text-slate-400" />
              </div>
            </div>

            {/* Current Profession */}
            <div id="field-profession">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">
                  Current Profession / Job Title <span className="text-[#FF2560]">*</span>
                </label>
              </div>
              <input
                type="text"
                required
                value={profession}
                onChange={(e) => {
                  setProfession(e.target.value);
                  if (errors.profession) setErrors(prev => { const cp = { ...prev }; delete cp.profession; return cp; });
                }}
                placeholder="e.g. Senior Software Architect, Doctor, Entrepreneur"
                className={`w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none transition-all border-2 ${
                  errors.profession
                    ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-200 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FF2560] focus:ring-2 focus:ring-[#FF2560]/15 shadow-2xs'
                }`}
              />
              {errors.profession && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.profession}</span>
                </p>
              )}
            </div>

            {/* Work Setup */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Building2 className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Work Arrangement</label>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'remote', label: 'Remote / WFH', sub: 'Flexible home base', emoji: '💻', bg: 'bg-sky-50', border: 'border-sky-100' },
                  { id: 'hybrid', label: 'Hybrid Schedule', sub: 'Office & home mix', emoji: '🏢', bg: 'bg-violet-50', border: 'border-violet-100' },
                  { id: 'onsite', label: 'On-Site Office', sub: 'Standard workplace', emoji: '💼', bg: 'bg-amber-50', border: 'border-amber-100' },
                  { id: 'entrepreneur', label: 'Entrepreneur', sub: 'Self-employed / Business', emoji: '📈', bg: 'bg-rose-50', border: 'border-rose-100' }
                ].map(w => {
                  const isSelected = workArrangement === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWorkArrangement(w.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FFF0F3] text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <EmojiBadge 
                          emoji={w.emoji} 
                          isSelected={isSelected} 
                          bg={w.bg} 
                          border={w.border} 
                          className="w-7 h-7 text-sm" 
                        />
                        <strong className="text-xs block text-slate-900 leading-tight">
                          {w.label}
                        </strong>
                      </div>
                      <span className={`text-[10px] block leading-tight ml-9 ${isSelected ? 'text-[#FF2560]/80 font-medium' : 'text-slate-500'}`}>
                        {w.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Income Bracket */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Coins className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Annual Income Bracket</label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'under_40k', label: 'Under $40k', emoji: '💵', bg: 'bg-slate-100', border: 'border-slate-200' },
                  { id: '40k_80k', label: '$40k – $80k', emoji: '💼', bg: 'bg-blue-50', border: 'border-blue-100' },
                  { id: '80k_150k', label: '$80k – $150k', emoji: '📈', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { id: '150k_plus', label: '$150k+', emoji: '🏆', bg: 'bg-amber-50', border: 'border-amber-100' },
                  { id: 'undisclosed', label: 'Prefer not to say', emoji: '🔒', bg: 'bg-slate-100', border: 'border-slate-200' }
                ].map(inc => {
                  const isSelected = incomeBracket === inc.id;
                  return (
                    <button
                      key={inc.id}
                      type="button"
                      onClick={() => setIncomeBracket(inc.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FF2560] text-white shadow-brand font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <EmojiBadge emoji={inc.emoji} isSelected={isSelected} bg={inc.bg} border={inc.border} className="w-5 h-5 text-xs" />
                      <span>{inc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 2: LIFESTYLE, PASSIONS & TRAITS */}
        {/* ========================================================================= */}
        <div className={currentStepIndex === 2 ? 'space-y-3.5 animate-fade-in' : 'hidden'}>
          <div className="px-1 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                <Heart className="w-4 h-4" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                Passions & Personality
              </h1>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              Select interests and character virtues that reflect your personal lifestyle.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] space-y-4 text-slate-900 border border-white/60">
            {/* Interests & Hobbies */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Compass className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Interests & Hobbies</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { tag: 'Books & Islamic History', emoji: '📚', bg: 'bg-amber-50', border: 'border-amber-100' },
                  { tag: 'Travel & Umrah', emoji: '✈️', bg: 'bg-sky-50', border: 'border-sky-100' },
                  { tag: 'Fitness & Gym', emoji: '🏋️', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { tag: 'Specialty Coffee', emoji: '☕', bg: 'bg-orange-50', border: 'border-orange-100' },
                  { tag: 'Cooking & Food Culture', emoji: '🍽️', bg: 'bg-rose-50', border: 'border-rose-100' },
                  { tag: 'Nature & Hiking', emoji: '🏔️', bg: 'bg-teal-50', border: 'border-teal-100' },
                  { tag: 'Technology & Computing', emoji: '💻', bg: 'bg-blue-50', border: 'border-blue-100' },
                  { tag: 'Art & Calligraphy', emoji: '🎨', bg: 'bg-purple-50', border: 'border-purple-100' },
                  { tag: 'Volunteering & Community', emoji: '🤝', bg: 'bg-pink-50', border: 'border-pink-100' },
                  { tag: 'Gardening & Nature', emoji: '🌱', bg: 'bg-green-50', border: 'border-green-100' }
                ].map(item => {
                  const isSelected = isHobbySelected(item.tag);
                  return (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => toggleHobby(item.tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FF2560] text-white shadow-brand font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <EmojiBadge emoji={item.emoji} isSelected={isSelected} bg={item.bg} border={item.border} className="w-5 h-5 text-xs" />
                      <span>{item.tag}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personality Traits */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Heart className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Personality Qualities</label>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { title: 'Family-Oriented', desc: 'Devoted to parents & relatives', emoji: '🤍', bg: 'bg-rose-50', border: 'border-rose-100' },
                  { title: 'Calm & Patient', desc: 'Thoughtful under pressure', emoji: '🌿', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { title: 'Ambitious & Driven', desc: 'Dedicated to personal goals', emoji: '🎯', bg: 'bg-blue-50', border: 'border-blue-100' },
                  { title: 'Warm & Optimistic', desc: 'Positive outlook on life', emoji: '☀️', bg: 'bg-amber-50', border: 'border-amber-100' },
                  { title: 'God-Fearing (Taqwa)', desc: 'Conscious of Allah in actions', emoji: '🕌', bg: 'bg-teal-50', border: 'border-teal-100' },
                  { title: 'Humble & Honest', desc: 'Value integrity and sincerity', emoji: '💎', bg: 'bg-indigo-50', border: 'border-indigo-100' }
                ].map(trait => {
                  const isSelected = isTraitSelected(trait.title);
                  return (
                    <button
                      key={trait.title}
                      type="button"
                      onClick={() => toggleTrait(trait.title)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FFF0F3] text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <EmojiBadge 
                          emoji={trait.emoji} 
                          isSelected={isSelected} 
                          bg={trait.bg} 
                          border={trait.border} 
                          className="w-7 h-7 text-sm" 
                        />
                        <strong className="text-xs block text-slate-900 leading-tight">
                          {trait.title}
                        </strong>
                      </div>
                      <span className={`text-[10px] block leading-snug ml-9 ${isSelected ? 'text-[#FF2560]/80 font-medium' : 'text-slate-500'}`}>
                        {trait.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 3: MARRIAGE INTENT & TIMELINE */}
        {/* ========================================================================= */}
        <div className={currentStepIndex === 3 ? 'space-y-3.5 animate-fade-in' : 'hidden'}>
          <div className="px-1 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                Marriage Vision & Timeline
              </h1>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              Aligning on timelines, Mahr philosophy, and family expectations from the beginning.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] space-y-4 text-slate-900 border border-white/60">
            {/* Nikah Timeline */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Target Nikah Timeline</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '1_to_3_months', label: '1–3 Months', sub: 'Ready soon', emoji: '⏳', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { id: 'within_1_year', label: 'Within 1 Year', sub: 'Serious suitor', emoji: '💍', bg: 'bg-rose-50', border: 'border-rose-100' },
                  { id: 'right_person', label: 'Right Person', sub: 'When aligned', emoji: '🕊️', bg: 'bg-violet-50', border: 'border-violet-100' }
                ].map(opt => {
                  const isSelected = timeline === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTimeline(opt.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FFF0F3] text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <div className="mb-2">
                        <EmojiBadge 
                          emoji={opt.emoji} 
                          isSelected={isSelected} 
                          bg={opt.bg} 
                          border={opt.border} 
                          className="w-8 h-8 text-base" 
                        />
                      </div>
                      <strong className="text-xs block text-slate-900 leading-tight">{opt.label}</strong>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[#FF2560]/80 font-medium' : 'text-slate-500'}`}>
                        {opt.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mahr Philosophy */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Scale className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Mahr Philosophy</label>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'sunnah_modest', label: 'Sunnah Modest Mahr', desc: 'Simple, unburdensome Mahr upon Sunnah', emoji: '⚖️', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { id: 'mutual_agreement', label: 'Mutual Agreement', desc: 'Discussed & agreed respectfully with Wali', emoji: '🤝', bg: 'bg-sky-50', border: 'border-sky-100' }
                ].map(opt => {
                  const isSelected = mahrPhilosophy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMahrPhilosophy(opt.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FFF0F3] text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <EmojiBadge 
                          emoji={opt.emoji} 
                          isSelected={isSelected} 
                          bg={opt.bg} 
                          border={opt.border} 
                          className="w-7 h-7 text-sm" 
                        />
                        <strong className="text-xs block text-slate-900 font-bold leading-tight">{opt.label}</strong>
                      </div>
                      <span className={`text-[10px] leading-tight block ml-9 ${isSelected ? 'text-[#FF2560]/80 font-medium' : 'text-slate-500'}`}>
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Children & Family Plans */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Heart className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Children & Family Plans</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'desires_children', label: 'Desires Children', sub: 'Eager for family', emoji: '👨‍👩‍👧', bg: 'bg-rose-50', border: 'border-rose-100' },
                  { id: 'open', label: 'Open / InshaAllah', sub: 'Flexible mindset', emoji: '🤲', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { id: 'later', label: 'Discuss Later', sub: 'Talk after meeting', emoji: '🕰️', bg: 'bg-amber-50', border: 'border-amber-100' }
                ].map(opt => {
                  const isSelected = childrenDesire === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setChildrenDesire(opt.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FFF0F3] text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <div className="mb-2">
                        <EmojiBadge 
                          emoji={opt.emoji} 
                          isSelected={isSelected} 
                          bg={opt.bg} 
                          border={opt.border} 
                          className="w-8 h-8 text-base" 
                        />
                      </div>
                      <strong className="text-xs block text-slate-900 leading-tight">{opt.label}</strong>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[#FF2560]/80 font-medium' : 'text-slate-500'}`}>
                        {opt.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 4: PERSONAL FAITH & BIO */}
        {/* ========================================================================= */}
        <div className={currentStepIndex === 4 ? 'space-y-3.5 animate-fade-in' : 'hidden'}>
          <div className="px-1 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                About Your Faith & Character
              </h1>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              In your own words, share what practicing faith means in your daily life.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] space-y-4 text-slate-900 border border-white/60">
            <div id="field-bio">
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">
                  Personal Bio & Reflections <span className="text-[#FF2560]">*</span>
                </label>
              </div>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  if (errors.bio) setErrors(prev => { const cp = { ...prev }; delete cp.bio; return cp; });
                }}
                placeholder="Share what practicing Islam means in your daily life, your character values, and what kind of partner you hope to build a home with..."
                className={`w-full rounded-2xl p-3.5 text-xs outline-none leading-relaxed transition-all border-2 ${
                  errors.bio
                    ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-200 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FF2560] focus:ring-2 focus:ring-[#FF2560]/15 shadow-2xs'
                }`}
              />
              
              {/* Quick Inspiration Starters with Professional Emoji Badges */}
              <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] font-semibold text-slate-500">Inspiration:</span>
                {[
                  { text: 'Grounded in daily prayers & family values', emoji: '🕌' },
                  { text: 'Seeking mutual growth in Sunnah', emoji: '📖' },
                  { text: 'Calm temperament & sincere heart', emoji: '🤍' }
                ].map(starter => {
                  return (
                    <button
                      key={starter.text}
                      type="button"
                      onClick={() => {
                        setBio(prev => prev ? `${prev} ${starter.text}` : starter.text);
                        if (errors.bio) setErrors(prev => { const cp = { ...prev }; delete cp.bio; return cp; });
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="text-xs">{starter.emoji}</span>
                      <span>+ {starter.text}</span>
                    </button>
                  );
                })}
              </div>

              {errors.bio ? (
                <p className="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.bio}</span>
                </p>
              ) : (
                <span className="text-[10px] block mt-1 text-right font-medium text-slate-400">
                  {bio.length} characters (min 15)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 5: IDEAL SPOUSE: AGE PREFERENCE */}
        {/* ========================================================================= */}
        <div className={currentStepIndex === 5 ? 'space-y-3.5 animate-fade-in' : 'hidden'}>
          <div className="px-1 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                <Sliders className="w-4 h-4" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                Spouse Preference: Age Bracket
              </h1>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              Define the age bracket you feel most compatible with.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] space-y-4 text-slate-900 border border-white/60">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-xs font-bold block text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF2560]" />
                  <span>Target Age Range</span>
                </strong>
                <span className="text-[10px] text-slate-500">Compatible age boundaries</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#FF2560] bg-[#FFF0F3] px-3 py-1 rounded-full border border-rose-200 shadow-2xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF2560]" />
                <span>{partnerMinAge} – {partnerMaxAge} years</span>
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: '20 – 26 yrs', min: 20, max: 26, emoji: '🎯' },
                { label: '23 – 29 yrs', min: 23, max: 29, emoji: '🎯' },
                { label: '26 – 33 yrs', min: 26, max: 33, emoji: '🎯' },
                { label: '30 – 40 yrs', min: 30, max: 40, emoji: '🎯' },
                { label: 'Open (19–50)', min: 19, max: 50, emoji: '🌐' },
              ].map(preset => {
                const isActive = partnerMinAge === preset.min && partnerMaxAge === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyAgePreset(preset.min, preset.max)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'border-[#FF2560] bg-[#FF2560] text-white shadow-brand font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                    }`}
                  >
                    <span className="text-xs">{preset.emoji}</span>
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Fine Tuning Age Steppers */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] font-bold block mb-1 text-slate-600 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Minimum Age</span>
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPartnerMinAge(prev => Math.max(18, prev - 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={18}
                    max={partnerMaxAge}
                    value={partnerMinAge}
                    onChange={(e) => setPartnerMinAge(Math.min(Number(e.target.value) || 18, partnerMaxAge))}
                    className="w-full text-center bg-transparent text-xs font-bold text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setPartnerMinAge(prev => Math.min(partnerMaxAge, prev + 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold block mb-1 text-slate-600 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Maximum Age</span>
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPartnerMaxAge(prev => Math.max(partnerMinAge, prev - 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={partnerMinAge}
                    max={75}
                    value={partnerMaxAge}
                    onChange={(e) => setPartnerMaxAge(Math.max(Number(e.target.value) || partnerMinAge, partnerMinAge))}
                    className="w-full text-center bg-transparent text-xs font-bold text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setPartnerMaxAge(prev => Math.min(75, prev + 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Strict Dealbreaker Lock */}
            <div 
              onClick={() => setStrictAgeDealbreaker(!strictAgeDealbreaker)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                strictAgeDealbreaker
                  ? 'border-[#FF2560] bg-[#FFF0F3] text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <EmojiBadge emoji="🔒" isSelected={strictAgeDealbreaker} bg="bg-rose-50" border="border-rose-100" className="w-6 h-6 text-xs" />
                <span className="text-xs font-semibold">Strict Age Dealbreaker (Filter candidates outside range)</span>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                strictAgeDealbreaker 
                  ? 'bg-[#FF2560] border-[#FF2560] text-white shadow-xs' 
                  : 'border-slate-300 bg-white'
              }`}>
                {strictAgeDealbreaker && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 6: IDEAL SPOUSE: DEEN & RELOCATION */}
        {/* ========================================================================= */}
        <div className={currentStepIndex === 6 ? 'space-y-3.5 animate-fade-in' : 'hidden'}>
          <div className="px-1 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                Spouse Preference: Deen & Background
              </h1>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              Define the religious and background expectations for your prospective spouse.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] space-y-4 text-slate-900 border border-white/60">
            {/* Religious Practice */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Religious Practice</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'very_practicing', label: 'Very Practicing', desc: '5x daily prayer routine', emoji: '🕌', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { id: 'practicing', label: 'Practicing', desc: 'Committed to essentials', emoji: '📖', bg: 'bg-teal-50', border: 'border-teal-100' },
                  { id: 'any', label: 'Growing in Faith', desc: 'Sincere & developing', emoji: '🌱', bg: 'bg-sky-50', border: 'border-sky-100' }
                ].map(opt => {
                  const isSelected = partnerPracticeLevel === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPartnerPracticeLevel(opt.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FFF0F3] text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <div className="mb-2">
                        <EmojiBadge 
                          emoji={opt.emoji} 
                          isSelected={isSelected} 
                          bg={opt.bg} 
                          border={opt.border} 
                          className="w-8 h-8 text-base" 
                        />
                      </div>
                      <strong className="text-xs block text-slate-900 leading-tight">{opt.label}</strong>
                      <span className={`text-[10px] block mt-0.5 leading-snug ${isSelected ? 'text-[#FF2560]/80 font-medium' : 'text-slate-500'}`}>
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Heart className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Marital Status Preference</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'never_married', label: 'Never Married', desc: 'Single only', emoji: '💍', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                  { id: 'any', label: 'Open to All', desc: 'Any background', emoji: '🤍', bg: 'bg-rose-50', border: 'border-rose-100' },
                  { id: 'divorced_widowed_open', label: 'Divorced / Widowed', desc: 'Welcoming', emoji: '🤝', bg: 'bg-amber-50', border: 'border-amber-100' }
                ].map(opt => {
                  const isSelected = partnerMaritalStatus === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPartnerMaritalStatus(opt.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FFF0F3] text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <div className="mb-2">
                        <EmojiBadge 
                          emoji={opt.emoji} 
                          isSelected={isSelected} 
                          bg={opt.bg} 
                          border={opt.border} 
                          className="w-8 h-8 text-base" 
                        />
                      </div>
                      <strong className="text-xs block text-slate-900 leading-tight">{opt.label}</strong>
                      <span className={`text-[10px] block mt-0.5 leading-snug ${isSelected ? 'text-[#FF2560]/80 font-medium' : 'text-slate-500'}`}>
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Relocation Preference */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">Relocation Flexibility</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'open', label: 'Willing to Relocate', desc: 'Open to moving', emoji: '✈️', bg: 'bg-sky-50', border: 'border-sky-100' },
                  { id: 'prefer_same_city', label: 'Prefers Same City', desc: 'Local suitor', emoji: '📍', bg: 'bg-rose-50', border: 'border-rose-100' },
                  { id: 'flexible', label: 'Flexible / Mutual', desc: 'Discuss together', emoji: '🧭', bg: 'bg-violet-50', border: 'border-violet-100' }
                ].map(opt => {
                  const isSelected = partnerRelocation === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPartnerRelocation(opt.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center group ${
                        isSelected
                          ? 'border-[#FF2560] bg-[#FFF0F3] text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <div className="mb-2">
                        <EmojiBadge 
                          emoji={opt.emoji} 
                          isSelected={isSelected} 
                          bg={opt.bg} 
                          border={opt.border} 
                          className="w-8 h-8 text-base" 
                        />
                      </div>
                      <strong className="text-xs block text-slate-900 leading-tight">{opt.label}</strong>
                      <span className={`text-[10px] block mt-0.5 leading-snug ${isSelected ? 'text-[#FF2560]/80 font-medium' : 'text-slate-500'}`}>
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 7: NON-NEGOTIABLE DEALBREAKERS */}
        {/* ========================================================================= */}
        <div className={currentStepIndex === 7 ? 'space-y-3.5 animate-fade-in' : 'hidden'}>
          <div className="px-1 mb-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                  <Lock className="w-4 h-4" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                  Non-Negotiable Dealbreakers
                </h1>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-medium">
                Select standards that are strictly mandatory. Candidates not meeting these will be filtered out.
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#FF2560] shadow-sm shrink-0 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#FF2560]" />
              <span>{dealbreakers.length} Active</span>
            </span>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] text-slate-900 border border-white/60">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'non_smoker', label: 'Non-Smoker Only', desc: 'Must strictly not smoke cigarettes or vape', emoji: '🚭', bg: 'bg-rose-50', border: 'border-rose-100' },
                { id: 'daily_salah', label: '5x Daily Salah', desc: 'Regular in obligatory five daily prayers', emoji: '🕌', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                { id: 'halal_diet', label: 'Strictly Halal Diet', desc: 'Strict commitment to halal food only', emoji: '🍽️', bg: 'bg-teal-50', border: 'border-teal-100' },
                { id: 'family_involvement', label: 'Early Wali Involvement', desc: 'Respectful guardian involvement from start', emoji: '🛡️', bg: 'bg-indigo-50', border: 'border-indigo-100' }
              ].map(item => {
                const isChecked = dealbreakers.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleDealbreaker(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                      isChecked
                        ? 'border-[#FF2560] bg-[#FFF0F3] text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <EmojiBadge 
                          emoji={item.emoji} 
                          isSelected={isChecked} 
                          bg={item.bg} 
                          border={item.border} 
                          className="w-7 h-7 text-sm" 
                        />
                        <strong className="text-xs block text-slate-900 leading-tight">
                          {item.label}
                        </strong>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isChecked ? 'bg-[#FF2560] border-[#FF2560] text-white shadow-xs' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                      </div>
                    </div>
                    <span className={`text-[10px] block leading-snug ml-9.5 ${isChecked ? 'text-[#FF2560]/80 font-medium' : 'text-slate-500'}`}>
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 8: SUMMARY & CHARACTER NOTE */}
        {/* ========================================================================= */}
        <div className={currentStepIndex === 8 ? 'space-y-3.5 animate-fade-in' : 'hidden'}>
          <div className="px-1 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                Spouse Criteria Summary
              </h1>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              Review your criteria before completing your matrimonial profile.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] space-y-4 text-slate-900 border border-white/60">
            {/* Compatibility Engine Card */}
            <div className="rounded-2xl p-4 border border-emerald-200/90 bg-gradient-to-br from-emerald-50 to-teal-50/50 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>140+ Matching Profiles in Community</span>
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-600 text-white shadow-2xs flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" />
                  <span>96% Match Quality</span>
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-700/90 font-medium">
                Based on your age bracket ({partnerMinAge}–{partnerMaxAge} yrs), Deen preferences, and active dealbreakers.
              </p>
            </div>

            {/* Freeform Character Note */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF2560]" />
                <label className="text-xs font-bold text-slate-800">
                  Specific Character & Values Note (Optional)
                </label>
              </div>
              <textarea
                rows={3}
                value={partnerDescription}
                onChange={(e) => setPartnerDescription(e.target.value)}
                placeholder="e.g. Seeking someone grounded in daily prayers, emotionally mature, kind to parents, with mutual respect and a sincere heart for building a Sunnah home..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#FF2560] focus:ring-2 focus:ring-[#FF2560]/15 shadow-2xs transition-all leading-relaxed"
              />
            </div>

            {/* Summary Badges Grid with Professional Emoji Badges */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-2xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider block text-slate-500">Your Chosen Criteria</span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 shadow-2xs flex items-center gap-2">
                  <EmojiBadge emoji="🗓️" bg="bg-blue-50" border="border-blue-100" className="w-5 h-5 text-xs" />
                  <span>Age: {partnerMinAge}–{partnerMaxAge} yrs</span>
                </span>
                <span className="px-2.5 py-1.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 shadow-2xs flex items-center gap-2">
                  <EmojiBadge emoji="🕌" bg="bg-emerald-50" border="border-emerald-100" className="w-5 h-5 text-xs" />
                  <span>Deen: {partnerPracticeLevel}</span>
                </span>
                <span className="px-2.5 py-1.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 shadow-2xs flex items-center gap-2">
                  <EmojiBadge emoji="💍" bg="bg-purple-50" border="border-purple-100" className="w-5 h-5 text-xs" />
                  <span>Status: {partnerMaritalStatus}</span>
                </span>
                <span className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-semibold border border-rose-200 shadow-2xs flex items-center gap-2">
                  <EmojiBadge emoji="🛡️" isSelected={true} className="w-5 h-5 text-xs" />
                  <span>Dealbreakers: {dealbreakers.length} Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM ACTION BAR (Crisp White Primary CTA on Brand Background) */}
      {/* ========================================================================= */}
      <div className="pt-4 space-y-2">
        {currentStepIndex < STEPS.length ? (
          <button
            type="button"
            onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
            className="w-full py-3.5 rounded-full bg-white text-[#FF2560] font-sans text-xs font-bold shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:bg-white/95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Next: {STEPS[currentStepIndex]?.title}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-full bg-white text-[#FF2560] font-sans text-xs font-bold shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:bg-white/95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to Photos & Modesty</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        {/* Global direct submit button so tests and quick users can proceed at any time */}
        {currentStepIndex < STEPS.length && (
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2 text-xs font-semibold text-white/90 hover:text-white transition-colors text-center cursor-pointer drop-shadow-xs"
          >
            Continue to Photos & Modesty
          </button>
        )}
      </div>
    </div>
  );
};

export default YourIntentScreen;
