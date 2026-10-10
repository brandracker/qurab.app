import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MyProfileScreen } from '../../src/screens/MyProfileScreen';
import type { UserProfile } from '../../src/types';

describe('UI & Button Interactions: My Profile Screen', () => {
  const mockUser: UserProfile = {
    id: 'usr_me_profile_1',
    fullName: 'Hamza Farooq',
    email: 'hamza@test.com',
    gender: 'male',
    dob: '1994-06-20',
    location: 'Manchester, UK',
    city: 'Manchester',
    country: 'UK',
    profession: 'Clinical Pharmacist',
    education: 'MPharm',
    marriageTimeline: 'within_6_months',
    bio: 'Looking for a pious, family-oriented partner to build a righteous home.',
    photos: ['https://example.com/hamza.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: 'always',
      halalDiet: 'always'
    }
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('1. Renders Matrimonial Biodata header and user profile information', () => {
    render(<MyProfileScreen user={mockUser} />);

    // Verify Main Header
    expect(screen.getByText(/My Matrimonial Biodata/i)).toBeDefined();
    expect(screen.getByText(/Manage profile, modesty settings/i)).toBeDefined();

    // Verify User details
    expect(screen.getByText(/Hamza Farooq/i)).toBeDefined();
    expect(screen.getAllByText(/Clinical Pharmacist/i)[0]).toBeDefined();
  });

  it('2. Dispatches onLogout callback when logout button is clicked', () => {
    const handleLogout = vi.fn();
    render(<MyProfileScreen user={mockUser} onLogout={handleLogout} />);

    const logoutBtn = screen.getByRole('button', { name: /Logout/i });
    expect(logoutBtn).toBeDefined();

    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it('3. Renders membership card and shows Upgrade button for free tier', () => {
    render(<MyProfileScreen user={mockUser} />);

    expect(screen.getByText(/Free Member/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Upgrade/i })).toBeDefined();
  });

  it('4. Dispatches onEditProfile callback when provided and button is clicked', () => {
    const handleEditProfile = vi.fn();
    render(<MyProfileScreen user={mockUser} onEditProfile={handleEditProfile} />);

    const editBtn = screen.getByRole('button', { name: /Edit Profile Details/i });
    expect(editBtn).toBeDefined();

    fireEvent.click(editBtn);
    expect(handleEditProfile).toHaveBeenCalledTimes(1);
  });

  it('5. Opens EditProfileModal in-place when onEditProfile is omitted', () => {
    render(<MyProfileScreen user={mockUser} />);

    const editBtn = screen.getByRole('button', { name: /Edit Profile Details/i });
    expect(editBtn).toBeDefined();

    fireEvent.click(editBtn);
    expect(screen.getByText(/Edit Matrimonial Biodata/i)).toBeDefined();
    expect(screen.getByDisplayValue('Hamza Farooq')).toBeDefined();
  });

  it('6. Displays 100% of onboarding biodata fields across cards', () => {
    const fullUser: UserProfile = {
      ...mockUser,
      mahrPhilosophy: 'Sunnah Mahr',
      childrenDesire: 'Wants Children',
      incomeBracket: '80k_150k',
      university: 'Manchester University',
      partnerRequirements: {
        minAge: 22,
        maxAge: 29,
        strictAgeDealbreaker: true,
        maritalStatus: 'never_married',
        practiceLevel: 'practicing',
        relocation: 'prefer_same_city',
        education: 'Bachelors Degree',
        ethnicities: ['South Asian', 'Arab'],
        dealbreakers: ['non_smoker', 'daily_salah', 'halal_diet'],
        description: 'Seeking a pious spouse with good akhlaq.'
      }
    };

    render(<MyProfileScreen user={fullUser} />);

    // Deen Card
    expect(screen.getByText(/Sect & Madhhab/i)).toBeDefined();
    expect(screen.getByText(/Dietary Standard/i)).toBeDefined();

    // Family Card
    expect(screen.getByText(/Mahr Philosophy/i)).toBeDefined();
    expect(screen.getByText(/Desire for Children/i)).toBeDefined();

    // Career Card
    expect(screen.getByText(/Income Bracket/i)).toBeDefined();

    // Partner Criteria Card
    expect(screen.getByText(/Strict 🔒/i)).toBeDefined();
    expect(screen.getByText(/Preferred Education/i)).toBeDefined();
    expect(screen.getByText(/Preferred Ethnicity/i)).toBeDefined();
    expect(screen.getByText(/Active Non-Negotiables:/i)).toBeDefined();
    expect(screen.getByText(/Non-Smoker Only/i)).toBeDefined();
    expect(screen.getByText(/5x Daily Salah/i)).toBeDefined();
    expect(screen.getByText(/Strictly Halal Diet/i)).toBeDefined();
    expect(screen.getByText(/Seeking a pious spouse with good akhlaq/i)).toBeDefined();
  });

  it('7. Clicking Edit Criteria opens EditProfileModal in-place on the Partner Criteria tab', () => {
    render(<MyProfileScreen user={mockUser} />);

    const editCriteriaBtn = screen.getByRole('button', { name: /Edit Criteria/i });
    expect(editCriteriaBtn).toBeDefined();

    fireEvent.click(editCriteriaBtn);

    // Modal opens directly to Partner tab
    expect(screen.getByText(/Edit Matrimonial Biodata/i)).toBeDefined();
    expect(screen.getByText(/Partner Criteria & Requirements/i)).toBeDefined();
    expect(screen.getByText(/Non-Negotiable Dealbreakers/i)).toBeDefined();
    expect(screen.getAllByText(/What I am Looking For/i)[0]).toBeDefined();
  });
});

