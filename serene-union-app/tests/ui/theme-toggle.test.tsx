import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { themeService } from '../../src/services/themeService';
import { SettingsPrivacy } from '../../src/components/SettingsPrivacy';
import { MyProfileScreen } from '../../src/screens/MyProfileScreen';
import type { UserProfile } from '../../src/types';

describe('UI & Theme Interactions: Dark Theme Toggle Engine', () => {
  const mockUser: UserProfile = {
    id: 'user_theme_test',
    fullName: 'Amina Khan',
    email: 'amina@theme.com',
    gender: 'female',
    photos: ['https://example.com/photo.jpg'],
    blurPhotosByDefault: false,
    profileVisibility: 'all_users',
    isVip: false
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    themeService.setTheme('light');
    vi.restoreAllMocks();
  });

  it('1. themeService toggles between light and dark modes and updates documentElement', () => {
    expect(themeService.getTheme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    const toggled = themeService.toggleTheme();
    expect(toggled).toBe('dark');
    expect(themeService.isDark()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('qurb_theme')).toBe('dark');

    const reverted = themeService.toggleTheme();
    expect(reverted).toBe('light');
    expect(themeService.isDark()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('qurb_theme')).toBe('light');
  });

  it('2. Settings screen renders Dark Theme toggle and switches theme on click', () => {
    render(<SettingsPrivacy currentUser={mockUser} />);

    expect(screen.getByText(/Appearance & Theme/i)).toBeDefined();
    expect(screen.getByText(/Dark Theme/i)).toBeDefined();

    const toggleBtn = screen.getByRole('button', { name: /Toggle Dark Theme/i });
    expect(toggleBtn).toBeDefined();

    // Click toggle button to enable Dark Theme
    fireEvent.click(toggleBtn);
    expect(themeService.isDark()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Click again to return to Light Theme
    fireEvent.click(toggleBtn);
    expect(themeService.isDark()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('3. Profile screen header includes Quick Toggle Theme button', () => {
    render(<MyProfileScreen user={mockUser} />);

    const quickToggleBtn = screen.getByRole('button', { name: /Quick Toggle Theme/i });
    expect(quickToggleBtn).toBeDefined();

    fireEvent.click(quickToggleBtn);
    expect(themeService.isDark()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(quickToggleBtn);
    expect(themeService.isDark()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

