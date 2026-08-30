import React, { useState } from 'react';
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
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Step 2 of 5</span>
          <div className="w-10" />
        </div>

        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mb-6">
          <div className="bg-primary h-full w-[40%] transition-all duration-300" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
          Deen & Religious Routine
        </h1>
        <p className="text-xs text-secondary mb-6 leading-relaxed">
          Sharing your relationship with faith ensures deep spiritual alignment.
        </p>

        <div className="space-y-6">
          {/* Practice Level */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Practice Level</label>
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
                      ? 'border-primary bg-primary/10 text-on-surface shadow-sm'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  <strong className="text-xs block text-on-surface">{opt.label}</strong>
                  <span className="text-[10px] text-secondary leading-tight block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sect & Madhhab */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Sect / Tradition</label>
              <select
                value={sect}
                onChange={(e) => setSect(e.target.value as any)}
                className="w-full bg-surface-container-high border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Sunni">Sunni</option>
                <option value="Shia">Shia</option>
                <option value="Just Muslim">Just Muslim</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">School / Madhhab</label>
              <select
                value={madhhab}
                onChange={(e) => setMadhhab(e.target.value)}
                className="w-full bg-surface-container-high border border-surface-variant rounded-2xl px-3 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary"
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
            <label className="block text-xs font-bold text-on-surface mb-2">Prayer Frequency (Salah)</label>
            <div className="grid grid-cols-3 gap-2">
              {['5 times daily', 'Most prayers', 'Friday only'].map(freq => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setPrayerFrequency(freq)}
                  className={`py-2.5 px-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    prayerFrequency === freq
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Standard */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Dietary Standard</label>
            <div className="grid grid-cols-3 gap-2">
              {['Strictly Halal', 'Zabiha Only', 'Halal & Kosher'].map(diet => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setHalalDiet(diet)}
                  className={`py-2.5 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    halalDiet === diet
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Quran Recitation */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Quran Engagement</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'daily', label: 'Daily' },
                { id: 'regular', label: 'Regular' },
                { id: 'learning', label: 'Learning' },
                { id: 'hafiz', label: 'Hafiz/Hafiza' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setQuranRecitation(opt.id)}
                  className={`py-2.5 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    quranRecitation === opt.id
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modesty & Sunnah Routine */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Modesty & Dressing Style</label>
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
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hajj & Umrah */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Hajj & Umrah Status</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'performed', label: 'Performed' },
                { id: 'planning', label: 'Planning Soon' },
                { id: 'not_yet', label: 'Not Yet' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setHajjUmrahStatus(opt.id)}
                  className={`py-2.5 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    hajjUmrahStatus === opt.id
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-surface-variant bg-surface text-secondary hover:bg-surface-container-low'
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
      <div className="pt-6">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-full bg-primary text-on-primary font-sans text-xs font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Family & Lifestyle</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
