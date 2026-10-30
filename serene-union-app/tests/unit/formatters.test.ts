import { describe, it, expect } from 'vitest';
import { formatDisplayName, formatTimeline } from '../../src/utils/formatters';

describe('formatDisplayName', () => {
  it('cleans database underscores and multiple spaces (e.g. Nazm_ _e-Dil)', () => {
    expect(formatDisplayName('Nazm_ _e-Dil')).toBe('Nazm e-Dil');
    expect(formatDisplayName('Nazm__e_Dil')).toBe('Nazm e Dil');
    expect(formatDisplayName('Nazm_ _e Dil')).toBe('Nazm e Dil');
  });

  it('converts all-lowercase names to clean Title Case', () => {
    expect(formatDisplayName('waleed khan')).toBe('Waleed Khan');
    expect(formatDisplayName('tameer raza')).toBe('Tameer Raza');
    expect(formatDisplayName('roman')).toBe('Roman');
  });

  it('converts all-uppercase names to clean Title Case', () => {
    expect(formatDisplayName('FARHAN ASIF')).toBe('Farhan Asif');
    expect(formatDisplayName('MUHAMMAD ALI')).toBe('Muhammad Ali');
  });

  it('preserves properly formatted mixed case names', () => {
    expect(formatDisplayName('Faisal Sheikh')).toBe('Faisal Sheikh');
    expect(formatDisplayName('Bilal Ahmad')).toBe('Bilal Ahmad');
  });

  it('strips spurious checkmarks and symbols', () => {
    expect(formatDisplayName('Bilal Ahmad ✓')).toBe('Bilal Ahmad');
    expect(formatDisplayName('Fatima ✔')).toBe('Fatima');
  });

  it('handles null, undefined, empty, and generic placeholders', () => {
    expect(formatDisplayName(null)).toBe('Candidate');
    expect(formatDisplayName(undefined)).toBe('Candidate');
    expect(formatDisplayName('')).toBe('Candidate');
    expect(formatDisplayName('Candidate')).toBe('Candidate');
    expect(formatDisplayName('Member', 'Member')).toBe('Member');
  });
});

describe('formatTimeline', () => {
  it('formats right person timeline nicely', () => {
    expect(formatTimeline('right_person')).toBe('When Right Person Found');
    expect(formatTimeline('right person')).toBe('When Right Person Found');
  });

  it('formats relative timelines nicely', () => {
    expect(formatTimeline('within_1_year')).toBe('Within 1 Year');
    expect(formatTimeline('within 1 year')).toBe('Within 1 Year');
    expect(formatTimeline('within_6_months')).toBe('Within 6 Months');
    expect(formatTimeline('within_2_years')).toBe('Within 2 Years');
  });

  it('formats immediate timeline', () => {
    expect(formatTimeline('immediate')).toBe('Ready to Marry');
    expect(formatTimeline('asap')).toBe('Ready to Marry');
  });

  it('handles empty or custom timelines', () => {
    expect(formatTimeline('')).toBe('');
    expect(formatTimeline(null)).toBe('');
    expect(formatTimeline('flexible_timeline')).toBe('Flexible Timeline');
  });
});
