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
    <div className="w-full h-full flex flex-col justify-between p-6 bg-background font-sans overflow-y-auto pb-32">
      <div>
        {/* Header & Progress */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Step 1 of 5</span>
          <div className="w-10" />
        </div>

        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mb-6">
          <div className="bg-primary h-full w-[20%] transition-all duration-300" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
          Personal Background
        </h1>
        <p className="text-xs text-secondary mb-6 leading-relaxed">
          Provide accurate details to help prospective matches understand your profile.
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
              className="w-full bg-surface-container-high border border-surface-variant rounded-2xl px-4 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary"
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
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-container-low'
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
                className="w-full bg-surface-container-high border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Height</label>
              <select
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-surface-container-high border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full bg-surface-container-high border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full bg-surface-container-high border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full bg-surface-container-high border border-surface-variant rounded-2xl px-4 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Willingness to Relocate */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">International Relocation</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'willing', label: '✈️ International' },
                { id: 'open', label: '🌍 Flexible' },
                { id: 'not_willing', label: '🏠 Current City' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setWillingnessToRelocate(opt.id as any)}
                  className={`py-2.5 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    willingnessToRelocate === opt.id
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-container-low'
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
          className="w-full py-4 rounded-full bg-primary text-on-primary font-sans text-xs font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Religious Practice</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
