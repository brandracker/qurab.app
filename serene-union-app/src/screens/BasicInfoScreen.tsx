import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';

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
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Step 1 of 5</span>
            <span className="text-[11px] text-secondary">· Personal</span>
          </div>
          <div className="w-9" />
        </div>

        {/* 5-Step Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
          Personal Background
        </h1>
        <p className="text-xs text-secondary mb-4 leading-relaxed">
          Provide your biodata accurately to help prospective matches understand your profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Bilal Ahmad"
              className="w-full bg-white border border-outline rounded-2xl px-3.5 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle transition-all"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Gender</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'male', label: 'Brother (Male)' },
                { id: 'female', label: 'Sister (Female)' }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id)}
                  className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    gender === g.id
                      ? 'border-primary bg-pastel-rose text-primary shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth & Height */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Height</label>
              <select
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium"
              >
                {["5'2\" (157 cm)", "5'4\" (162 cm)", "5'6\" (168 cm)", "5'8\" (173 cm)", "5'10\" (178 cm)", "6'0\" (183 cm)", "6'2\" (188 cm)", "6'4\" (193 cm)"].map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ethnicity / Cultural Heritage & Citizenship */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Heritage / Ethnicity</label>
              <select
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium"
              >
                {['South Asian', 'Arab / Middle Eastern', 'Turkish', 'Caucasian / European', 'African', 'East Asian', 'Hispanic / Latino', 'Mixed / Other'].map(eth => (
                  <option key={eth} value={eth}>{eth}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Citizenship / Visa</label>
              <select
                value={citizenship}
                onChange={(e) => setCitizenship(e.target.value)}
                className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium"
              >
                {['Citizen', 'Permanent Resident / PR', 'Work Visa', 'Student Visa', 'Dual National', 'Prefer not to say'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Current City & Country</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. London, UK or Lahore, Pakistan or Dallas, USA"
              className="w-full bg-white border border-outline rounded-2xl px-3.5 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle"
            />
          </div>

          {/* Willingness to Relocate */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">International Relocation</label>
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
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    willingnessToRelocate === opt.id
                      ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
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
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Continue to Deen & Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default BasicInfoScreen;


