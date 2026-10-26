import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ReferralHubModal } from '../../src/components/ReferralHubModal';
import { referralService } from '../../src/services/referralService';

describe('UI & Behavioral Flow: Referral Hub Modal (30 Invites -> 1 Month Free VIP)', () => {
  const mockStats = {
    referralCode: 'usr_test_123',
    shareLink: 'https://qurb.app/join?ref=usr_test_123',
    targetCount: 30,
    completedCount: 12,
    pendingCount: 3,
    totalInvited: 15,
    isVipRewarded: false,
    friends: [
      {
        id: 'ref_1',
        refereeId: 'usr_f1',
        name: 'Usman T.',
        status: 'completed' as const,
        hasPhoto: true,
        isProfileCompleted: true,
        createdAt: '2026-10-20T10:00:00Z'
      },
      {
        id: 'ref_2',
        refereeId: 'usr_f2',
        name: 'Bilal F.',
        status: 'pending' as const,
        hasPhoto: false,
        isProfileCompleted: false,
        createdAt: '2026-10-21T12:00:00Z'
      }
    ]
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.spyOn(referralService, 'getStats').mockResolvedValue(mockStats as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1. Does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <ReferralHubModal
        userId="usr_test_123"
        isOpen={false}
        onClose={handleClose}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('2. Renders title, target 30 friends, and progress percentage', async () => {
    const handleClose = vi.fn();
    render(
      <ReferralHubModal
        userId="usr_test_123"
        isOpen={true}
        onClose={handleClose}
      />
    );

    // Title & headers
    expect(await screen.findByText(/Invite Friends & Get Free VIP/i)).toBeDefined();
    expect(screen.getByText(/30 genuine users/i)).toBeDefined();
    expect(screen.getByText(/1 Month Barakah VIP/i)).toBeDefined();

    // Live counts (12 / 30, 40%)
    expect(screen.getByText('12')).toBeDefined();
    expect(screen.getByText(/40% Completed/i)).toBeDefined();
    expect(screen.getByText(/18 more verified friends needed/i)).toBeDefined();
  });

  it('3. Clicking Share on WhatsApp triggers referralService.shareOnWhatsApp', async () => {
    const shareSpy = vi.spyOn(referralService, 'shareOnWhatsApp').mockImplementation(() => {});
    const handleClose = vi.fn();

    render(
      <ReferralHubModal
        userId="usr_test_123"
        isOpen={true}
        onClose={handleClose}
      />
    );

    const waBtn = await screen.findByText(/Share on WhatsApp/i);
    fireEvent.click(waBtn);

    expect(shareSpy).toHaveBeenCalledWith('usr_test_123', 30);
  });

  it('4. Clicking Copy Link triggers clipboard copy and displays Copied! checkmark', async () => {
    vi.spyOn(referralService, 'copyInviteLink').mockResolvedValue(true);
    const handleClose = vi.fn();

    render(
      <ReferralHubModal
        userId="usr_test_123"
        isOpen={true}
        onClose={handleClose}
      />
    );

    const copyBtn = await screen.findByText(/Copy Link/i);
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByText(/Copied!/i)).toBeDefined();
    });
  });

  it('5. Switches to Invited Friends tab and displays friend list with verified & pending chips', async () => {
    const handleClose = vi.fn();

    render(
      <ReferralHubModal
        userId="usr_test_123"
        isOpen={true}
        onClose={handleClose}
      />
    );

    const friendsTabBtn = await screen.findByRole('button', { name: /Invited Friends \(2\)/i });
    fireEvent.click(friendsTabBtn);

    expect(screen.getByText('Usman T.')).toBeDefined();
    expect(screen.getByText('Verified ✅')).toBeDefined();

    expect(screen.getByText('Bilal F.')).toBeDefined();
    expect(screen.getByText('Pending ⏳')).toBeDefined();
  });

  it('6. Switches to Fair Rules & Anti-Fraud tab and displays fraud prevention rules', async () => {
    const handleClose = vi.fn();

    render(
      <ReferralHubModal
        userId="usr_test_123"
        isOpen={true}
        onClose={handleClose}
      />
    );

    const rulesTabBtn = await screen.findByRole('button', { name: /Fair Rules & Anti-Fraud/i });
    fireEvent.click(rulesTabBtn);

    expect(screen.getByText(/Halal & Fair Play Rules/i)).toBeDefined();
    expect(screen.getByText(/Anti-Fraud Device Check/i)).toBeDefined();
    expect(screen.getByText(/Disposable \/ Temp Emails Blocked/i)).toBeDefined();
  });
});
