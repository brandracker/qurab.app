import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Users, 
  HeartHandshake, 
  Sparkles, 
  FileCheck2, 
  Heart, 
  Baby, 
  Briefcase, 
  Scale, 
  ShieldCheck, 
  Cigarette, 
  Check, 
  CheckCircle2, 
  Circle 
} from 'lucide-react';

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
    <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-background font-sans overflow-y-auto pb-24 select-none text-on-surface">
      {/* Top Header & Progress */}
      <div>
        <div className="flex items-center justify-between mb-3 pt-1">
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
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { 
                  id: 'independent', 
                  label: 'Independent Household', 
                  desc: 'Desire separate private home from in-laws',
                  icon: Home,
                  colorBg: 'bg-emerald-50 text-emerald-600 border-emerald-200'
                },
                { 
                  id: 'with_in_laws', 
                  label: 'Joint Living with Family', 
                  desc: 'Living with parents / family home',
                  icon: Users,
                  colorBg: 'bg-amber-50 text-amber-600 border-amber-200'
                },
                { 
                  id: 'flexible', 
                  label: 'Flexible / Open to Discussion', 
                  desc: 'Willing to adapt as circumstances allow',
                  icon: HeartHandshake,
                  colorBg: 'bg-sky-50 text-sky-600 border-sky-200'
                }
              ].map(opt => {
                const IconComp = opt.icon;
                const isSelected = livingPreference === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLivingPreference(opt.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-primary bg-pastel-rose text-on-surface shadow-subtle ring-1 ring-primary'
                        : 'border-outline bg-white hover:bg-surface-variant text-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${opt.colorBg} shrink-0 shadow-2xs`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-on-surface truncate">{opt.label}</h4>
                        <p className="text-[10px] text-secondary mt-0.5 leading-tight">{opt.desc}</p>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-outline shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Family Structure */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Family Structure</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { 
                  id: 'nuclear', 
                  label: 'Nuclear Family', 
                  sub: 'Parents & Children',
                  Icon: Home,
                  colorBg: 'bg-rose-50 text-rose-600 border-rose-200'
                },
                { 
                  id: 'joint', 
                  label: 'Joint Extended Family', 
                  sub: 'Extended Multi-Generational',
                  Icon: Users,
                  colorBg: 'bg-amber-50 text-amber-600 border-amber-200'
                }
              ].map(opt => {
                const IconComponent = opt.Icon;
                const isSelected = familyStructure === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFamilyStructure(opt.id as any)}
                    className={`p-3 rounded-2xl text-center border transition-all flex flex-col items-center gap-1.5 relative ${
                      isSelected
                        ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle ring-1 ring-primary'
                        : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${opt.colorBg} shadow-2xs`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface block leading-tight">{opt.label}</span>
                      <span className="text-[9px] text-secondary block mt-0.5">{opt.sub}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
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
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-brand scale-102'
                        : 'border-outline bg-white text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    {cnt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marital Status (Professional Colorful Icons replacing Emojis) */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Marital Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { 
                  id: 'never_married', 
                  label: 'Never Married', 
                  icon: Sparkles,
                  colorBg: 'bg-rose-50 text-primary border-rose-200'
                },
                { 
                  id: 'divorced', 
                  label: 'Divorced', 
                  icon: FileCheck2,
                  colorBg: 'bg-blue-50 text-blue-600 border-blue-200'
                },
                { 
                  id: 'widowed', 
                  label: 'Widowed', 
                  icon: Heart,
                  colorBg: 'bg-purple-50 text-purple-600 border-purple-200'
                },
                { 
                  id: 'single_parent', 
                  label: 'Single Parent', 
                  icon: Baby,
                  colorBg: 'bg-amber-50 text-amber-600 border-amber-200'
                }
              ].map(opt => {
                const IconComp = opt.icon;
                const isSelected = maritalStatus === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMaritalStatus(opt.id as any)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                      isSelected
                        ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle ring-1 ring-primary'
                        : 'border-outline bg-white text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${opt.colorBg} shadow-2xs`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold block leading-tight">{opt.label}</span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual-Income / Career Support (Professional Icons replacing Emojis) */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Dual-Income & Working Spouse</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { 
                  id: 'career_supportive', 
                  label: 'Career Supportive', 
                  sub: 'Dual-income welcome',
                  icon: Briefcase,
                  colorBg: 'bg-indigo-50 text-indigo-600 border-indigo-200'
                },
                { 
                  id: 'homemaker_focused', 
                  label: 'Homemaker Focus', 
                  sub: 'Home & family focus',
                  icon: Home,
                  colorBg: 'bg-rose-50 text-rose-600 border-rose-200'
                },
                { 
                  id: 'flexible', 
                  label: 'Flexible / Open', 
                  sub: 'Mutually adaptable',
                  icon: Scale,
                  colorBg: 'bg-purple-50 text-purple-600 border-purple-200'
                }
              ].map(opt => {
                const IconComp = opt.icon;
                const isSelected = dualIncomePreference === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDualIncomePreference(opt.id as any)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                      isSelected
                        ? 'border-primary bg-pastel-sky text-primary font-bold shadow-subtle ring-1 ring-primary'
                        : 'border-outline bg-white text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${opt.colorBg} shadow-2xs`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-[11px] font-bold leading-tight">{opt.label}</strong>
                      <span className="text-[9px] text-secondary block leading-tight mt-0.5">{opt.sub}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smoking & Substance */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Smoking / Vaping Status</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { 
                  id: 'non_smoker', 
                  label: 'Non-Smoker', 
                  icon: ShieldCheck,
                  colorBg: 'bg-emerald-50 text-emerald-600 border-emerald-200'
                },
                { 
                  id: 'trying_to_quit', 
                  label: 'Trying to Quit', 
                  icon: Sparkles,
                  colorBg: 'bg-amber-50 text-amber-600 border-amber-200'
                },
                { 
                  id: 'occasional', 
                  label: 'Occasional', 
                  icon: Cigarette,
                  colorBg: 'bg-slate-50 text-slate-600 border-slate-200'
                }
              ].map(opt => {
                const IconComp = opt.icon;
                const isSelected = smokingStatus === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSmokingStatus(opt.id as any)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                      isSelected
                        ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle ring-1 ring-primary'
                        : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${opt.colorBg} shadow-2xs`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-on-surface">{opt.label}</span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
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
              className="w-full bg-white border border-outline rounded-2xl px-3.5 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium"
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-5">
        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Career & Intent</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default FamilyLifestyleScreen;
