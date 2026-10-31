import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { themeService } from '../../src/services/themeService';
import { MembershipUpgradeModal } from '../../src/components/MembershipUpgradeModal';

describe('Dark Theme Contrast & UI Styling Fixes', () => {
  it('1. themeService toggles and applies dark class correctly', () => {
    themeService.setTheme('dark');
    expect(themeService.isDark()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    themeService.setTheme('light');
    expect(themeService.isDark()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Reset back to dark
    themeService.setTheme('dark');
  });

  it('2. MembershipUpgradeModal renders dark theme styled surfaces and VIP card', () => {
    themeService.setTheme('dark');
    render(
      <MembershipUpgradeModal
        userId="usr_test"
        isOpen={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Barakah VIP & Passes')).toBeDefined();
    expect(screen.getByText('Qurb Barakah VIP Club')).toBeDefined();
    expect(screen.getByText('Invite Friends (1 Month VIP Free)')).toBeDefined();

    // Verify modal container has dark mode background class
    const modalHeading = screen.getByText('Barakah VIP & Passes');
    const container = modalHeading.closest('.dark\\:bg-\\[\\#121218\\]');
    expect(container).not.toBeNull();
  });
});

