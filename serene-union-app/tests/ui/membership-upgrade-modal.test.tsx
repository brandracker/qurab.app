import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { MembershipUpgradeModal } from '../../src/components/MembershipUpgradeModal';
import { facebookEventsService } from '../../src/services/facebookEventsService';

describe('UI & Behavioral Flow: VIP Membership Upgrade Modal & 7-Day Free Trial', () => {
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

  it('2. Renders 7-Day Free Trial badge, trial pricing, and zero-dollar trial CTA for Barakah VIP', () => {
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

    // 7-Day Free Trial Elements
    expect(screen.getByText('7-Day Free Trial')).toBeDefined();
    expect(screen.getByText(/PKR 0 today · then PKR 830\/mo/i)).toBeDefined();
    expect(screen.getByText(/Start 7-Day Free Trial \(\$0 Today\)/i)).toBeDefined();
    expect(screen.getByText(/7 days 100% free · Then PKR 830\/month · Cancel anytime in Google Play Subscriptions/i)).toBeDefined();
  });

  it('3. Selecting 20 Direct Salam Passes updates pricing, description, and buy CTA', () => {
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
    expect(screen.getByText(/PKR 550 \(20 Passes\)/i)).toBeDefined();
    expect(screen.getByText(/Pay with Google Pay \(\$1\.99\)/i)).toBeDefined();
    expect(screen.getByText(/Instant activation · 256-bit encrypted secure checkout via Google/i)).toBeDefined();
  });

  it('4. Selecting 24-Hour City Spotlight Boost updates details to $0.99 (PKR 275)', () => {
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
    const boostProduct = screen.getByText(/24-Hour City Spotlight Boost/i);
    fireEvent.click(boostProduct);

    expect(screen.getByText(/10x Views/i)).toBeDefined();
    expect(screen.getByText(/PKR 275 \(24 Hours\)/i)).toBeDefined();
    expect(screen.getByText(/Pay with Google Pay \(\$0\.99\)/i)).toBeDefined();
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

    const trialBtn = screen.getByText(/Start 7-Day Free Trial \(\$0 Today\)/i);
    await act(async () => {
      fireEvent.click(trialBtn);
    });

    expect(logCheckoutSpy).toHaveBeenCalledWith('qurb_barakah_monthly', 2.99, 'USD');
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
