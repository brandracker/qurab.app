import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BasicInfoScreen } from '../../src/screens/BasicInfoScreen';
import { dbService } from '../../src/services/dbService';

describe('Real-World Pipeline: 5-Step Onboarding Biodata Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. BasicInfoScreen honors pre-filled gender if provided from Auth', () => {
    const handleContinue = vi.fn();
    render(
      <BasicInfoScreen
        data={{
          fullName: 'Aisha Al-Mansoor',
          gender: 'female',
          dob: '1999-05-15',
          location: 'London, UK',
          height: "5'6\"",
          ethnicity: 'Arab',
          citizenship: 'British',
          willingnessToRelocate: 'open'
        }}
        onBack={() => {}}
        onContinue={handleContinue}
      />
    );

    // Click continue
    const continueBtn = screen.getByRole('button', { name: /continue to deen/i });
    fireEvent.click(continueBtn);

    expect(handleContinue).toHaveBeenCalled();
    const submitted = handleContinue.mock.calls[0][0];
    expect(submitted.gender).toBe('female');
  });

  it('2. [FLAW DETECTION TEST] BasicInfoScreen resets Sister to Brother when data.gender is undefined', () => {
    // This reproduces the exact bug when AuthScreen omits gender from onboardingData
    const handleContinue = vi.fn();
    render(
      <BasicInfoScreen
        data={{
          fullName: 'Aisha Al-Mansoor',
          // gender is omitted (the bug!)
          dob: '1999-05-15',
          location: 'London, UK',
          height: "5'6\"",
          ethnicity: 'Arab',
          citizenship: 'British',
          willingnessToRelocate: 'open'
        }}
        onBack={() => {}}
        onContinue={handleContinue}
      />
    );

    const continueBtn = screen.getByRole('button', { name: /continue to deen/i });
    fireEvent.click(continueBtn);

    expect(handleContinue).toHaveBeenCalled();
    const submitted = handleContinue.mock.calls[0][0];
    
    // In the current buggy code, if data.gender is undefined, it defaults to 'male'!
    // This test explicitly asserts that submitted.gender should be 'female' because of fullName,
    // which will FAIL in the current code and reveal the bug!
    expect(submitted.gender).toBe('female');
  });

  it('3. User can explicitly toggle between Brother and Sister in BasicInfoScreen', () => {
    const handleContinue = vi.fn();
    render(
      <BasicInfoScreen
        data={{
          fullName: 'Zayn',
          gender: 'male',
          dob: '1995-02-10',
          location: 'Manchester, UK',
          height: "6'0\"",
          ethnicity: 'South Asian',
          citizenship: 'British',
          willingnessToRelocate: 'open'
        }}
        onBack={() => {}}
        onContinue={handleContinue}
      />
    );

    // Switch gender to Sister
    const sisterBtn = screen.getByRole('button', { name: /sister/i });
    fireEvent.click(sisterBtn);

    const continueBtn = screen.getByRole('button', { name: /continue to deen/i });
    fireEvent.click(continueBtn);

    expect(handleContinue).toHaveBeenCalled();
    const submitted = handleContinue.mock.calls[0][0];
    expect(submitted.gender).toBe('female');
  });
});
