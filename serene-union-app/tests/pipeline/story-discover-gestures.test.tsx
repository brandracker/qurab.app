import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { DiscoverFeed } from '../../src/components/DiscoverFeed';
import { extractCountryInfo } from '../../src/utils/countryFlags';
import { dbService } from '../../src/services/dbService';
import { notificationService } from '../../src/services/notificationService';
import type { UserProfile } from '../../src/types';

describe('Story-Style Discover Feed Gestures & Country Flag Resolution', () => {
  it('1. extractCountryInfo accurately parses diaspora locations into correct country flags', () => {
    expect(extractCountryInfo('Lahore, Pakistan').code).toBe('PK');
    expect(extractCountryInfo('Lahore, Pakistan').emoji).toBe('🇵🇰');

    expect(extractCountryInfo('London, UK').code).toBe('GB');
    expect(extractCountryInfo('London, UK').emoji).toBe('🇬🇧');

    expect(extractCountryInfo('Dubai, UAE').code).toBe('AE');
    expect(extractCountryInfo('Dubai, UAE').emoji).toBe('🇦🇪');

    expect(extractCountryInfo('Dallas, TX, USA').code).toBe('US');
    expect(extractCountryInfo('Dallas, TX, USA').emoji).toBe('🇺🇸');

    expect(extractCountryInfo('Toronto, ON, Canada').code).toBe('CA');
    expect(extractCountryInfo('Toronto, ON, Canada').emoji).toBe('🇨🇦');

    expect(extractCountryInfo('Riyadh, Saudi Arabia').code).toBe('SA');
    expect(extractCountryInfo('Riyadh, Saudi Arabia').emoji).toBe('🇸🇦');
  });

  const mockViewer: UserProfile = {
    id: 'usr_viewer_ali',
    fullName: 'Ali Raza',
    email: 'ali@test.com',
    gender: 'male',
    dob: '1994-02-14',
    age: 32,
    location: 'Lahore, Pakistan',
    city: 'Lahore',
    country: 'Pakistan',
    profession: 'Architect',
    photos: []
  };

  const candidateA: UserProfile = {
    id: 'usr_story_cand_1',
    fullName: 'Zoya Malik',
    email: 'zoya@test.com',
    gender: 'female',
    dob: '1998-05-15',
    age: 28,
    location: 'Karachi, Pakistan',
    city: 'Karachi',
    country: 'Pakistan',
    citizenship: 'Pakistani',
    profession: 'Dentist',
    education: 'BDS',
    bio: 'Looking for a pious, family-oriented partner.',
    photos: ['https://example.com/zoya1.jpg', 'https://example.com/zoya2.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  };

  const candidateB: UserProfile = {
    id: 'usr_story_cand_2',
    fullName: 'Hiba Qureshi',
    email: 'hiba@test.com',
    gender: 'female',
    dob: '1999-08-20',
    age: 27,
    location: 'Dubai, UAE',
    city: 'Dubai',
    country: 'UAE',
    citizenship: 'Emirati',
    profession: 'Brand Manager',
    education: 'BBA Marketing',
    bio: 'Passionate about travel, Islamic art, and fitness.',
    photos: ['https://example.com/hiba1.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    dbService.setCurrentUser(mockViewer);
    localStorage.setItem('serene_real_profiles_v3', JSON.stringify([candidateA, candidateB]));
    vi.spyOn(dbService, 'fetchLiveProfiles').mockResolvedValue([candidateA, candidateB]);
    vi.spyOn(notificationService, 'syncLiveNotifications').mockImplementation(() => {});
  });

  it('2. Vertical swipe-up touch gesture opens the Biodata bottom sheet drawer', async () => {
    const { container } = render(<DiscoverFeed onOpenChat={vi.fn()} />);

    expect(await screen.findByText(/Zoya, 28/i)).toBeDefined();

    // Verify root container has onTouchStart and onTouchEnd
    const rootFeed = container.firstChild as HTMLElement;
    expect(rootFeed).toBeDefined();

    // Simulate vertical swipe up: Touch start at Y=500, Touch end at Y=350 (deltaY = -150)
    fireEvent.touchStart(rootFeed, {
      touches: [{ clientX: 200, clientY: 500 }]
    });

    fireEvent.touchEnd(rootFeed, {
      changedTouches: [{ clientX: 200, clientY: 350 }]
    });

    // Drawer should open and show Dentists details
    expect(await screen.findByText(/Daily Prayers/i)).toBeDefined();
    expect(screen.getAllByText(/Dentist/i).length).toBeGreaterThan(0);

    // Close drawer via close button
    const closeBtn = screen.getByLabelText(/Close Biodata Drawer/i);
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByLabelText(/Close Biodata Drawer/i)).toBeNull();
    });
  });

  it('3. Liking candidate advances to next story candidate smoothly', async () => {
    render(<DiscoverFeed onOpenChat={vi.fn()} />);

    expect(await screen.findByText(/Zoya, 28/i)).toBeDefined();

    // Click Connect (Like) button
    const connectBtn = screen.getByRole('button', { name: /Connect/i });
    fireEvent.click(connectBtn);

    // Should transition to candidate B (Hiba)
    expect(await screen.findByText(/Hiba, 27/i)).toBeDefined();
    expect(screen.getByText(/Dubai, UAE/i)).toBeDefined();
  });
});
