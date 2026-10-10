import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { YourIntentScreen } from '../../src/screens/YourIntentScreen';
import { MyProfileScreen } from '../../src/screens/MyProfileScreen';
import { ProfileDetailModal } from '../../src/components/ProfileDetailModal';
import type { UserProfile } from '../../src/types';

describe('Mainstream Partner Requirements Studio & App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const mockCandidate: UserProfile = {
    id: 'usr_candidate_99',
    phone: '+447911123456',
    email: 'candidate@example.com',
    fullName: 'Zainab Qasim',
    dob: '1997-06-20',
    age: 28,
    gender: 'female',
    location: 'Manchester, UK',
    city: 'Manchester',
    country: 'United Kingdom',
    profession: 'Clinical Pharmacist',
    education: 'MPharm, Manchester University',
    bio: 'Dedicated to community health and learning Islamic jurisprudence.',
    hobbies: ['Books & Islamic History', 'Specialty Coffee'],
    personalityTraits: ['Family-Oriented', 'Calm & Patient'],
    partnerRequirements: {
      minAge: 26,
      maxAge: 33,
      maritalStatus: 'never_married',
      practiceLevel: 'very_practicing',
      relocation: 'prefer_same_city',
      dealbreakers: ['non_smoker', 'daily_salah', 'halal_diet'],
      description: 'Seeking a pious spouse grounded in 5x daily prayers with kind akhlaq.'
    },
    blurPhotosByDefault: false,
    photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2']
  };

  it('1. Studio displays executive EmojiBadges and advances through micro-steps cleanly', () => {
    const handleContinue = vi.fn();
    render(
      <YourIntentScreen
        data={{
          profession: 'Product Designer',
          bio: 'Passionate about thoughtful design and Sunnah living values.'
        }}
        onBack={() => {}}
        onContinue={handleContinue}
      />
    );

    // Initial state: Step 1 (Professional Background)
    expect(screen.getByText(/Step 1 of 8/i)).toBeDefined();
    expect(screen.getByText(/Professional Background/i)).toBeDefined();

    // Verify Executive EmojiBadges exist for degrees
    expect(screen.getByText('Bachelors Degree')).toBeDefined();
    expect(screen.getByText('Masters Degree')).toBeDefined();

    // Advance to Step 2 (Lifestyle)
    const nextBtn = screen.getByRole('button', { name: /Next: Lifestyle/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Step 2 of 8/i)).toBeDefined();
    expect(screen.getByText(/Passions & Personality/i)).toBeDefined();

    // Advance to Step 7 (Dealbreakers) directly via tracker
    const step7Btn = screen.getByTitle('Dealbreakers');
    fireEvent.click(step7Btn);

    expect(screen.getByText(/Step 7 of 8/i)).toBeDefined();
    expect(screen.getByText(/Non-Negotiable Dealbreakers/i)).toBeDefined();
    expect(screen.getByText(/Non-Smoker Only/i)).toBeDefined();
    expect(screen.getByText(/5x Daily Salah/i)).toBeDefined();
  });

  it('2. ProfileDetailModal displays candidate active dealbreakers and partner criteria', () => {
    render(
      <ProfileDetailModal
        profile={mockCandidate}
        isOpen={true}
        onClose={() => {}}
      />
    );

    // Assert header and core sections
    expect(screen.getByText(/Matrimonial Profile/i)).toBeDefined();
    expect(screen.getByText(/Partner Requirements & Expectations/i)).toBeDefined();

    // Assert Preferred Age & Relocation
    expect(screen.getByText('26 - 33 years')).toBeDefined();
    expect(screen.getByText(/prefer same city/i)).toBeDefined();

    // Assert Active Dealbreakers rendered with badges
    expect(screen.getByText(/Non-Negotiable Dealbreakers:/i)).toBeDefined();
    expect(screen.getByText(/Non-Smoker Only/i)).toBeDefined();
    expect(screen.getByText(/5x Daily Salah/i)).toBeDefined();
    expect(screen.getByText(/Strictly Halal Diet/i)).toBeDefined();
  });

  it('3. MyProfileScreen renders Edit Criteria trigger and active dealbreaker chips', () => {
    const handleEditCriteria = vi.fn();
    render(
      <MyProfileScreen
        user={mockCandidate}
        onOpenEditRequirements={handleEditCriteria}
      />
    );

    // Verify My Partner Requirements card exists
    expect(screen.getByText(/My Partner Requirements & Expectations/i)).toBeDefined();
    expect(screen.getByText(/Active Non-Negotiables:/i)).toBeDefined();

    // Verify "Edit Criteria" button triggers callback
    const editBtn = screen.getByRole('button', { name: /Edit Criteria/i });
    expect(editBtn).toBeDefined();
    fireEvent.click(editBtn);

    expect(handleEditCriteria).toHaveBeenCalledTimes(1);
  });

  it('4. Full submission passes partner requirements, dealbreakers, and career intent payload', () => {
    const handleContinue = vi.fn();
    render(
      <YourIntentScreen
        data={{
          profession: 'Senior Bioinformatician',
          bio: 'Passionate researcher dedicated to Islamic sciences and health.',
          partnerRequirements: {
            minAge: 23,
            maxAge: 30,
            dealbreakers: ['daily_salah']
          }
        }}
        onBack={() => {}}
        onContinue={handleContinue}
      />
    );

    // Click direct submit
    const submitBtn = screen.getByRole('button', { name: /continue to photos/i });
    fireEvent.click(submitBtn);

    expect(handleContinue).toHaveBeenCalledTimes(1);
    const submitted = handleContinue.mock.calls[0][0];

    expect(submitted.profession).toBe('Senior Bioinformatician');
    expect(submitted.partnerRequirements.minAge).toBe(23);
    expect(submitted.partnerRequirements.maxAge).toBe(30);
    expect(submitted.partnerRequirements.dealbreakers).toContain('daily_salah');
  });
});
