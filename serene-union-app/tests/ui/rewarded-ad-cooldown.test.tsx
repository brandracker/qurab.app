import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RewardedAdModal } from '../../src/components/RewardedAdModal';

describe('UI: RewardedAdModal 15s Cooldown Buffer (Task 10)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('1. Renders normal ad screen when no cooldown is active', () => {
    render(
      <RewardedAdModal
        userId="usr_test_cooldown"
        isOpen={true}
        onClose={vi.fn()}
        onRewardClaimed={vi.fn()}
      />
    );

    expect(screen.getByText(/Qurb Islamic Matrimony/i)).toBeDefined();
    expect(screen.getByText(/10 Extra Discover Likes/i)).toBeDefined();
  });

  it('2. Renders cooldown waiting screen when ad was watched recently', () => {
    // Set ad last completed 5 seconds ago (within 15s window)
    localStorage.setItem('qurb_ad_last_completed', (Date.now() - 5000).toString());

    const handleClose = vi.fn();
    render(
      <RewardedAdModal
        userId="usr_test_cooldown"
        isOpen={true}
        onClose={handleClose}
        onRewardClaimed={vi.fn()}
      />
    );

    expect(screen.getByText(/Video Reward Buffer Active/i)).toBeDefined();
    expect(screen.getByText(/before loading another video to ensure reward verification/i)).toBeDefined();

    const dismissBtn = screen.getByRole('button', { name: /Dismiss/i });
    fireEvent.click(dismissBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
