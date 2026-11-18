import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { MembershipUpgradeModal } from '../../src/components/MembershipUpgradeModal';
import { facebookEventsService } from '../../src/services/facebookEventsService';

describe('UI & Behavioral Flow: VIP Membership Upgrade Modal & Direct Paid Pricing', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, url: 'https://checkout.stripe.com/pay/test_session' })
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('1. Does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const handleWatchAd = vi.fn();

    const { container } = render(
      <MembershipUpgradeModal
        userId="usr_test_vip"
        isOpen={false}
        onClose={handleClose}
        onPurchaseSuccess={handleSuccess}
        onWatchAdClicked={handleWatchAd}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('2. Renders Free 24h Boost badge, direct VIP pricing ($4.99 / PKR 1,499), and upgrade CTA for Barakah VIP', () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const handleWatchAd = vi.fn();

    render(
      <MembershipUpgradeModal
        userId="usr_test_vip"
        isOpen={true}
        onClose={handleClose}
        onPurchaseSuccess={handleSuccess}
        onWatchAdClicked={handleWatchAd}
      />
    );

    // Modal title & subheader
    expect(screen.getByText(/Barakah VIP & Passes/i)).toBeDefined();
    expect(screen.getByText(/Google Play 1-Tap In-App Billing/i)).toBeDefined();

    // Direct VIP & Free 24h Boost Elements
    expect(screen.getByText('Free 24h Boost')).toBeDefined();
    expect(screen.getByText(/PKR 1,499 \/ month/i)).toBeDefined();
    expect(screen.getByText(/Upgrade to Barakah VIP \(\$4\.99\/mo\)/i)).toBeDefined();
    expect(screen.getByText(/PKR 1,499\/month · Includes Free 24h Boost · Cancel anytime in Google Play Subscriptions/i)).toBeDefined();
  });

  it('3. Selecting 20 Direct Salam Passes updates pricing ($2.99 / PKR 850), description, and buy CTA', () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const handleWatchAd = vi.fn();

    render(
      <MembershipUpgradeModal
        userId="usr_test_vip"
        isOpen={true}
        onClose={handleClose}
        onPurchaseSuccess={handleSuccess}
        onWatchAdClicked={handleWatchAd}
      />
    );

    // Click on 20 Direct Salam Passes
    const salamProduct = screen.getByText(/20 Direct Salam Passes/i);
    fireEvent.click(salamProduct);

    // Check updated prices and labels
    expect(screen.getByText(/Instant Connect/i)).toBeDefined();
    expect(screen.getByText(/PKR 850 \(20 Passes\)/i)).toBeDefined();
    expect(screen.getByText(/Pay with Google Pay \(\$2\.99\)/i)).toBeDefined();
    expect(screen.getByText(/Instant activation · 256-bit encrypted secure checkout via Google/i)).toBeDefined();
  });

  it('4. Selecting 24-Hour City Spotlight Boost updates details to $1.99 (PKR 550)', () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const handleWatchAd = vi.fn();

    render(
      <MembershipUpgradeModal
        userId="usr_test_vip"
        isOpen={true}
        onClose={handleClose}
        onPurchaseSuccess={handleSuccess}
        onWatchAdClicked={handleWatchAd}
      />
    );

    // Click Spotlight boost
    const boostProduct = screen.getByText('24-Hour City Spotlight Boost');
    fireEvent.click(boostProduct);

    expect(screen.getByText('10x Views')).toBeDefined();
    expect(screen.getByText(/PKR 550 \(24 Hours\)/i)).toBeDefined();
    expect(screen.getByText(/Pay with Google Pay \(\$1\.99\)/i)).toBeDefined();
  });

  it('5. Watch Video Ad (Free) button triggers callback and closes modal', () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const handleWatchAd = vi.fn();

    render(
      <MembershipUpgradeModal
        userId="usr_test_vip"
        isOpen={true}
        onClose={handleClose}
        onPurchaseSuccess={handleSuccess}
        onWatchAdClicked={handleWatchAd}
      />
    );

    const watchAdBtn = screen.getByText(/Watch Video Ad \(Free\)/i);
    fireEvent.click(watchAdBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleWatchAd).toHaveBeenCalledTimes(1);
  });

  it('6. Initiating purchase logs Meta InitiateCheckout event and triggers checkout flow', async () => {
    const logCheckoutSpy = vi.spyOn(facebookEventsService, 'logInitiateCheckout');
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const handleWatchAd = vi.fn();

    render(
      <MembershipUpgradeModal
        userId="usr_test_vip"
        isOpen={true}
        onClose={handleClose}
        onPurchaseSuccess={handleSuccess}
        onWatchAdClicked={handleWatchAd}
      />
    );

    const upgradeBtn = screen.getByText(/Upgrade to Barakah VIP \(\$4\.99\/mo\)/i);
    await act(async () => {
      fireEvent.click(upgradeBtn);
    });

    expect(logCheckoutSpy).toHaveBeenCalledWith('qurb_barakah_monthly', 4.99, 'USD');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/wallet/stripe/create-checkout-session'),
      expect.any(Object)
    );
  });

  it('7. Close "X" button invokes onClose callback', () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const handleWatchAd = vi.fn();

    render(
      <MembershipUpgradeModal
        userId="usr_test_vip"
        isOpen={true}
        onClose={handleClose}
        onPurchaseSuccess={handleSuccess}
        onWatchAdClicked={handleWatchAd}
      />
    );

    // Look for the close button
    const closeButtons = screen.getAllByRole('button');
    const closeBtn = closeButtons.find(btn => btn.querySelector('svg.lucide-x'));
    expect(closeBtn).toBeDefined();

    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });
});
