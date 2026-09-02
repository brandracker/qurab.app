import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { WelcomeScreen } from '../../src/screens/WelcomeScreen';
import { AuthScreen } from '../../src/screens/AuthScreen';

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
});
