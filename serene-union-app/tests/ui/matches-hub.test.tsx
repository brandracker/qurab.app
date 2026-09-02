import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MatchesLikedYouScreen } from '../../src/components/MatchesLikedYouScreen';
import { dbService } from '../../src/services/dbService';

describe('UI & Button Interactions: Matches & Activity Hub (5 Tabs)', () => {
  const mockUser = {
    id: 'usr_test_user_main',
    fullName: 'Zayd Al-Ansari',
    email: 'zayd@test.com',
    gender: 'male' as const,
    dob: '1995-01-01',
    location: 'London, UK',
    profession: 'Engineer',
    education: 'BSc',
    marriageTimeline: 'within_1_year' as const,
    bio: 'Test bio',
    photos: []
  };

  beforeEach(() => {
    localStorage.clear();
    dbService.setCurrentUser(mockUser);
  });

  it('1. Renders all 5 Navigation Tabs and allows clicking between them', () => {
    const handleOpenChat = vi.fn();
    const handleBackToDiscover = vi.fn();

    render(
      <MatchesLikedYouScreen
        currentUser={mockUser}
        onOpenChat={handleOpenChat}
        onBackToDiscover={handleBackToDiscover}
      />
    );

    // Tab 1: Liked You (Active by default)
    expect(screen.getByRole('button', { name: /Liked You/i })).toBeDefined();

    // Tab 2: You Liked (Sent likes)
    const youLikedTab = screen.getByRole('button', { name: /You Liked/i });
    expect(youLikedTab).toBeDefined();
    fireEvent.click(youLikedTab);

    // Tab 3: Mutual Matches
    const mutualTab = screen.getByRole('button', { name: /Mutual/i });
    expect(mutualTab).toBeDefined();
    fireEvent.click(mutualTab);

    // Switch to Privacy & Passes Section
    const privacyToggle = screen.getByRole('button', { name: /Privacy & Passes/i });
    expect(privacyToggle).toBeDefined();
    fireEvent.click(privacyToggle);

    // Tab 4: Passed History
    expect(screen.getByRole('button', { name: /Passed History/i })).toBeDefined();

    // Tab 5: Blocked
    expect(screen.getByRole('button', { name: /^Blocked$/i })).toBeDefined();
  });
});
