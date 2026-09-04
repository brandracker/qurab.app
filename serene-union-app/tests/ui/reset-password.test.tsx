import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ResetPasswordScreen } from '../../src/screens/ResetPasswordScreen';
import * as firebaseService from '../../src/services/firebase';

vi.mock('../../src/services/firebase', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/services/firebase')>();
  return {
    ...actual,
    verifyResetCode: vi.fn(),
    confirmNewPassword: vi.fn(),
  };
});

describe('UI & Button Interactions: Password Reset Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Displays error and back button when no oobCode is provided', async () => {
    const handleComplete = vi.fn();

    render(<ResetPasswordScreen oobCode="" onComplete={handleComplete} />);

    await waitFor(() => {
      expect(screen.getByText(/Link Expired or Invalid/i)).toBeDefined();
    });

    expect(screen.getByText(/No reset verification code was found in the link/i)).toBeDefined();

    const backBtn = screen.getByRole('button', { name: /Back to Sign In/i });
    fireEvent.click(backBtn);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('2. Displays expired message when code verification fails with expired code', async () => {
    vi.mocked(firebaseService.verifyResetCode).mockRejectedValueOnce({
      code: 'auth/expired-action-code'
    });

    const handleComplete = vi.fn();

    render(<ResetPasswordScreen oobCode="expired_code_123" onComplete={handleComplete} />);

    await waitFor(() => {
      expect(screen.getByText(/This password reset link has expired/i)).toBeDefined();
    });

    expect(firebaseService.verifyResetCode).toHaveBeenCalledWith('expired_code_123');
  });

  it('3. Renders form upon valid code verification and validates password length and match', async () => {
    vi.mocked(firebaseService.verifyResetCode).mockResolvedValueOnce('sister.amina@example.com');

    const handleComplete = vi.fn();

    render(<ResetPasswordScreen oobCode="valid_code_456" onComplete={handleComplete} />);

    // Wait for verified email to be displayed
    await waitFor(() => {
      expect(screen.getByText('sister.amina@example.com')).toBeDefined();
    });

    const newPassInput = screen.getByPlaceholderText(/At least 6 characters/i);
    const confirmPassInput = screen.getByPlaceholderText(/Repeat your new password/i);
    const submitBtn = screen.getByRole('button', { name: /Save New Password/i });

    // Test short password validation
    fireEvent.change(newPassInput, { target: { value: '123' } });
    fireEvent.change(confirmPassInput, { target: { value: '123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 6 characters long/i)).toBeDefined();
    });

    // Test mismatch validation
    fireEvent.change(newPassInput, { target: { value: 'Secret123!' } });
    fireEvent.change(confirmPassInput, { target: { value: 'DifferentPass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeDefined();
    });
  });

  it('4. Successfully confirms password and shows completion screen with Proceed button', async () => {
    vi.mocked(firebaseService.verifyResetCode).mockResolvedValueOnce('brother.tariq@example.com');
    vi.mocked(firebaseService.confirmNewPassword).mockResolvedValueOnce(undefined);

    const handleComplete = vi.fn();

    render(<ResetPasswordScreen oobCode="valid_code_999" onComplete={handleComplete} />);

    await waitFor(() => {
      expect(screen.getByText('brother.tariq@example.com')).toBeDefined();
    });

    const newPassInput = screen.getByPlaceholderText(/At least 6 characters/i);
    const confirmPassInput = screen.getByPlaceholderText(/Repeat your new password/i);
    const submitBtn = screen.getByRole('button', { name: /Save New Password/i });

    fireEvent.change(newPassInput, { target: { value: 'TariqSecure2026!' } });
    fireEvent.change(confirmPassInput, { target: { value: 'TariqSecure2026!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(firebaseService.confirmNewPassword).toHaveBeenCalledWith('valid_code_999', 'TariqSecure2026!');
      expect(screen.getByText(/Password Updated!/i)).toBeDefined();
    });

    // Verify Proceed to Sign In button
    const proceedBtn = screen.getByRole('button', { name: /Proceed to Sign In/i });
    fireEvent.click(proceedBtn);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
