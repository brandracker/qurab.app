import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HardUpdateModal } from '../../src/components/HardUpdateModal';
import { backNavigationService } from '../../src/services/backNavigationService';

describe('HardUpdateModal & Force Update Gate', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('1. Renders mandatory update message, version badge and Play Store CTA', () => {
    render(
      <HardUpdateModal
        isOpen={true}
        title="Critical Security & Calling Update"
        message="A mandatory update is required to continue using Qurb."
        latestVersionName="1.0.37"
        playStoreUrl="https://play.google.com/store/apps/details?id=app.qurb.serene"
      />
    );

    expect(screen.getByText(/Critical Security & Calling Update/i)).toBeTruthy();
    expect(screen.getByText(/Mandatory App Update • v1.0.37/i)).toBeTruthy();
    expect(screen.getByText(/A mandatory update is required/i)).toBeTruthy();
    expect(screen.getByText(/Update on Google Play Store 🚀/i)).toBeTruthy();
  });

  it('2. Traps hardware back navigation to prevent user from dismissing the lock', () => {
    render(
      <HardUpdateModal
        isOpen={true}
        title="Mandatory Update"
      />
    );

    // When hardware back button is pressed, backNavigationService consumes it without closing
    const handled = backNavigationService.handleBack();
    expect(handled).toBe(true);

    // Modal is still strictly present in the DOM
    expect(screen.getByText(/Mandatory Update/i)).toBeTruthy();
  });

  it('3. Re-check button triggers onCheckAgain callback with loading state', async () => {
    const handleCheckAgain = vi.fn().mockResolvedValue(undefined);

    render(
      <HardUpdateModal
        isOpen={true}
        title="Mandatory Update"
        onCheckAgain={handleCheckAgain}
      />
    );

    const recheckBtn = screen.getByRole('button', { name: /Check Again/i });
    expect(recheckBtn).toBeTruthy();

    fireEvent.click(recheckBtn);
    expect(handleCheckAgain).toHaveBeenCalledTimes(1);
  });
});
