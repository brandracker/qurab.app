import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Home, Users, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  data: {
    familyStructure?: 'nuclear' | 'joint';
    livingPreference?: 'independent' | 'with_in_laws' | 'flexible';
    siblingsCount?: number;
    smokingStatus?: 'non_smoker' | 'trying_to_quit' | 'occasional';
    languagesSpoken?: string;
    maritalStatus?: 'never_married' | 'divorced' | 'widowed' | 'single_parent';
    dualIncomePreference?: 'career_supportive' | 'homemaker_focused' | 'flexible';
  };
  onNext: (stepData: any) => void;
  onBack: () => void;
}

export const FamilyLifestyleScreen: React.FC<Props> = ({ data, onNext, onBack }) => {
  const [familyStructure, setFamilyStructure] = useState<'nuclear' | 'joint'>(data.familyStructure || 'nuclear');
  const [livingPreference, setLivingPreference] = useState<'independent' | 'with_in_laws' | 'flexible'>(data.livingPreference || 'independent');
  const [siblingsCount, setSiblingsCount] = useState<number>(data.siblingsCount ?? 2);
  const [smokingStatus, setSmokingStatus] = useState<'non_smoker' | 'trying_to_quit' | 'occasional'>(data.smokingStatus || 'non_smoker');
  const [languagesSpoken, setLanguagesSpoken] = useState<string>(data.languagesSpoken || 'English, Urdu');
  const [maritalStatus, setMaritalStatus] = useState<'never_married' | 'divorced' | 'widowed' | 'single_parent'>(data.maritalStatus || 'never_married');
  const [dualIncomePreference, setDualIncomePreference] = useState<'career_supportive' | 'homemaker_focused' | 'flexible'>(data.dualIncomePreference || 'career_supportive');

  const handleContinue = () => {
    onNext({
      familyStructure,
      livingPreference,
      siblingsCount,
      smokingStatus,
      languagesSpoken,
      maritalStatus,
      dualIncomePreference
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-background font-sans overflow-y-auto pb-24 select-none text-on-surface">
      {/* Top Header & Progress */}
      <div>
        <div className="flex items-center justify-between mb-3 pt-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-outline flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Step 3 of 5</span>
            <span className="text-[11px] text-secondary">· Family</span>
          </div>
          <div className="w-9" />
        </div>

        {/* 5-Step Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
          Family & Living Outlook
        </h1>
        <p className="text-xs text-secondary mb-4 leading-relaxed">
          Living preferences and family values are essential for lifelong marital harmony.
        </p>

        <div className="space-y-4">
          {/* Post-Marriage Living Arrangement */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Post-Marriage Living Arrangement <span className="text-primary">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'independent', label: '🏡 Independent Household', desc: 'Desire separate private home from in-laws' },
                { id: 'with_in_laws', label: '👨‍👩‍👧‍👦 Joint Living with Family', desc: 'Living with parents / family home' },
                { id: 'flexible', label: '🤝 Flexible / Open to Discussion', desc: 'Willing to adapt as circumstances allow' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLivingPreference(opt.id as any)}
                  className={`p-3 rounded-2xl text-left border transition-all flex items-start justify-between ${
                    livingPreference === opt.id
                      ? 'border-primary bg-pastel-rose text-on-surface shadow-subtle'
                      : 'border-outline bg-white hover:bg-surface-variant text-secondary'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">{opt.label}</h4>
                    <p className="text-[10px] text-secondary mt-0.5">{opt.desc}</p>
                  </div>
                  {livingPreference === opt.id ? (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-outline shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Family Structure */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Family Structure</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'nuclear', label: 'Nuclear Family', Icon: Home },
                { id: 'joint', label: 'Joint Extended Family', Icon: Users }
              ].map(opt => {
                const IconComponent = opt.Icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFamilyStructure(opt.id as any)}
                    className={`p-3 rounded-2xl text-center border transition-all flex flex-col items-center gap-1 ${
                      familyStructure === opt.id
                        ? 'border-primary bg-pastel-sand text-primary font-bold shadow-subtle'
                        : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-primary" />
                    <span className="text-xs font-semibold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Siblings Count */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Number of Siblings</label>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4, '5+'].map((cnt, idx) => {
                const val = typeof cnt === 'number' ? cnt : 5;
                const isSelected = siblingsCount === val;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSiblingsCount(val)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-subtle'
                        : 'border-outline bg-white text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    {cnt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Marital Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'never_married', label: '💍 Never Married' },
                { id: 'divorced', label: '🌱 Divorced' },
                { id: 'widowed', label: '🕊️ Widowed' },
                { id: 'single_parent', label: '👶 Single Parent' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMaritalStatus(opt.id as any)}
                  className={`py-2 px-1.5 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    maritalStatus === opt.id
                      ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dual-Income / Career Support */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Dual-Income & Working Spouse</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'career_supportive', label: '💼 Career Supportive' },
                { id: 'homemaker_focused', label: '🏠 Homemaker Focus' },
                { id: 'flexible', label: '🤝 Flexible / Open' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDualIncomePreference(opt.id as any)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    dualIncomePreference === opt.id
                      ? 'border-primary bg-pastel-sky text-primary font-bold shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Smoking & Substance */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Smoking / Vaping Status</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'non_smoker', label: 'Non-Smoker' },
                { id: 'trying_to_quit', label: 'Trying to Quit' },
                { id: 'occasional', label: 'Occasional' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSmokingStatus(opt.id as any)}
                  className={`py-2 px-1.5 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    smokingStatus === opt.id
                      ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Languages Spoken */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Languages Spoken</label>
            <input
              type="text"
              value={languagesSpoken}
              onChange={(e) => setLanguagesSpoken(e.target.value)}
              placeholder="e.g. English, Arabic, Urdu, French"
              className="w-full bg-white border border-outline rounded-2xl px-3.5 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle"
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-4">
        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Continue to Career & Intent</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default FamilyLifestyleScreen;


