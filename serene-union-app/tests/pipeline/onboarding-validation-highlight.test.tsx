import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BasicInfoScreen } from '../../src/screens/BasicInfoScreen';
import { YourIntentScreen } from '../../src/screens/YourIntentScreen';
import { CreateProfileScreen } from '../../src/screens/CreateProfileScreen';

describe('Real-World Pipeline: Onboarding Validation & Red Visual Highlighting', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('1. BasicInfoScreen Missing Field Highlighting', () => {
    it('shows top error banner and red border highlighting when submitting with empty full name', () => {
      const handleContinue = vi.fn();
      render(
        <BasicInfoScreen
          data={{
            fullName: '',
            gender: 'male',
            dob: '1995-01-01',
            city: 'London',
            country: 'United Kingdom',
            height: "5'10\"",
            ethnicity: 'South Asian',
            citizenship: 'British',
            willingnessToRelocate: 'open'
          }}
          onBack={() => {}}
          onContinue={handleContinue}
        />
      );

      const continueBtn = screen.getByRole('button', { name: /continue to deen/i });
      fireEvent.click(continueBtn);

      // handleContinue must NOT be called
      expect(handleContinue).not.toHaveBeenCalled();

      // Alert banner should appear
      expect(screen.getByText(/Please fill in all highlighted required fields before continuing/i)).toBeDefined();

      // Inline error text should appear
      expect(screen.getByText(/Full name is required/i)).toBeDefined();

      // Input field should have red border styling
      const nameInput = screen.getByPlaceholderText(/e\.g\. Fatima Tariq or Bilal Ahmad/i);
      expect(nameInput.className).toContain('border-rose-500');
    });

    it('clears red highlight when user types into full name input', () => {
      render(
        <BasicInfoScreen
          data={{
            fullName: '',
            gender: 'male',
            dob: '1995-01-01',
            city: 'London',
            country: 'United Kingdom',
            height: "5'10\"",
            ethnicity: 'South Asian',
            citizenship: 'British',
            willingnessToRelocate: 'open'
          }}
          onBack={() => {}}
          onContinue={() => {}}
        />
      );

      const continueBtn = screen.getByRole('button', { name: /continue to deen/i });
      fireEvent.click(continueBtn);

      expect(screen.getByText(/Full name is required/i)).toBeDefined();

      const nameInput = screen.getByPlaceholderText(/e\.g\. Fatima Tariq or Bilal Ahmad/i);
      fireEvent.change(nameInput, { target: { value: 'Zayd Khan' } });

      // Inline error should clear
      expect(screen.queryByText(/Full name is required/i)).toBeNull();
      expect(nameInput.className).not.toContain('border-rose-500');
    });
  });

  describe('2. YourIntentScreen Missing Field Highlighting', () => {
    it('visually highlights missing profession and short bio with error messages', () => {
      const handleContinue = vi.fn();
      render(
        <YourIntentScreen
          data={{
            profession: '',
            bio: 'Too short', // less than 15 chars
            timeline: 'within_1_year',
            education: 'BSc Computer Science',
            familyStructure: 'nuclear',
            livingPreference: 'independent',
            childrenDesire: 'desires_children',
            mahrPhilosophy: 'mutual_agreement',
            smokingStatus: 'non_smoker',
            languagesSpoken: 'English, Urdu'
          }}
          onBack={() => {}}
          onContinue={handleContinue}
        />
      );

      const continueBtn = screen.getByRole('button', { name: /continue to photos/i });
      fireEvent.click(continueBtn);

      expect(handleContinue).not.toHaveBeenCalled();

      // Top alert banner
      expect(screen.getByText(/Please complete all highlighted required fields before continuing/i)).toBeDefined();

      // Inline error messages
      expect(screen.getByText(/Current profession or job title is required/i)).toBeDefined();
      expect(screen.getByText(/Your bio must be at least 15 characters/i)).toBeDefined();

      // Profession input and bio textarea have rose border
      const profInput = screen.getByPlaceholderText(/Senior Software Architect, Doctor, Entrepreneur/i);
      expect(profInput.className).toContain('border-rose-500');

      const bioTextarea = screen.getByPlaceholderText(/Share what practicing Islam means/i);
      expect(bioTextarea.className).toContain('border-rose-500');
    });

    it('passes validation when profession and comprehensive bio are supplied', () => {
      const handleContinue = vi.fn();
      render(
        <YourIntentScreen
          data={{
            profession: 'Software Engineer',
            bio: 'Seeking a pious spouse on the Quran and Sunnah with good akhlaq and character.',
            timeline: 'within_1_year',
            education: 'BSc Computer Science',
            familyStructure: 'nuclear',
            livingPreference: 'independent',
            childrenDesire: 'desires_children',
            mahrPhilosophy: 'mutual_agreement',
            smokingStatus: 'non_smoker',
            languagesSpoken: 'English, Urdu'
          }}
          onBack={() => {}}
          onContinue={handleContinue}
        />
      );

      const continueBtn = screen.getByRole('button', { name: /continue to photos/i });
      fireEvent.click(continueBtn);

      expect(handleContinue).toHaveBeenCalledTimes(1);
      const submitted = handleContinue.mock.calls[0][0];
      expect(submitted.profession).toBe('Software Engineer');
      expect(submitted.bio).toContain('Seeking a pious spouse');
    });
  });

  describe('3. CreateProfileScreen Photo Validation', () => {
    it('shows photo requirement alert and prevents submission when zero photos are uploaded', () => {
      const handleComplete = vi.fn();
      render(
        <CreateProfileScreen
          data={{
            photos: []
          }}
          onBack={() => {}}
          onComplete={handleComplete}
        />
      );

      const submitBtn = screen.getByRole('button', { name: /complete matrimonial profile/i });
      fireEvent.click(submitBtn);

      expect(handleComplete).not.toHaveBeenCalled();

      // Alert should be displayed
      expect(screen.getByText(/Please upload at least 1 clear profile photo/i)).toBeDefined();
    });
  });
});
