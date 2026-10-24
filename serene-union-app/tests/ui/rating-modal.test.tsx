import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { RatingModal } from '../../src/components/RatingModal';
import { ratingService } from '../../src/services/ratingService';

describe('UI & Behavioral Flow: In-App Rating Modal (Halal Store Reviews & Shielding)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('1. Does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <RatingModal isOpen={false} onClose={handleClose} userId="usr_test_rating" />
    );

    expect(container.firstChild).toBeNull();
  });

  it('2. Renders 5-star default rating dialog with Play Store CTA and Maybe Later button', () => {
    const handleClose = vi.fn();
    render(
      <RatingModal isOpen={true} onClose={handleClose} userId="usr_test_rating" />
    );

    expect(screen.getByText(/Enjoying Your Journey on Qurb\?/i)).toBeDefined();
    expect(screen.getByText(/Your sincere rating helps more intentional Muslims/i)).toBeDefined();
    expect(screen.getByText(/Rate on Google Play ⭐/i)).toBeDefined();
    expect(screen.getByText(/Takes only 10 seconds on Google Play/i)).toBeDefined();
    expect(screen.getByText(/Maybe Later/i)).toBeDefined();
  });

  it('3. 4-5 Stars routes directly to Google Play Store and marks as permanently rated', () => {
    const handleClose = vi.fn();
    const openPlayStoreSpy = vi.spyOn(ratingService, 'openPlayStore');

    render(
      <RatingModal isOpen={true} onClose={handleClose} userId="usr_test_rating" />
    );

    const rateBtn = screen.getByText(/Rate on Google Play ⭐/i);
    fireEvent.click(rateBtn);

    expect(openPlayStoreSpy).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(ratingService.hasRated()).toBe(true);
  });

  it('4. Selecting 1-3 stars switches to internal feedback form (protecting Play Store reputation)', () => {
    const handleClose = vi.fn();
    render(
      <RatingModal isOpen={true} onClose={handleClose} userId="usr_test_rating" />
    );

    // Click on 2-star button
    const twoStarBtn = screen.getByLabelText(/2 stars/i);
    fireEvent.click(twoStarBtn);

    // Title switches from positive to improvement tone
    expect(screen.getByText(/Help Us Improve Qurb/i)).toBeDefined();
    expect(screen.getByText(/How can we improve your experience\? \(Optional\)/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Tell us what felt missing/i)).toBeDefined();
    expect(screen.getByText(/Submit Private Feedback/i)).toBeDefined();
    // Play store callout should not be present
    expect(screen.queryByText(/Takes only 10 seconds on Google Play/i)).toBeNull();
  });

  it('5. Submitting private feedback saves internal record and displays JazakAllah Khair confirmation', async () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();
    const submitFeedbackSpy = vi.spyOn(ratingService, 'submitPrivateFeedback');

    render(
      <RatingModal isOpen={true} onClose={handleClose} userId="usr_test_rating" />
    );

    // Select 3 stars
    fireEvent.click(screen.getByLabelText(/3 stars/i));

    // Fill feedback textarea
    const textarea = screen.getByPlaceholderText(/Tell us what felt missing/i);
    fireEvent.change(textarea, { target: { value: 'Please add more city filters in Punjab!' } });

    // Submit private feedback
    const submitBtn = screen.getByText(/Submit Private Feedback/i);
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(submitFeedbackSpy).toHaveBeenCalledWith(3, 'Please add more city filters in Punjab!', 'usr_test_rating');
    expect(screen.getByText(/JazakAllah Khair!/i)).toBeDefined();
    expect(screen.getByText(/Your sincere feedback has been received/i)).toBeDefined();

    // Advances timer for auto-dismiss
    act(() => {
      vi.advanceTimersByTime(1600);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(ratingService.hasRated()).toBe(true);
  });

  it('6. Clicking "Maybe Later" or Close "X" dismisses prompt for 14 days without permanently marking as rated', () => {
    const handleClose = vi.fn();
    const dismissSpy = vi.spyOn(ratingService, 'dismiss');

    const { rerender } = render(
      <RatingModal isOpen={true} onClose={handleClose} userId="usr_test_rating" />
    );

    // Click Maybe Later
    const maybeLaterBtn = screen.getByText(/Maybe Later/i);
    fireEvent.click(maybeLaterBtn);

    expect(dismissSpy).toHaveBeenCalledWith(14);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(ratingService.hasRated()).toBe(false);
    expect(ratingService.isDismissed()).toBe(true);

    // Reset and test "X" button
    vi.clearAllMocks();
    localStorage.clear();

    rerender(
      <RatingModal isOpen={true} onClose={handleClose} userId="usr_test_rating" />
    );

    const closeBtn = screen.getByLabelText(/Close/i);
    fireEvent.click(closeBtn);

    expect(dismissSpy).toHaveBeenCalledWith(14);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('7. ratingService correctly calculates milestone thresholds and throttle rules', () => {
    expect(ratingService.hasRated()).toBe(false);
    expect(ratingService.isDismissed()).toBe(false);
    expect(ratingService.getPositiveActionCount()).toBe(0);

    // Action 1: not yet milestone
    expect(ratingService.recordPositiveAction()).toBe(false);
    expect(ratingService.shouldShowRatingPrompt()).toBe(false);

    // Action 2: not yet milestone
    expect(ratingService.recordPositiveAction()).toBe(false);
    expect(ratingService.shouldShowRatingPrompt()).toBe(false);

    // Action 3: milestone reached!
    expect(ratingService.recordPositiveAction()).toBe(true);
    expect(ratingService.shouldShowRatingPrompt()).toBe(true);

    // Dismissing throttles it
    ratingService.dismiss(14);
    expect(ratingService.isDismissed()).toBe(true);
    expect(ratingService.shouldShowRatingPrompt()).toBe(false);

    // Permanently rating prevents prompt even if cooldown expires
    localStorage.removeItem('qurb_rating_dismissed_until_v1');
    ratingService.markAsRated();
    expect(ratingService.hasRated()).toBe(true);
    expect(ratingService.shouldShowRatingPrompt()).toBe(false);
  });
});
