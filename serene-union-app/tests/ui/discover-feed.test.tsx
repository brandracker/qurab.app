import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DiscoverFeed } from '../../src/components/DiscoverFeed';
import { dbService } from '../../src/services/dbService';
import { notificationService } from '../../src/services/notificationService';
import type { UserProfile } from '../../src/types';

describe('UI & Button Interactions: Habitual Story Discover Feed & Biodata Drawer', () => {
  const mockCurrentUser: UserProfile = {
    id: 'usr_discover_viewer',
    fullName: 'Tariq Al-Mansoor',
    email: 'tariq@test.com',
    gender: 'male',
    dob: '1993-01-01',
    age: 33,
    location: 'London, UK',
    city: 'London',
    country: 'UK',
    profession: 'Financial Analyst',
    education: 'BSc Finance',
    marriageTimeline: 'within_1_year',
    bio: 'Looking for a compatible spouse.',
    photos: []
  };

  const mockCandidate: UserProfile = {
    id: 'usr_candidate_maryam',
    fullName: 'Maryam Siddiqui',
    email: 'maryam@test.com',
    gender: 'female',
    dob: '1997-04-10',
    age: 29,
    location: 'Birmingham, UK',
    city: 'Birmingham',
    country: 'UK',
    citizenship: 'British Citizen',
    profession: 'Software Engineer',
    education: 'BSc Computer Science',
    marriageTimeline: 'within_1_year',
    bio: 'Passionate about technology and Islamic studies.',
    photos: [
      'https://example.com/maryam_1.jpg',
      'https://example.com/maryam_2.jpg'
    ],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    },
    familyStructure: 'nuclear',
    livingPreference: 'independent'
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    dbService.setCurrentUser(mockCurrentUser);
    localStorage.setItem('serene_real_profiles_v3', JSON.stringify([mockCandidate]));
    vi.spyOn(dbService, 'fetchLiveProfiles').mockResolvedValue([mockCandidate]);
    vi.spyOn(notificationService, 'syncLiveNotifications').mockImplementation(() => {});
  });

  it('1. Renders top search bar, daily likes status, candidate story card, and country flag', async () => {
    const handleOpenChat = vi.fn();
    render(<DiscoverFeed onOpenChat={handleOpenChat} />);

    // Wait for candidate card to render (displays first name and age: Maryam, 29)
    expect(await screen.findByText(/Maryam, 29/i)).toBeDefined();

    // Verify Search Input
    expect(screen.getByPlaceholderText(/Search candidates by city, profession/i)).toBeDefined();

    // Verify Likes left button
    expect(screen.getByText(/50 Left/i)).toBeDefined();

    // Verify Location with Country Flag
    expect(screen.getByText(/Birmingham, UK/i)).toBeDefined();
    expect(screen.getAllByLabelText(/Country: United Kingdom/i).length).toBeGreaterThan(0);
  });

  it('2. Swipe up / Full Biodata drawer opens and displays deep tabs (Career, Family, Bio)', async () => {
    const handleOpenChat = vi.fn();
    render(<DiscoverFeed onOpenChat={handleOpenChat} />);

    await screen.findByText(/Maryam, 29/i);

    // Open Drawer by clicking the "Swipe up for Full Biodata" handle
    const openDrawerBtn = screen.getByText(/Swipe up for Full Biodata/i);
    fireEvent.click(openDrawerBtn);

    // Click Career Tab in Drawer
    const careerTab = await screen.findByRole('button', { name: /Career/i });
    expect(careerTab).toBeDefined();
    fireEvent.click(careerTab);
    expect(await screen.findByText(/BSc Computer Science/i)).toBeDefined();

    // Click Family Tab in Drawer
    const familyTab = screen.getByRole('button', { name: /Family/i });
    expect(familyTab).toBeDefined();
    fireEvent.click(familyTab);
    expect(await screen.findByText(/Independent/i)).toBeDefined();
    expect(await screen.findByText(/British Citizen/i)).toBeDefined();

    // Click Bio Tab in Drawer
    const bioTab = screen.getByRole('button', { name: /^Bio & Values/i });
    expect(bioTab).toBeDefined();
    fireEvent.click(bioTab);
    expect(await screen.findByText(/Passionate about technology/i)).toBeDefined();

    // Close Drawer via Close Button
    const closeBtn = screen.getByLabelText(/Close Biodata Drawer/i);
    fireEvent.click(closeBtn);
  });

  it('3. Story tap zones allow advancing and returning through candidate photos', async () => {
    const handleOpenChat = vi.fn();
    render(<DiscoverFeed onOpenChat={handleOpenChat} />);

    await screen.findByText(/Maryam, 29/i);

    // Tap Right zone to advance to photo 2
    const nextTapZone = screen.getByLabelText('Next Photo');
    fireEvent.click(nextTapZone);

    // Tap Left zone to return to photo 1
    const prevTapZone = screen.getByLabelText('Previous Photo');
    fireEvent.click(prevTapZone);
  });

  it('4. Typing into search filters the discover feed', async () => {
    const handleOpenChat = vi.fn();
    render(<DiscoverFeed onOpenChat={handleOpenChat} />);

    await screen.findByText(/Maryam, 29/i);

    const searchInput = screen.getByPlaceholderText(/Search candidates by city, profession/i);
    fireEvent.change(searchInput, { target: { value: 'Nonexistent City 999' } });

    // Should show no matching profiles empty state
    expect(await screen.findByText(/No Profiles Found/i)).toBeDefined();
  });
});
