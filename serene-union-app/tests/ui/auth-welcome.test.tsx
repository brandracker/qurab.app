import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { WelcomeScreen } from '../../src/screens/WelcomeScreen';
import { AuthScreen } from '../../src/screens/AuthScreen';

vi.mock('../../src/services/firebase', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/services/firebase')>();
  return {
    ...actual,
    signInWithGoogle: vi.fn().mockResolvedValue({
      user: {
        uid: 'mock_google_uid_123',
        email: 'mock.google@example.com',
        displayName: 'Mock Google User'
      }
    })
  };
});

describe('UI & Button Interactions: Welcome & Authentication Screens', () => {
  it('1. Welcome Screen renders CTAs and triggers correct tab navigation', () => {
    const handleGetStarted = vi.fn();
    const handleLogin = vi.fn();

    render(
      <WelcomeScreen
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
      />
    );

    // Verify main Heading and Trust Badges
    expect(screen.getByText(/Finding your righteous spouse/i)).toBeDefined();

    // Verify "Begin Halal Journey" Button
    const getStartedBtn = screen.getByRole('button', { name: /Begin Halal Journey/i });
    expect(getStartedBtn).toBeDefined();
    fireEvent.click(getStartedBtn);
    expect(handleGetStarted).toHaveBeenCalledTimes(1);

    // Verify "Sign In" Button
    const signInBtn = screen.getByRole('button', { name: /Already a member\? Sign In/i });
    expect(signInBtn).toBeDefined();
    fireEvent.click(signInBtn);
    expect(handleLogin).toHaveBeenCalledTimes(1);
  });

  it('2. Auth Screen switches tabs smoothly between Signup and Login', () => {
    const handleAuthSuccess = vi.fn();
    const handleBack = vi.fn();

    render(
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        onBack={handleBack}
        initialTab="signup"
      />
    );

    // Verify Tab 1 (Create Account) is active
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeDefined();

    // Switch to Tab 2 (Sign In)
    const signInTabBtn = screen.getByRole('button', { name: /^Sign In$/i });
    fireEvent.click(signInTabBtn);

    // Form inputs should update for Sign In
    expect(screen.getByPlaceholderText(/name@example\.com/i)).toBeDefined();
  });

  it('3. Auth Screen renders Google 1-Click Sign-In and handles interaction', async () => {
    const handleAuthSuccess = vi.fn();
    const handleBack = vi.fn();

    render(
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        onBack={handleBack}
        initialTab="signup"
      />
    );

    // Verify Google button exists
    const googleBtn = screen.getByRole('button', { name: /Continue with Google/i });
    expect(googleBtn).toBeDefined();

    // Verify clicking triggers cleanly without unhandled exceptions
    await act(async () => {
      fireEvent.click(googleBtn);
    });
  });

  it('4. Auth Screen displays Google OAuth compliant Terms of Service and Privacy Policy links', () => {
    const handleAuthSuccess = vi.fn();
    const handleBack = vi.fn();

    render(
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        onBack={handleBack}
        initialTab="signup"
      />
    );

    const termsLink = screen.getByRole('link', { name: /Terms of Service/i });
    expect(termsLink).toBeDefined();
    expect(termsLink.getAttribute('href')).toBe('/terms');

    const privacyLink = screen.getByRole('link', { name: /Privacy Policy/i });
    expect(privacyLink).toBeDefined();
    expect(privacyLink.getAttribute('href')).toBe('/privacy-policy');
  });
});
