import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SettingsPrivacy } from '../../src/components/SettingsPrivacy';
import { dbService } from '../../src/services/dbService';
import type { UserProfile } from '../../src/types';

describe('UI & Button Interactions: Settings & Modesty Privacy', () => {
  const mockUser: UserProfile = {
    id: 'user_test_settings_101',
    fullName: 'Fatima Al-Zahra',
    email: 'fatima.settings@example.com',
    gender: 'female',
    age: 24,
    city: 'Manchester',
    country: 'United Kingdom',
    sect: 'Sunni',
    practiceLevel: 'practicing',
    profession: 'Clinical Pharmacist',
    education: "Master's in Pharmacy",
    height: "5'6\"",
    bio: 'Dedicated Muslimah looking for a pious partner.',
    photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2'],
    blurPhotosByDefault: true,
    profileVisibility: 'all_users',
    isVip: false
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. Renders Settings & Modesty Privacy screen with user details and default preferences', () => {
    render(<SettingsPrivacy currentUser={mockUser} />);

    // Header & Subtitle
    expect(screen.getByText(/Settings & Privacy/i)).toBeDefined();
    expect(screen.getByText(/Manage your halal preferences and security/i)).toBeDefined();

    // User details card
    expect(screen.getByText('Fatima Al-Zahra')).toBeDefined();
    expect(screen.getAllByText(/fatima\.settings@example\.com/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Account ID: user_test_settings_101/i)).toBeDefined();

    // Privacy sections
    expect(screen.getByText(/Islamic Modesty & Privacy/i)).toBeDefined();
    expect(screen.getByText(/Blur My Photos/i)).toBeDefined();
    expect(screen.getByText(/Profile Visibility/i)).toBeDefined();

    // Membership section
    expect(screen.getByText(/Free Tier Member/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Upgrade/i })).toBeDefined();
  });

  it('2. Toggling Photo Blur triggers update callback and displays Saved banner', () => {
    const handleUpdate = vi.fn();
    const updatePrivacySpy = vi.spyOn(dbService, 'updatePrivacy').mockImplementation(() => {});

    render(<SettingsPrivacy currentUser={mockUser} onUpdateUser={handleUpdate} />);

    // Toggle button for photo blur
    const blurButton = screen.getByRole('button', { name: '' });
    expect(blurButton).toBeDefined();

    fireEvent.click(blurButton);

    // Verify callback dispatched with toggled state
    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        blurPhotosByDefault: false
      })
    );
    expect(updatePrivacySpy).toHaveBeenCalledWith(false, 'all_users');

    // Verify "Saved!" indicator badge appears
    expect(screen.getByText(/Saved!/i)).toBeDefined();
  });

  it('3. Changing Profile Visibility dropdown updates preferences', () => {
    const updatePrivacySpy = vi.spyOn(dbService, 'updatePrivacy').mockImplementation(() => {});

    render(<SettingsPrivacy currentUser={mockUser} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeDefined();

    fireEvent.change(select, { target: { value: 'approved_only' } });

    expect(updatePrivacySpy).toHaveBeenCalledWith(true, 'approved_only');
    expect(screen.getByText(/Saved!/i)).toBeDefined();
  });

  it('4. Renders VIP Membership badge when user is Barakah VIP', () => {
    const vipUser: UserProfile = {
      ...mockUser,
      isVip: true
    };

    render(<SettingsPrivacy currentUser={vipUser} />);

    expect(screen.getByText(/Barakah VIP Active/i)).toBeDefined();
    expect(screen.getByText(/All Premium Features Unlocked/i)).toBeDefined();
    expect(screen.getAllByText(/Unlimited/i).length).toBeGreaterThan(0);
  });

  it('5. Clicking Log Out triggers onLogout callback', () => {
    const handleLogout = vi.fn();

    render(<SettingsPrivacy currentUser={mockUser} onLogout={handleLogout} />);

    const logoutBtn = screen.getByTitle('Log Out');
    fireEvent.click(logoutBtn);

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
