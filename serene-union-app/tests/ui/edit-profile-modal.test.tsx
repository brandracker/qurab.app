import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { EditProfileModal } from '../../src/components/EditProfileModal';
import { dbService } from '../../src/services/dbService';
import type { UserProfile } from '../../src/types';

describe('UI & Functional Testing: EditProfileModal (In-Place Matrimonial Biodata Editor)', () => {
  const mockUser: UserProfile = {
    id: 'usr_edit_modal_test_1',
    fullName: 'Hamza Farooq',
    email: 'hamza@test.com',
    gender: 'male',
    dob: '1994-06-20',
    age: 31,
    location: 'Manchester, UK',
    city: 'Manchester',
    country: 'United Kingdom',
    latitude: 53.4808,
    longitude: -2.2426,
    profession: 'Clinical Pharmacist',
    education: 'MPharm, Manchester University',
    university: 'University of Manchester',
    height: "5'11\" (180 cm)",
    ethnicity: 'South Asian',
    citizenship: 'British',
    marriageTimeline: 'within_1_year',
    maritalStatus: 'never_married',
    livingPreference: 'independent',
    willingnessToRelocate: 'open',
    smokingStatus: 'non_smoker',
    languagesSpoken: 'English, Urdu',
    childrenDesire: 'wants_children',
    bio: 'Dedicated pharmacist looking for a practicing companion with good humor.',
    photos: ['https://example.com/hamza.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal',
      modestyPractice: 'Sunnah Beard',
      deenRelationshipBio: 'Dedicated pharmacist looking for a practicing companion with good humor.'
    }
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1. Renders EditProfileModal with prefilled personal data and location dropdowns when isOpen is true', () => {
    render(
      <EditProfileModal
        isOpen={true}
        user={mockUser}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/Edit Matrimonial Biodata/i)).toBeDefined();
    expect(screen.getByText(/Update personal, verified location/i)).toBeDefined();

    // Verify prefilled personal inputs
    const nameInput = screen.getByDisplayValue('Hamza Farooq') as HTMLInputElement;
    expect(nameInput).toBeDefined();

    // Country dropdown should be selected to United Kingdom
    const countrySelect = screen.getByLabelText(/country/i) as HTMLSelectElement;
    expect(countrySelect.value).toBe('GB');

    // City should be selected or displayed
    expect(screen.getByDisplayValue('Manchester')).toBeDefined();

    // GPS Status badge should indicate active coordinates
    expect(screen.getByText(/Accurate coordinates active/i)).toBeDefined();
  });

  it('2. Switches tabs and accurately renders Career, Deen, and Lifestyle sections', () => {
    render(
      <EditProfileModal
        isOpen={true}
        user={mockUser}
        onClose={vi.fn()}
      />
    );

    // Switch to Career tab
    const careerTab = screen.getByRole('button', { name: /Career/i });
    fireEvent.click(careerTab);
    expect(screen.getByDisplayValue('Clinical Pharmacist')).toBeDefined();
    expect(screen.getByDisplayValue('MPharm, Manchester University')).toBeDefined();

    // Switch to Deen tab
    const deenTab = screen.getByRole('button', { name: /Deen/i });
    fireEvent.click(deenTab);
    expect(screen.getByDisplayValue('Sunni')).toBeDefined();
    expect(screen.getByDisplayValue('Hanafi')).toBeDefined();

    // Switch to Lifestyle tab
    const lifestyleTab = screen.getByRole('button', { name: /Lifestyle/i });
    fireEvent.click(lifestyleTab);
    expect(screen.getByDisplayValue(/Dedicated pharmacist looking for a practicing companion/i)).toBeDefined();
    expect(screen.getByDisplayValue('English, Urdu')).toBeDefined();
  });

  it('3. Updates user fields and commits live changes with Haversine coordinates to dbService on Save', async () => {
    const handleSaved = vi.fn();
    const handleClose = vi.fn();
    
    const updateSpy = vi.spyOn(dbService, 'updateUserProfileLive').mockResolvedValue({
      ...mockUser,
      profession: 'Lead Clinical Pharmacist',
      city: 'London',
      latitude: 51.5074,
      longitude: -0.1278
    });

    render(
      <EditProfileModal
        isOpen={true}
        user={mockUser}
        onClose={handleClose}
        onSaved={handleSaved}
      />
    );

    // Switch to London in City dropdown
    const citySelect = screen.getByLabelText(/city/i) as HTMLSelectElement;
    fireEvent.change(citySelect, { target: { value: 'London' } });

    // Switch to Career tab and update Profession
    const careerTab = screen.getByRole('button', { name: /Career/i });
    fireEvent.click(careerTab);
    const profInput = screen.getByDisplayValue('Clinical Pharmacist') as HTMLInputElement;
    fireEvent.change(profInput, { target: { value: 'Lead Clinical Pharmacist' } });

    // Click Save Changes
    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    expect(updateSpy).toHaveBeenCalledWith(
      'usr_edit_modal_test_1',
      expect.objectContaining({
        city: 'London',
        profession: 'Lead Clinical Pharmacist',
        latitude: 51.5074,
        longitude: -0.1278
      })
    );

    await waitFor(() => {
      expect(handleSaved).toHaveBeenCalledTimes(1);
    });
  });

  it('4. GPS Auto-Detect button captures live navigator geolocation and updates coordinates', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => {
        success({
          coords: {
            latitude: 25.2048,
            longitude: 55.2708,
            accuracy: 5
          }
        });
      })
    };
    // @ts-expect-error Mocking navigator.geolocation
    global.navigator.geolocation = mockGeolocation;

    const updateSpy = vi.spyOn(dbService, 'updateUserProfileLive').mockResolvedValue(mockUser);

    render(
      <EditProfileModal
        isOpen={true}
        user={mockUser}
        onClose={vi.fn()}
      />
    );

    const gpsBtn = screen.getByRole('button', { name: /auto-detect accurate gps location/i });
    fireEvent.click(gpsBtn);

    await waitFor(() => {
      expect(screen.getByText(/Accurate coordinates captured: Dubai, United Arab Emirates \(25.20, 55.27\)/i)).toBeDefined();
    });

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(
        'usr_edit_modal_test_1',
        expect.objectContaining({
          city: 'Dubai',
          country: 'United Arab Emirates',
          latitude: 25.2048,
          longitude: 55.2708
        })
      );
    });
  });

  it('5. Closes modal without calling updateUserProfileLive when Cancel is clicked', () => {
    const handleClose = vi.fn();
    const updateSpy = vi.spyOn(dbService, 'updateUserProfileLive');

    render(
      <EditProfileModal
        isOpen={true}
        user={mockUser}
        onClose={handleClose}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('6. Does not render modal content when isOpen is false', () => {
    const { container } = render(
      <EditProfileModal
        isOpen={false}
        user={mockUser}
        onClose={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
