import React, { useState } from 'react';

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
      bio: bio.trim() || 'Striving on the path of deen and seeking a pious partner.'
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-background font-sans overflow-y-auto pb-28 select-none">
      <div>
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between mb-3 pt-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-surface border border-surface-variant/80 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Step 4 of 5</span>
            <span className="text-[11px] text-secondary">· Intent</span>
          </div>
          <div className="w-10" />
        </div>

        {/* 5-Step Glowing Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-6">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light shadow-emerald" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface mb-1">
          Career, Mahr & Intent
        </h1>
        <p className="text-xs text-secondary mb-5 leading-relaxed">
          Define your educational pedigree, financial outlook, and matrimonial timeline.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Education & University */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Education Level</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-surface border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs font-medium"
              >
                {['Bachelors Degree', 'Masters Degree', 'Doctorate / PhD', 'Medical Doctor / MBBS', 'Islamic Scholar / Alimiyyah', 'Diploma / Associate', 'High School'].map(deg => (
                  <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">University / College</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. LUMS / Oxford"
                className="w-full bg-surface border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs"
              />
            </div>
          </div>

          {/* Profession */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Current Profession / Job Title</label>
            <input
              type="text"
              required
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. Senior Software Architect, Doctor, Entrepreneur"
              className="w-full bg-surface border border-surface-variant rounded-2xl px-4 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs"
            />
          </div>

          {/* Work Setup & Income Bracket */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Work Setup</label>
              <select
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value as any)}
                className="w-full bg-surface border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs font-medium"
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
              <label className="block text-xs font-bold text-on-surface mb-1.5">Annual Income Bracket</label>
              <select
                value={incomeBracket}
                onChange={(e) => setIncomeBracket(e.target.value as any)}
                className="w-full bg-surface border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs font-medium"
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
            <label className="block text-xs font-bold text-on-surface mb-2">Interests & Hobbies</label>
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
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-2xs'
                        : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
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
            <label className="block text-xs font-bold text-on-surface mb-2">Personality Traits</label>
            <div className="flex flex-wrap gap-2">
              {[
                '🤍 Family-Oriented',
                '🌿 Calm & Patient',
                '💡 Ambitious & Driven',
                '✨ Optimistic & Warm',
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
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'border-accent-gold bg-accent-gold text-on-surface font-bold shadow-2xs'
                        : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
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
            <label className="block text-xs font-bold text-on-surface mb-2">Target Nikah Timeline</label>
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
                  className={`p-2.5 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    timeline === opt.id
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mahr Philosophy */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Mahr Philosophy</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'sunnah_modest', label: 'Sunnah Modest Mahr', desc: 'Simple, unburdensome Mahr upon Sunnah' },
                { id: 'mutual_agreement', label: 'Mutual Agreement', desc: 'Discussed & agreed respectfully with Wali' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMahrPhilosophy(opt.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    mahrPhilosophy === opt.id
                      ? 'border-primary bg-primary/10 text-on-surface shadow-xs ring-1 ring-primary'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
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
            <label className="block text-xs font-bold text-on-surface mb-2">Children & Family Plans</label>
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
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* About My Deen & Bio Essay */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              About My Deen & Personal Reflections
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share what practicing Islam means in your daily life, your character values, and what kind of partner you hope to build a home with..."
              className="w-full bg-surface border border-surface-variant rounded-2xl p-3.5 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary leading-relaxed shadow-2xs"
            />
          </div>
        </form>
      </div>

      {/* Bottom Action */}
      <div className="pt-6">
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-full bg-gradient-to-r from-primary via-primary to-primary-light text-white font-sans text-xs font-bold shadow-emerald hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Photos & Modesty</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

