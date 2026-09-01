import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { PracticeLevel, Sect } from '../types';

interface Props {
  data?: {
    practiceLevel?: PracticeLevel;
    sect?: Sect;
    madhhab?: string;
    prayerFrequency?: string;
    halalDiet?: string;
    quranRecitation?: string;
    modestyPractice?: string;
    hajjUmrahStatus?: string;
  };
  onBack: () => void;
  onContinue: (relData: any) => void;
}

export const ReligiousPracticeScreen: React.FC<Props> = ({ data, onBack, onContinue }) => {
  const [practiceLevel, setPracticeLevel] = useState<PracticeLevel>(data?.practiceLevel || 'practicing');
  const [sect, setSect] = useState<Sect>(data?.sect || 'Sunni');
  const [madhhab, setMadhhab] = useState<string>(data?.madhhab || 'Hanafi');
  const [prayerFrequency, setPrayerFrequency] = useState<string>(data?.prayerFrequency || '5 times daily');
  const [halalDiet, setHalalDiet] = useState<string>(data?.halalDiet || 'Strictly Halal');
  const [quranRecitation, setQuranRecitation] = useState<string>(data?.quranRecitation || 'daily');
  const [modestyPractice, setModestyPractice] = useState<string>(data?.modestyPractice || 'modest');
  const [hajjUmrahStatus, setHajjUmrahStatus] = useState<string>(data?.hajjUmrahStatus || 'planning');

  const handleNext = () => {
    onContinue({
      practiceLevel,
      sect,
      madhhab,
      prayerFrequency,
      halalDiet,
      quranRecitation,
      modestyPractice,
      hajjUmrahStatus
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
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Step 2 of 5</span>
            <span className="text-[11px] text-secondary">· Deen Routine</span>
          </div>
          <div className="w-9" />
        </div>

        {/* 5-Step Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
          Deen & Religious Routine
        </h1>
        <p className="text-xs text-secondary mb-4 leading-relaxed">
          Sharing your daily relationship with faith ensures lifelong spiritual alignment.
        </p>

        <div className="space-y-4">
          {/* Practice Level */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Practice Level</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'practicing', label: 'Practicing', desc: '5 Daily prayers & Halal life' },
                { id: 'moderately_practicing', label: 'Moderate', desc: 'Striving & growing on deen' },
                { id: 'revert', label: 'Muslim Revert', desc: 'Embraced Islam, active learner' },
                { id: 'cultural', label: 'Cultural', desc: 'Connected through heritage' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPracticeLevel(opt.id as any)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    practiceLevel === opt.id
                      ? 'border-primary bg-pastel-rose text-on-surface shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  <strong className="text-xs block text-on-surface font-bold">{opt.label}</strong>
                  <span className="text-[10px] text-secondary leading-tight block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sect & Madhhab */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Sect / Tradition</label>
              <select
                value={sect}
                onChange={(e) => setSect(e.target.value as any)}
                className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium"
              >
                <option value="Sunni">Sunni</option>
                <option value="Shia">Shia</option>
                <option value="Just Muslim">Just Muslim</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">School / Madhhab</label>
              <select
                value={madhhab}
                onChange={(e) => setMadhhab(e.target.value)}
                className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium"
              >
                <option value="Hanafi">Hanafi</option>
                <option value="Shafi'i">Shafi'i</option>
                <option value="Maliki">Maliki</option>
                <option value="Hanbali">Hanbali</option>
                <option value="Jafari">Jafari</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Daily Prayers (Salah) */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Prayer Frequency (Salah)</label>
            <div className="grid grid-cols-3 gap-2">
              {['5 times daily', 'Most prayers', 'Friday only'].map(freq => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setPrayerFrequency(freq)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    prayerFrequency === freq
                      ? 'border-primary bg-pastel-mint text-pastel-mint-text font-bold shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Standard */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Dietary Standard</label>
            <div className="grid grid-cols-3 gap-2">
              {['Strictly Halal', 'Zabiha Only', 'Halal & Kosher'].map(diet => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setHalalDiet(diet)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    halalDiet === diet
                      ? 'border-primary bg-pastel-mint text-pastel-mint-text font-bold shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Quran Recitation */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Quran Engagement</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'daily', label: 'Daily' },
                { id: 'regular', label: 'Regular' },
                { id: 'learning', label: 'Learning' },
                { id: 'hafiz', label: 'Hafiz' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setQuranRecitation(opt.id)}
                  className={`py-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    quranRecitation === opt.id
                      ? 'border-primary bg-primary text-white shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modesty & Sunnah Routine */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Modesty & Dressing Style</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sunnah_beard', label: 'Sunnah Beard' },
                { id: 'hijab_abaya', label: 'Hijab / Abaya' },
                { id: 'niqab', label: 'Niqab' },
                { id: 'modest', label: 'Modest Western' },
                { id: 'traditional', label: 'Traditional' },
                { id: 'striving', label: 'Striving' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setModestyPractice(opt.id)}
                  className={`py-2 px-1 rounded-xl border text-[10px] font-semibold text-center transition-all ${
                    modestyPractice === opt.id
                      ? 'border-primary bg-pastel-rose text-primary font-bold shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hajj & Umrah */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">Hajj & Umrah Status</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'performed', label: '🕋 Performed' },
                { id: 'planning', label: '🕊️ Planning Soon' },
                { id: 'not_yet', label: 'Not Yet' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setHajjUmrahStatus(opt.id)}
                  className={`py-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    hajjUmrahStatus === opt.id
                      ? 'border-primary bg-pastel-amber text-pastel-amber-text font-bold shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-4">
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Continue to Family & Lifestyle</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default ReligiousPracticeScreen;


