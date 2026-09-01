import React, { useState } from 'react';

interface Props {
  data?: {
    fullName?: string;
    dob?: string;
    gender?: string;
    location?: string;
    height?: string;
    ethnicity?: string;
    citizenship?: string;
    willingnessToRelocate?: 'willing' | 'not_willing' | 'open';
  };
  onBack: () => void;
  onContinue: (info: {
    fullName: string;
    dob: string;
    gender: string;
    location: string;
    height: string;
    ethnicity: string;
    citizenship: string;
    willingnessToRelocate: 'willing' | 'not_willing' | 'open';
  }) => void;
}

export const BasicInfoScreen: React.FC<Props> = ({ data, onBack, onContinue }) => {
  const [fullName, setFullName] = useState(data?.fullName || '');
  const [dob, setDob] = useState(data?.dob || '1998-01-01');
  const [gender, setGender] = useState(data?.gender || 'male');
  const [location, setLocation] = useState(data?.location || 'London, UK');
  const [height, setHeight] = useState(data?.height || "5'10\" (178 cm)");
  const [ethnicity, setEthnicity] = useState(data?.ethnicity || 'South Asian');
  const [citizenship, setCitizenship] = useState(data?.citizenship || 'Citizen');
  const [willingnessToRelocate, setWillingnessToRelocate] = useState<'willing' | 'not_willing' | 'open'>(
    data?.willingnessToRelocate || 'open'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    onContinue({ fullName, dob, gender, location, height, ethnicity, citizenship, willingnessToRelocate });
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
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Step 1 of 5</span>
            <span className="text-[11px] text-secondary">· Personal</span>
          </div>
          <div className="w-10" />
        </div>

        {/* 5-Step Glowing Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-6">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light shadow-emerald" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface mb-1">
          Personal Background
        </h1>
        <p className="text-xs text-secondary mb-5 leading-relaxed">
          Provide your biodata accurately to help prospective matches understand your profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Bilal Ahmad"
              className="w-full bg-surface border border-surface-variant rounded-2xl px-4 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs transition-all"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'male', label: 'Brother (Male)', icon: 'man' },
                { id: 'female', label: 'Sister (Female)', icon: 'woman' }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id)}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    gender === g.id
                      ? 'border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth & Height */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Date of Birth</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-surface border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Height</label>
              <select
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-surface border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs font-medium"
              >
                {["5'2\" (157 cm)", "5'4\" (162 cm)", "5'6\" (168 cm)", "5'8\" (173 cm)", "5'10\" (178 cm)", "6'0\" (183 cm)", "6'2\" (188 cm)", "6'4\" (193 cm)"].map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ethnicity / Cultural Heritage & Citizenship */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Heritage / Ethnicity</label>
              <select
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className="w-full bg-surface border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs font-medium"
              >
                {['South Asian', 'Arab / Middle Eastern', 'Turkish', 'Caucasian / European', 'African', 'East Asian', 'Hispanic / Latino', 'Mixed / Other'].map(eth => (
                  <option key={eth} value={eth}>{eth}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Citizenship / Visa</label>
              <select
                value={citizenship}
                onChange={(e) => setCitizenship(e.target.value)}
                className="w-full bg-surface border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs font-medium"
              >
                {['Citizen', 'Permanent Resident / PR', 'Work Visa', 'Student Visa', 'Dual National', 'Prefer not to say'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Current City & Country</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. London, UK or Lahore, Pakistan or Dallas, USA"
              className="w-full bg-surface border border-surface-variant rounded-2xl px-4 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs"
            />
          </div>

          {/* Willingness to Relocate */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">International Relocation</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'willing', label: '✈️ International' },
                { id: 'open', label: '🌍 Flexible' },
                { id: 'not_willing', label: '🏠 Local Only' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setWillingnessToRelocate(opt.id as any)}
                  className={`py-2.5 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    willingnessToRelocate === opt.id
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Bottom Action */}
      <div className="pt-6">
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-full bg-gradient-to-r from-primary via-primary to-primary-light text-white font-sans text-xs font-bold shadow-emerald hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Deen & Practice</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

