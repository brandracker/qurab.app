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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4">
      <div className="w-full max-w-[480px] bg-surface rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl border border-surface-variant overflow-hidden animate-slide-up">
        {/* Header */}
        <header className="sticky top-0 bg-surface/95 backdrop-blur-md px-6 py-4 border-b border-surface-variant flex items-center justify-between z-10">
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-primary hover:bg-surface-variant rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="font-serif text-lg font-bold text-primary">Preferences & Filters</h2>
          <button onClick={handleReset} className="text-xs font-semibold text-secondary hover:text-primary transition-colors">
            Reset
          </button>
        </header>

        {/* Scrollable Filters Content */}
        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Age Range Slider */}
          <section className="border-b border-surface-variant/40 pb-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-serif text-base font-semibold text-on-surface">Age Range</h3>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {filters.minAge} - {filters.maxAge} years
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="60"
              value={filters.maxAge}
              onChange={(e) => setFilters(prev => ({ ...prev, maxAge: Number(e.target.value) }))}
              className="w-full accent-primary-container h-2 bg-surface-variant rounded-lg cursor-pointer"
            />
          </section>

          {/* Distance */}
          <section className="border-b border-surface-variant/40 pb-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-serif text-base font-semibold text-on-surface">Maximum Distance</h3>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {filters.maxDistance} miles
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              value={filters.maxDistance}
              onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
              className="w-full accent-primary-container h-2 bg-surface-variant rounded-lg cursor-pointer"
            />
          </section>

          {/* Sect */}
          <section className="border-b border-surface-variant/40 pb-5">
            <h3 className="font-serif text-base font-semibold text-on-surface mb-3">Sect / Tradition</h3>
            <div className="flex flex-col gap-2.5">
              {(['Sunni', 'Shia', 'Just Muslim', 'Other'] as Sect[]).map((sect) => (
                <label key={sect} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.sects.includes(sect)}
                    onChange={() => toggleSect(sect)}
                    className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container accent-primary-container"
                  />
                  <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{sect}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Practice Level */}
          <section className="border-b border-surface-variant/40 pb-5">
            <h3 className="font-serif text-base font-semibold text-on-surface mb-3">Religious Practice Level</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Practicing', val: 'practicing' },
                { label: 'Moderately Practicing', val: 'moderately_practicing' },
                { label: 'Cultural Muslim', val: 'cultural' },
                { label: 'Revert to Islam', val: 'revert' }
              ].map(item => (
                <label key={item.val} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.practiceLevels.includes(item.val as PracticeLevel)}
                    onChange={() => togglePractice(item.val as PracticeLevel)}
                    className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container accent-primary-container"
                  />
                  <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{item.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Marriage Timeline */}
          <section className="pb-4">
            <h3 className="font-serif text-base font-semibold text-on-surface mb-3">Marriage Intent Timeline</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Marriage within 1 year', val: 'within_1_year' },
                { label: 'When I find the right person', val: 'right_person' },
                { label: 'Just exploring / Intentional', val: 'exploring' }
              ].map(item => (
                <label key={item.val} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.marriageTimelines.includes(item.val as MarriageTimeline)}
                    onChange={() => toggleTimeline(item.val as MarriageTimeline)}
                    className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container accent-primary-container"
                  />
                  <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{item.label}</span>
                </label>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="p-4 bg-surface border-t border-surface-variant flex gap-3">
          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="w-full py-3.5 bg-primary text-on-primary rounded-full font-medium text-sm hover:brightness-105 transition-all shadow-md"
          >
            Apply Filters
          </button>
        </footer>
      </div>
    </div>
  );
};
