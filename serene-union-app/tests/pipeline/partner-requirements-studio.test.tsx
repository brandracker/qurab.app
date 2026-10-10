import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { YourIntentScreen } from '../../src/screens/YourIntentScreen';

describe('Real-World Pipeline: 8-Step Interactive Onboarding & Partner Requirements UX', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. Renders 8-step micro-progress tracker and allows direct step navigation', () => {
    render(
      <YourIntentScreen
        data={{
          profession: 'Software Engineer',
          bio: 'Practicing Muslim seeking a pious and caring spouse.',
          partnerRequirements: {
            minAge: 22,
            maxAge: 29,
            maritalStatus: 'never_married',
            practiceLevel: 'very_practicing',
            relocation: 'open'
          }
        }}
        onBack={() => {}}
        onContinue={() => {}}
      />
    );

    // Initial state: Step 1 of 8 (Career)
    expect(screen.getByText(/Step 1 of 8/i)).toBeDefined();
    expect(screen.getByText(/Professional Background/i)).toBeDefined();

    // Navigate to Step 5 (Spouse Age) via title button in progress tracker
    const step5Button = screen.getByTitle('Spouse Age');
    expect(step5Button).toBeDefined();
    fireEvent.click(step5Button);

    // Assert Step 5 is active
    expect(screen.getByText(/Step 5 of 8/i)).toBeDefined();
    expect(screen.getByText(/Spouse Preference: Age Bracket/i)).toBeDefined();
  });

  it('2. Clicking quick age presets in Step 5 dynamically updates the preferred age range', () => {
    render(
      <YourIntentScreen
        data={{
          profession: 'Doctor',
          bio: 'Devoted to patient care and Islamic ethics.',
          partnerRequirements: {
            minAge: 20,
            maxAge: 35
          }
        }}
        onBack={() => {}}
        onContinue={() => {}}
      />
    );

    // Jump to Step 5 (Spouse Age)
    fireEvent.click(screen.getByTitle('Spouse Age'));

    // Click preset "26 – 33 yrs"
    const presetBtn = screen.getByRole('button', { name: /26 – 33 yrs/i });
    fireEvent.click(presetBtn);

    // Age badge should now display "26 – 33 years"
    expect(screen.getByText(/26 – 33 years/i)).toBeDefined();
  });

  it('3. Toggles strict age dealbreaker and non-negotiables in Step 7 Dealbreakers Hub', () => {
    const handleContinue = vi.fn();
    render(
      <YourIntentScreen
        data={{
          profession: 'Architect',
          bio: 'Loving design, Sunnah lifestyle, and seeking family blessings.',
          partnerRequirements: {
            minAge: 24,
            maxAge: 30,
            dealbreakers: ['non_smoker']
          }
        }}
        onBack={() => {}}
        onContinue={handleContinue}
      />
    );

    // Step 5: Toggle strict age dealbreaker
    fireEvent.click(screen.getByTitle('Spouse Age'));
    const ageDealbreakerToggle = screen.getByText(/Strict Age Dealbreaker/i);
    fireEvent.click(ageDealbreakerToggle);

    // Step 7: Toggle 5x Daily Salah in dealbreakers hub
    fireEvent.click(screen.getByTitle('Dealbreakers'));
    const salahDealbreaker = screen.getByRole('button', { name: /5x Daily Salah/i });
    fireEvent.click(salahDealbreaker);

    // Click continue
    const continueBtn = screen.getByRole('button', { name: /continue to photos/i });
    fireEvent.click(continueBtn);

    expect(handleContinue).toHaveBeenCalledTimes(1);
    const submitted = handleContinue.mock.calls[0][0];
    expect(submitted.partnerRequirements.strictAgeDealbreaker).toBe(true);
    expect(submitted.partnerRequirements.dealbreakers).toContain('non_smoker');
    expect(submitted.partnerRequirements.dealbreakers).toContain('daily_salah');
  });

  it('4. If required fields are missing, switches back to relevant step and alerts user', () => {
    const handleContinue = vi.fn();
    render(
      <YourIntentScreen
        data={{
          profession: '', // Missing required field!
          bio: 'Short', // Less than 15 chars!
        }}
        onBack={() => {}}
        onContinue={handleContinue}
      />
    );

    // Move to Step 5
    fireEvent.click(screen.getByTitle('Spouse Age'));

    // Try submitting directly
    const continueBtn = screen.getByRole('button', { name: /continue to photos/i });
    fireEvent.click(continueBtn);

    // Must NOT proceed
    expect(handleContinue).not.toHaveBeenCalled();

    // Must show alert banner and error text
    expect(screen.getByText(/Please complete all highlighted required fields before continuing/i)).toBeDefined();
    expect(screen.getByText(/Current profession or job title is required/i)).toBeDefined();

    // Must have automatically redirected back to Step 1 (Career)
    expect(screen.getByText(/Step 1 of 8/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Senior Software Architect, Doctor, Entrepreneur/i)).toBeDefined();
  });
});
