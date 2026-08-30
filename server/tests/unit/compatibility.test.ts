import { describe, it, expect } from 'vitest';

interface MatrimonialProfile {
  practiceLevel: string;
  sect: string;
  prayerFrequency: string;
  halalDiet: string;
  marriageTimeline: string;
  willingnessToRelocate: string;
  childrenDesire: string;
}

function calculateCompatibilityScore(p1: MatrimonialProfile, p2: MatrimonialProfile): number {
  let score = 0;
  let totalWeight = 0;

  // 1. Prayer Frequency (Weight: 25)
  totalWeight += 25;
  if (p1.prayerFrequency === p2.prayerFrequency) {
    score += 25;
  } else if (
    (p1.prayerFrequency === '5 times daily' && p2.prayerFrequency === 'usually') ||
    (p2.prayerFrequency === '5 times daily' && p1.prayerFrequency === 'usually')
  ) {
    score += 15;
  }

  // 2. Practice Level & Sect (Weight: 25)
  totalWeight += 25;
  if (p1.sect === p2.sect) {
    score += 15;
  }
  if (p1.practiceLevel === p2.practiceLevel) {
    score += 10;
  }

  // 3. Halal Diet (Weight: 15)
  totalWeight += 15;
  if (p1.halalDiet === p2.halalDiet) {
    score += 15;
  }

  // 4. Marriage Timeline (Weight: 15)
  totalWeight += 15;
  if (p1.marriageTimeline === p2.marriageTimeline) {
    score += 15;
  } else if (p1.marriageTimeline === 'within_1_year' || p2.marriageTimeline === 'within_1_year') {
    score += 8;
  }

  // 5. Children & Relocation (Weight: 20)
  totalWeight += 20;
  if (p1.childrenDesire === p2.childrenDesire) {
    score += 10;
  }
  if (p1.willingnessToRelocate === 'open' || p2.willingnessToRelocate === 'open' || p1.willingnessToRelocate === p2.willingnessToRelocate) {
    score += 10;
  }

  return Math.round((score / totalWeight) * 100);
}

describe('Halal Matrimonial Compatibility Algorithm', () => {
  it('should calculate 100% compatibility for identical values', () => {
    const profileA: MatrimonialProfile = {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal',
      marriageTimeline: 'within_1_year',
      willingnessToRelocate: 'open',
      childrenDesire: 'desires_children'
    };

    const score = calculateCompatibilityScore(profileA, profileA);
    expect(score).toBe(100);
  });

  it('should calculate high score (>80%) for harmonious practicing profiles', () => {
    const brother: MatrimonialProfile = {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal',
      marriageTimeline: 'within_1_year',
      willingnessToRelocate: 'open',
      childrenDesire: 'desires_children'
    };

    const sister: MatrimonialProfile = {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal',
      marriageTimeline: 'within_1_year',
      willingnessToRelocate: 'same_city',
      childrenDesire: 'desires_children'
    };

    const score = calculateCompatibilityScore(brother, sister);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  it('should calculate lower score when prayer frequency or sect diverge', () => {
    const practicing: MatrimonialProfile = {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal',
      marriageTimeline: 'within_1_year',
      willingnessToRelocate: 'open',
      childrenDesire: 'desires_children'
    };

    const cultural: MatrimonialProfile = {
      practiceLevel: 'cultural',
      sect: 'Other',
      prayerFrequency: 'rarely',
      halalDiet: 'sometimes',
      marriageTimeline: 'exploring',
      willingnessToRelocate: 'no',
      childrenDesire: 'unsure'
    };

    const score = calculateCompatibilityScore(practicing, cultural);
    expect(score).toBeLessThan(40);
  });
});
