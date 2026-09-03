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
});
