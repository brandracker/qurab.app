import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { RewardedAdModal } from '../../src/components/RewardedAdModal';

describe('UI & Button Interactions: Rewarded Ad Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('1. Renders ad modal with reward title and initial countdown state', () => {
    const handleClose = vi.fn();
    const handleRewardClaimed = vi.fn();

    render(
      <RewardedAdModal
        userId="usr_test_1"
        rewardType="likes"
        isOpen={true}
        onClose={handleClose}
        onRewardClaimed={handleRewardClaimed}
      />
    );

    // Verify Ad Sponsor and Brand text
    expect(screen.getByText(/Rewarded Sponsor/i)).toBeDefined();
    expect(screen.getByText(/Qurab Islamic Matrimony/i)).toBeDefined();
    expect(screen.getByText(/Reward: \+10 Extra Discover Likes/i)).toBeDefined();

    // Verify video watching prompt
    expect(screen.getByText(/Please watch video/i)).toBeDefined();
  });

  it('2. Shows Salam pass reward title when rewardType is salam', () => {
    const handleClose = vi.fn();
    const handleRewardClaimed = vi.fn();

    render(
      <RewardedAdModal
        userId="usr_test_1"
        rewardType="salam"
        isOpen={true}
        onClose={handleClose}
        onRewardClaimed={handleRewardClaimed}
      />
    );

    expect(screen.getByText(/Reward: \+1 Direct Salam Pass/i)).toBeDefined();
  });

  it('3. Unlocks claim button after countdown finishes and triggers callbacks', async () => {
    vi.useFakeTimers();

    const handleClose = vi.fn();
    const handleRewardClaimed = vi.fn();

    render(
      <RewardedAdModal
        userId="usr_test_1"
        rewardType="likes"
        isOpen={true}
        onClose={handleClose}
        onRewardClaimed={handleRewardClaimed}
      />
    );

    // Advance timers by 16 seconds to complete the ad
    await act(async () => {
      vi.advanceTimersByTime(16000);
    });

    // Verify claim button is displayed
    const claimBtn = screen.getByRole('button', { name: /Claim/i });
    expect(claimBtn).toBeDefined();

    // Click claim
    await act(async () => {
      fireEvent.click(claimBtn);
    });

    expect(handleRewardClaimed).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
