import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BasicInfoScreen } from '../../src/screens/BasicInfoScreen';
import { CreateProfileScreen } from '../../src/screens/CreateProfileScreen';
import { dbService } from '../../src/services/dbService';

describe('Real-World Pipeline: Boy Profile Edit & Parity Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. BasicInfoScreen preserves male gender and does NOT discard custom city when city is initially null', () => {
    const handleContinue = vi.fn();
    render(
      <BasicInfoScreen
        data={{
          fullName: 'Bilal Ahmed',
          gender: 'male',
          dob: '1996-06-15',
          city: undefined, // Simulates male profile created with null city
          country: 'Pakistan',
          height: "6'0\"",
          ethnicity: 'South Asian',
          citizenship: 'Citizen',
          willingnessToRelocate: 'open'
        }}
        onBack={() => {}}
        onContinue={handleContinue}
      />
    );

    // Enter custom city
    const cityInput = screen.getByPlaceholderText(/e\.g\. London, Lahore, Dallas/i);
    fireEvent.change(cityInput, { target: { value: 'Lahore' } });

    // Click continue
    const continueBtn = screen.getByRole('button', { name: /continue to deen/i });
    fireEvent.click(continueBtn);

    expect(handleContinue).toHaveBeenCalled();
    const submitted = handleContinue.mock.calls[0][0];
    
    // Crucial Assertions:
    expect(submitted.gender).toBe('male');
    expect(submitted.city).toBe('Lahore');
    expect(submitted.fullName).toBe('Bilal Ahmed');
  });

  it('2. CreateProfileScreen in edit mode allows boy to complete updates without mandatory photo re-upload', () => {
    const handleComplete = vi.fn();
    render(
      <CreateProfileScreen
        userId="usr_boy_123"
        initialPhotos={[]}
        isEditMode={true}
        onBack={() => {}}
        onComplete={handleComplete}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /update matrimonial profile/i });
    fireEvent.click(submitBtn);

    expect(handleComplete).toHaveBeenCalled();
    const result = handleComplete.mock.calls[0][0];
    expect(result).toBeDefined();
    expect(Array.isArray(result.photos)).toBe(true);
  });

  it('3. dbService updates male profile without altering gender to female', async () => {
    const initialBoy = {
      ...dbService.getGuestUser(),
      id: 'usr_boy_999',
      fullName: 'Tariq Siddiqui',
      gender: 'male' as const,
      city: 'Manchester',
      bio: 'Practicing Muslim brother seeking marriage.'
    };

    dbService.setCurrentUser(initialBoy);
    expect(dbService.getCurrentUser().gender).toBe('male');

    // Simulate profile update
    const updated = dbService.updateCurrentUser({
      bio: 'Updated bio: Striving on the path of Sunnah.',
      profession: 'Software Architect'
    });

    expect(updated.gender).toBe('male');
    expect(updated.bio).toBe('Updated bio: Striving on the path of Sunnah.');
    expect(updated.profession).toBe('Software Architect');

    const fetched = dbService.getCurrentUser();
    expect(fetched.gender).toBe('male');
    expect(fetched.fullName).toBe('Tariq Siddiqui');
  });
});
