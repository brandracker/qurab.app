import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, HeartHandshake } from 'lucide-react';
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

export const YourIntentScreen: React.FC<Props> = ({ data, onBack, onContinue }) => {
  const [education, setEducation] = useState<string>(data?.education || 'Bachelors Degree');
  const [university, setUniversity] = useState<string>(data?.university || '');
  const [profession, setProfession] = useState<string>(data?.profession || 'Software Engineer');
  const [workArrangement, setWorkArrangement] = useState<'remote' | 'hybrid' | 'onsite' | 'entrepreneur'>(data?.workArrangement || 'remote');
  const [incomeBracket, setIncomeBracket] = useState<'under_40k' | '40k_80k' | '80k_150k' | '150k_plus' | 'undisclosed'>(data?.incomeBracket || '40k_80k');
  const [hobbies, setHobbies] = useState<string[]>(data?.hobbies || ['📚 Books & Islamic History', '✈️ Travel & Umrah', '☕ Specialty Coffee']);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>(data?.personalityTraits || ['🤍 Family-Oriented', '🌿 Calm & Patient']);
  const [mahrPhilosophy, setMahrPhilosophy] = useState<string>(data?.mahrPhilosophy || 'mutual_agreement');
  const [timeline, setTimeline] = useState<string>(data?.timeline || 'within_1_year');
  const [childrenDesire, setChildrenDesire] = useState<string>(data?.childrenDesire || 'desires_children');
  const [bio, setBio] = useState<string>(data?.bio || '');

  // Partner Requirements / Preferences
  const [partnerMinAge, setPartnerMinAge] = useState<number>(data?.partnerRequirements?.minAge || 21);
  const [partnerMaxAge, setPartnerMaxAge] = useState<number>(data?.partnerRequirements?.maxAge || 35);
  const [partnerMaritalStatus, setPartnerMaritalStatus] = useState<string>(data?.partnerRequirements?.maritalStatus || 'any');
  const [partnerPracticeLevel, setPartnerPracticeLevel] = useState<string>(data?.partnerRequirements?.practiceLevel || 'practicing');
  const [partnerRelocation, setPartnerRelocation] = useState<string>(data?.partnerRequirements?.relocation || 'open');
  const [partnerDescription, setPartnerDescription] = useState<string>(data?.partnerRequirements?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue({
      education,
      university,
      profession,
      workArrangement,
      incomeBracket,
      hobbies,
      personalityTraits,
      mahrPhilosophy,
      timeline,
      childrenDesire,
      bio: bio.trim() || 'Striving on the path of deen and seeking a pious partner.',
      partnerRequirements: {
        minAge: partnerMinAge,
        maxAge: partnerMaxAge,
        maritalStatus: partnerMaritalStatus,
        practiceLevel: partnerPracticeLevel,
        relocation: partnerRelocation,
        description: partnerDescription.trim() || 'Seeking a practicing, family-oriented partner with good akhlaq.'
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-background font-sans overflow-y-auto pb-24 select-none text-on-surface">
      <div>
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between mb-3 pt-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-outline flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Step 4 of 5</span>
            <span className="text-[11px] text-secondary">· Intent</span>
          </div>
          <div className="w-9" />
        </div>

        {/* 5-Step Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
          Career, Mahr & Intent
        </h1>
        <p className="text-xs text-secondary mb-4 leading-relaxed">
          Define your educational background, financial outlook, and matrimonial timeline.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Education & University */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Education Level</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium"
              >
                {['Bachelors Degree', 'Masters Degree', 'Doctorate / PhD', 'Medical Doctor / MBBS', 'Islamic Scholar / Alimiyyah', 'Diploma / Associate', 'High School'].map(deg => (
                  <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">University / College</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. LUMS / Oxford"
                className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle"
              />
            </div>
          </div>

          {/* Profession */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Current Profession / Job Title</label>
            <input
              type="text"
              required
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. Senior Software Architect, Doctor, Entrepreneur"
              className="w-full bg-white border border-outline rounded-2xl px-3.5 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle"
            />
          </div>

          {/* Work Setup & Income Bracket */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Work Setup</label>
              <select
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value as any)}
                className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium"
              >
                {[
                  { id: 'remote', label: '💻 Remote / WFH' },
                  { id: 'hybrid', label: '🌐 Hybrid' },
                  { id: 'onsite', label: '🏢 On-Site' },
                  { id: 'entrepreneur', label: '🚀 Entrepreneur' }
                ].map(w => (
                  <option key={w.id} value={w.id}>{w.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Annual Income Bracket</label>
              <select
                value={incomeBracket}
                onChange={(e) => setIncomeBracket(e.target.value as any)}
                className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium"
              >
                {[
                  { id: 'under_40k', label: 'Under $40k' },
                  { id: '40k_80k', label: '$40k – $80k' },
                  { id: '80k_150k', label: '$80k – $150k' },
                  { id: '150k_plus', label: '$150k+' },
                  { id: 'undisclosed', label: 'Prefer not to say' }
                ].map(inc => (
                  <option key={inc.id} value={inc.id}>{inc.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hobbies & Passions */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Interests & Hobbies</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                '📚 Books & Islamic History',
                '✈️ Travel & Umrah',
                '🏋️ Fitness & Gym',
                '☕ Specialty Coffee',
                '🍳 Cooking & Foodie',
                '🌿 Nature & Hiking',
                '💻 Tech & Coding',
                '🎨 Art & Calligraphy'
              ].map(tag => {
                const isSelected = hobbies.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (isSelected) setHobbies(hobbies.filter(h => h !== tag));
                      else setHobbies([...hobbies, tag]);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-subtle'
                        : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personality Traits */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Personality Traits</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                '🤍 Family-Oriented',
                '🌿 Calm & Patient',
                '💡 Ambitious & Driven',
                '☀️ Optimistic & Warm',
                '🕌 God-Fearing (Taqwa)',
                '🤝 Humble & Honest'
              ].map(trait => {
                const isSelected = personalityTraits.includes(trait);
                return (
                  <button
                    key={trait}
                    type="button"
                    onClick={() => {
                      if (isSelected) setPersonalityTraits(personalityTraits.filter(t => t !== trait));
                      else setPersonalityTraits([...personalityTraits, trait]);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'border-pastel-amber-border bg-pastel-amber text-pastel-amber-text font-bold shadow-subtle'
                        : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                    }`}
                  >
                    {trait}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Nikah Timeline */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Target Nikah Timeline</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '1_to_3_months', label: '1–3 Months' },
                { id: 'within_1_year', label: 'Within 1 Year' },
                { id: 'right_person', label: 'Right Person' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTimeline(opt.id)}
                  className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    timeline === opt.id
                      ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mahr Philosophy */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Mahr Philosophy</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'sunnah_modest', label: 'Sunnah Modest Mahr', desc: 'Simple, unburdensome Mahr upon Sunnah' },
                { id: 'mutual_agreement', label: 'Mutual Agreement', desc: 'Discussed & agreed respectfully with Wali' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMahrPhilosophy(opt.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    mahrPhilosophy === opt.id
                      ? 'border-primary bg-pastel-mint text-on-surface shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  <strong className="text-xs block text-on-surface font-bold">{opt.label}</strong>
                  <span className="text-[10px] text-secondary leading-tight block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Children Intent */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Children & Family Plans</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'desires_children', label: '👶 Desires Kids' },
                { id: 'open', label: '🤲 InshaAllah' },
                { id: 'later', label: '🤝 Discuss Later' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setChildrenDesire(opt.id)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    childrenDesire === opt.id
                      ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* About My Deen & Bio Essay */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              About My Deen & Personal Reflections
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share what practicing Islam means in your daily life, your character values, and what kind of partner you hope to build a home with..."
              className="w-full bg-white border border-outline rounded-2xl p-3 text-xs text-on-surface outline-none focus:border-primary leading-relaxed shadow-subtle"
            />
          </div>

          {/* Partner Requirements & Expectations (شریکِ حیات کے تقاضے) */}
          <div className="bg-pastel-sand/60 rounded-2xl p-4 border border-pastel-sand-border space-y-3 shadow-subtle">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shadow-2xs">
                <HeartHandshake className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-on-surface">Partner Requirements & Expectations</h3>
                <p className="text-[10px] text-secondary">What you are looking for in a prospective spouse</p>
              </div>
            </div>

            {/* Preferred Age Range */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-on-surface">Preferred Age Range</span>
                <span className="text-[11px] font-mono font-bold text-primary">{partnerMinAge} - {partnerMaxAge} years</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-secondary block mb-0.5">Min Age</span>
                  <input
                    type="number"
                    min={18}
                    max={partnerMaxAge}
                    value={partnerMinAge}
                    onChange={(e) => setPartnerMinAge(Math.min(Number(e.target.value) || 18, partnerMaxAge))}
                    className="w-full bg-white border border-outline rounded-xl px-3 py-1.5 text-xs font-bold text-on-surface outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-secondary block mb-0.5">Max Age</span>
                  <input
                    type="number"
                    min={partnerMinAge}
                    max={75}
                    value={partnerMaxAge}
                    onChange={(e) => setPartnerMaxAge(Math.max(Number(e.target.value) || partnerMinAge, partnerMinAge))}
                    className="w-full bg-white border border-outline rounded-xl px-3 py-1.5 text-xs font-bold text-on-surface outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Preferred Marital Status */}
            <div>
              <span className="text-[11px] font-bold text-on-surface block mb-1">Marital Status Preference</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'never_married', label: 'Never Married' },
                  { id: 'any', label: 'Open to All' },
                  { id: 'divorced_widowed_open', label: 'Divorced / Widowed OK' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPartnerMaritalStatus(opt.id)}
                    className={`py-1.5 px-1 rounded-xl border text-[10px] font-semibold text-center transition-all ${
                      partnerMaritalStatus === opt.id
                        ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle'
                        : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Religious Practice Requirement */}
            <div>
              <span className="text-[11px] font-bold text-on-surface block mb-1">Deen & Practice Expectation</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'practicing', label: 'Practicing' },
                  { id: 'very_practicing', label: 'Very Practicing' },
                  { id: 'any', label: 'Growing in Deen' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPartnerPracticeLevel(opt.id)}
                    className={`py-1.5 px-1 rounded-xl border text-[10px] font-semibold text-center transition-all ${
                      partnerPracticeLevel === opt.id
                        ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle'
                        : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Relocation Preference */}
            <div>
              <span className="text-[11px] font-bold text-on-surface block mb-1">Relocation Expectation</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'open', label: 'Open / Flexible' },
                  { id: 'willing', label: 'Willing to Relocate' },
                  { id: 'not_willing', label: 'Prefer Same City' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPartnerRelocation(opt.id)}
                    className={`py-1.5 px-1 rounded-xl border text-[10px] font-semibold text-center transition-all ${
                      partnerRelocation === opt.id
                        ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle'
                        : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Partner Requirements Description */}
            <div>
              <span className="text-[11px] font-bold text-on-surface block mb-1">Specific Partner Requirements (Optional)</span>
              <textarea
                rows={2}
                value={partnerDescription}
                onChange={(e) => setPartnerDescription(e.target.value)}
                placeholder="e.g. Seeking a practicing, family-oriented partner with good akhlaq..."
                className="w-full bg-white border border-outline rounded-xl p-2.5 text-xs text-on-surface outline-none focus:border-primary leading-relaxed shadow-2xs"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Bottom Action */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Continue to Photos & Modesty</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default YourIntentScreen;


