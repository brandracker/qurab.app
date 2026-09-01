import React, { useState } from 'react';
import type { FilterState, Sect, PracticeLevel, MarriageTimeline } from '../types';

interface Props {
  filters: FilterState;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export const FilterModal: React.FC<Props> = ({ filters: initialFilters, onClose, onApply }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleSect = (sect: Sect) => {
    setFilters(prev => ({
      ...prev,
      sects: prev.sects.includes(sect)
        ? prev.sects.filter(s => s !== sect)
        : [...prev.sects, sect]
    }));
  };

  const togglePractice = (level: PracticeLevel) => {
    setFilters(prev => ({
      ...prev,
      practiceLevels: prev.practiceLevels.includes(level)
        ? prev.practiceLevels.filter(p => p !== level)
        : [...prev.practiceLevels, level]
    }));
  };

  const toggleTimeline = (tl: MarriageTimeline) => {
    setFilters(prev => ({
      ...prev,
      marriageTimelines: prev.marriageTimelines.includes(tl)
        ? prev.marriageTimelines.filter(t => t !== tl)
        : [...prev.marriageTimelines, tl]
    }));
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      minAge: 18,
      maxAge: 50,
      maxDistance: 50,
      sects: [],
      practiceLevels: [],
      marriageTimelines: [],
      languages: ['English']
    };
    setFilters(defaultFilters);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md px-0 sm:px-4 font-sans animate-fade-in select-none">
      <div className="w-full max-w-[480px] bg-surface rounded-t-[36px] sm:rounded-[36px] max-h-[90vh] flex flex-col shadow-2xl border border-surface-variant/80 overflow-hidden animate-slide-up">
        {/* Header */}
        <header className="sticky top-0 bg-surface/90 backdrop-blur-xl px-6 py-4 border-b border-surface-variant/40 flex items-center justify-between z-10 shadow-2xs">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-on-surface hover:bg-surface-variant rounded-full border border-surface-variant/80 transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
          <div className="flex items-center gap-1.5 font-serif text-base font-bold text-on-surface">
            <span>Preferences & Filters</span>
            <span className="font-arabic text-primary text-xs font-bold">قُرب</span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs font-bold text-primary hover:text-primary-dark transition-colors px-2.5 py-1 rounded-full bg-primary/10"
          >
            Reset
          </button>
        </header>

        {/* Scrollable Filters Content */}
        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Age Range Slider */}
          <section className="border-b border-surface-variant/40 pb-5">
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="font-serif text-sm font-bold text-on-surface">Age Range</h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {filters.minAge} – {filters.maxAge} years
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="60"
              value={filters.maxAge}
              onChange={(e) => setFilters(prev => ({ ...prev, maxAge: Number(e.target.value) }))}
              className="w-full accent-primary h-2 bg-surface-variant rounded-lg cursor-pointer"
            />
          </section>

          {/* Distance */}
          <section className="border-b border-surface-variant/40 pb-5">
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="font-serif text-sm font-bold text-on-surface">Maximum Distance</h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {filters.maxDistance} miles
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              value={filters.maxDistance}
              onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
              className="w-full accent-primary h-2 bg-surface-variant rounded-lg cursor-pointer"
            />
          </section>

          {/* Sect */}
          <section className="border-b border-surface-variant/40 pb-5">
            <h3 className="font-serif text-sm font-bold text-on-surface mb-3">Sect / Tradition</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['Sunni', 'Shia', 'Just Muslim', 'Other'] as Sect[]).map((sect) => {
                const isSelected = filters.sects.includes(sect);
                return (
                  <button
                    key={sect}
                    type="button"
                    onClick={() => toggleSect(sect)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs ring-1 ring-primary'
                        : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                    }`}
                  >
                    <span>{sect}</span>
                    <span className="material-symbols-outlined text-[16px]">
                      {isSelected ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Practice Level */}
          <section className="border-b border-surface-variant/40 pb-5">
            <h3 className="font-serif text-sm font-bold text-on-surface mb-3">Religious Practice Level</h3>
            <div className="space-y-2">
              {[
                { label: 'Practicing (5 Daily Prayers)', val: 'practicing' },
                { label: 'Moderately Practicing (Striving)', val: 'moderately_practicing' },
                { label: 'Cultural Muslim', val: 'cultural' },
                { label: 'Revert to Islam', val: 'revert' }
              ].map(item => {
                const isSelected = filters.practiceLevels.includes(item.val as PracticeLevel);
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => togglePractice(item.val as PracticeLevel)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs ring-1 ring-primary'
                        : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="material-symbols-outlined text-[16px]">
                      {isSelected ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Marriage Timeline */}
          <section className="pb-4">
            <h3 className="font-serif text-sm font-bold text-on-surface mb-3">Marriage Intent Timeline</h3>
            <div className="space-y-2">
              {[
                { label: 'Marriage within 1 year', val: 'within_1_year' },
                { label: 'When I find the right person', val: 'right_person' },
                { label: 'Just exploring / Intentional', val: 'exploring' }
              ].map(item => {
                const isSelected = filters.marriageTimelines.includes(item.val as MarriageTimeline);
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => toggleTimeline(item.val as MarriageTimeline)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs ring-1 ring-primary'
                        : 'border-surface-variant bg-surface text-secondary hover:bg-surface-variant/40'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="material-symbols-outlined text-[16px]">
                      {isSelected ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="p-4 bg-surface border-t border-surface-variant/40 flex gap-3 shadow-card">
          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-primary via-primary to-primary-light text-white rounded-full font-bold text-xs shadow-emerald hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Apply Selected Filters</span>
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
export default FilterModal;

