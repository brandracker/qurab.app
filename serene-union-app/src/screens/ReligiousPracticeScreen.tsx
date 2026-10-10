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
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-b from-[#FF2560] via-[#F31A56] to-[#DE0E46] font-sans overflow-y-auto pb-24 select-none text-white transition-all">
      <div>
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between mb-3 pt-1">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white text-[#FF2560] flex items-center justify-center hover:bg-white/90 active:scale-95 transition-all shadow-md cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-xs">
            <span className="text-[11px] font-bold text-white tracking-wider uppercase">Step 2 of 5</span>
            <span className="text-[11px] font-medium text-white/90">· Deen Routine</span>
          </div>
          <div className="w-9" />
        </div>

        {/* 5-Step Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-4 px-0.5">
          <div className="h-2 rounded-full bg-white/70" />
          <div className="h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] scale-y-110" />
          <div className="h-2 rounded-full bg-white/25" />
          <div className="h-2 rounded-full bg-white/25" />
          <div className="h-2 rounded-full bg-white/25" />
        </div>

        <div className="px-1 mb-2">
          <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
            Deen & Religious Routine
          </h1>
          <p className="text-xs text-white/90 leading-relaxed font-medium">
            Sharing your daily relationship with faith ensures lifelong spiritual alignment.
          </p>
        </div>

        {/* Floating White Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] space-y-4 text-slate-900 border border-white/60">
          {/* Practice Level */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Practice Level</label>
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
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    practiceLevel === opt.id
                      ? 'border-primary border-[#FF2560] bg-[#FFF0F3] text-primary text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  <strong className="text-xs block font-bold">{opt.label}</strong>
                  <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sect & Madhhab */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Sect / Tradition</label>
              <select
                value={sect}
                onChange={(e) => setSect(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF2560] shadow-2xs font-semibold cursor-pointer"
              >
                <option value="Sunni">Sunni</option>
                <option value="Shia">Shia</option>
                <option value="Just Muslim">Just Muslim</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">School / Madhhab</label>
              <select
                value={madhhab}
                onChange={(e) => setMadhhab(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF2560] shadow-2xs font-semibold cursor-pointer"
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
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Prayer Frequency (Salah)</label>
            <div className="grid grid-cols-3 gap-2">
              {['5 times daily', 'Most prayers', 'Friday only'].map(freq => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setPrayerFrequency(freq)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all cursor-pointer ${
                    prayerFrequency === freq
                      ? 'border-primary border-[#FF2560] bg-[#FFF0F3] text-primary text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Standard */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Dietary Standard</label>
            <div className="grid grid-cols-3 gap-2">
              {['Strictly Halal', 'Zabiha Only', 'Halal & Kosher'].map(diet => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setHalalDiet(diet)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all cursor-pointer ${
                    halalDiet === diet
                      ? 'border-primary border-[#FF2560] bg-[#FFF0F3] text-primary text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Quran Recitation */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Quran Engagement</label>
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
                  className={`py-2 rounded-xl border text-[11px] font-semibold text-center transition-all cursor-pointer ${
                    quranRecitation === opt.id
                      ? 'border-[#FF2560] bg-[#FF2560] text-white font-bold shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modesty & Sunnah Routine */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Modesty & Dressing Style</label>
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
                  className={`py-2 px-1 rounded-xl border text-[10px] font-semibold text-center transition-all cursor-pointer ${
                    modestyPractice === opt.id
                      ? 'border-primary border-[#FF2560] bg-[#FFF0F3] text-primary text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hajj & Umrah */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Hajj & Umrah Status</label>
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
                  className={`py-2 rounded-xl border text-[11px] font-semibold text-center transition-all cursor-pointer ${
                    hajjUmrahStatus === opt.id
                      ? 'border-amber-400 bg-amber-50 text-amber-800 font-bold shadow-sm ring-1 ring-amber-300'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
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
      <div className="pt-5">
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-full bg-white text-[#FF2560] font-sans text-xs font-bold shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:bg-white/95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue to Family & Lifestyle</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
export default ReligiousPracticeScreen;


