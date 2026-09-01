import React, { useState } from 'react';

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
    <div className="w-full h-full flex flex-col justify-between p-6 bg-background font-sans overflow-y-auto pb-28 select-none">
      {/* Top Header & Progress */}
      <div>
        <div className="flex items-center justify-between mb-3 pt-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-surface border border-surface-variant/80 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Step 3 of 5</span>
            <span className="text-[11px] text-secondary">· Family</span>
          </div>
          <div className="w-10" />
        </div>

        {/* 5-Step Glowing Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-6">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-light shadow-emerald" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface mb-1">
          Family & Living Outlook
        </h1>
        <p className="text-xs text-secondary mb-5 leading-relaxed">
          Living preferences and family values are essential for lifelong marital harmony.
        </p>

        <div className="space-y-5">
          {/* Post-Marriage Living Arrangement */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              Post-Marriage Living Arrangement <span className="text-primary">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: 'independent', label: '🏡 Independent Household', desc: 'Desire separate private home from in-laws' },
                { id: 'with_in_laws', label: '👨‍👩‍👧‍👦 Joint Living with Family', desc: 'Living with parents / family home' },
                { id: 'flexible', label: '🤝 Flexible / Open to Discussion', desc: 'Willing to adapt as circumstances allow' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLivingPreference(opt.id as any)}
                  className={`p-3.5 rounded-2xl text-left border transition-all flex items-start justify-between ${
                    livingPreference === opt.id
                      ? 'border-primary bg-primary/10 text-on-surface shadow-xs ring-1 ring-primary'
                      : 'border-surface-variant bg-surface hover:bg-surface-variant/40 text-on-surface-variant'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold">{opt.label}</h4>
                    <p className="text-[11px] text-secondary mt-0.5">{opt.desc}</p>
                  </div>
                  <span className={`material-symbols-outlined text-[18px] ${livingPreference === opt.id ? 'text-primary fill' : 'text-outline'}`}>
                    {livingPreference === opt.id ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Family Structure */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Family Structure</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'nuclear', label: 'Nuclear Family', icon: 'home' },
                { id: 'joint', label: 'Joint Extended Family', icon: 'groups' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFamilyStructure(opt.id as any)}
                  className={`p-3.5 rounded-2xl text-center border transition-all flex flex-col items-center gap-1.5 ${
                    familyStructure === opt.id
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs ring-1 ring-primary'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{opt.icon}</span>
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Siblings Count */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Number of Siblings</label>
            <div className="flex items-center gap-2.5">
              {[0, 1, 2, 3, 4, '5+'].map((cnt, idx) => {
                const val = typeof cnt === 'number' ? cnt : 5;
                const isSelected = siblingsCount === val;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSiblingsCount(val)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-2xs'
                        : 'border-surface-variant bg-surface text-on-surface hover:bg-surface-variant/40'
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
            <label className="block text-xs font-bold text-on-surface mb-2">Marital Status</label>
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
                  className={`py-2.5 px-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    maritalStatus === opt.id
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dual-Income / Career Support */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Dual-Income & Working Spouse</label>
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
                  className={`py-2.5 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    dualIncomePreference === opt.id
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Smoking & Substance */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Smoking / Vaping Status</label>
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
                  className={`py-2.5 px-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    smokingStatus === opt.id
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Languages Spoken */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Languages Spoken</label>
            <input
              type="text"
              value={languagesSpoken}
              onChange={(e) => setLanguagesSpoken(e.target.value)}
              placeholder="e.g. English, Arabic, Urdu, French"
              className="w-full bg-surface border border-surface-variant rounded-2xl px-4 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-6">
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-full bg-gradient-to-r from-primary via-primary to-primary-light text-white font-sans text-xs font-bold shadow-emerald hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Career & Intent</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

