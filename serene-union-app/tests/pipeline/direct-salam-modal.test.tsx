import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { DiscoverFeed } from '../../src/components/DiscoverFeed';
import { dbService } from '../../src/services/dbService';
import { notificationService } from '../../src/services/notificationService';
import type { UserProfile } from '../../src/types';

describe('Pipeline: Direct Salam Composition Modal & Match Flow', () => {
  const mockCurrentUser: UserProfile = {
    id: 'usr_viewer_brother',
    fullName: 'Hamza Khan',
    email: 'hamza@test.com',
    gender: 'male',
    dob: '1995-03-20',
    age: 31,
    location: 'Manchester, UK',
    city: 'Manchester',
    country: 'UK',
    profession: 'Software Architect',
    photos: []
  };

  const mockCandidate: UserProfile = {
    id: 'usr_candidate_amina',
    fullName: 'Amina Begum',
    email: 'amina@test.com',
    gender: 'female',
    dob: '1998-07-12',
    age: 28,
    location: 'London, UK',
    city: 'London',
    country: 'UK',
    citizenship: 'British Citizen',
    profession: 'Clinical Pharmacist',
    education: 'MPharm',
    marriageTimeline: 'within_6_months',
    bio: 'Looking for someone dedicated to Salah and community work.',
    photos: ['https://example.com/amina1.jpg'],
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
    dbService.setCurrentUser(mockCurrentUser);
    localStorage.setItem(`serene_salams_left_${mockCurrentUser.id}`, '2');
    localStorage.setItem('serene_real_profiles_v3', JSON.stringify([mockCandidate]));
    vi.spyOn(dbService, 'fetchLiveProfiles').mockResolvedValue([mockCandidate]);
    vi.spyOn(notificationService, 'syncLiveNotifications').mockImplementation(() => {});
    vi.spyOn(dbService, 'consumeDirectSalam').mockImplementation(async (userId: string) => {
      const localKey = `serene_salams_left_${userId}`;
      const current = parseInt(localStorage.getItem(localKey) || '2', 10);
      const next = Math.max(0, current - 1);
      localStorage.setItem(localKey, next.toString());
      return { success: true, directSalams: next };
    });
    vi.spyOn(dbService, 'fetchLikesRemaining').mockResolvedValue({
      likesRemaining: 50,
      directSalams: 2,
      isVip: false
    });
    vi.spyOn(dbService, 'sendMatchAction').mockResolvedValue({
      isMutual: false,
      conversationId: 'conv_viewer_amina',
      message: 'Direct Salam sent'
    });
  });

  it('1. Clicking Direct Salam opens the composition modal instead of abruptly jumping to chat', async () => {
    const handleOpenChat = vi.fn();
    render(<DiscoverFeed onOpenChat={handleOpenChat} />);

    expect(await screen.findByText(/Amina, 28/i)).toBeDefined();

    // Click Direct Salam button on story action bar
    const directSalamBtn = screen.getByRole('button', { name: /Direct Salam/i });
    fireEvent.click(directSalamBtn);

    // Should NOT have opened chat immediately
    expect(handleOpenChat).not.toHaveBeenCalled();

    // Should display Direct Salam Modal with candidate's first name & pass info
    expect(await screen.findByText(/Send Salam to Amina/i)).toBeDefined();
    expect(screen.getByText(/2 passes left/i)).toBeDefined();
    expect(screen.getByText(/Wali chaperone transparency active/i)).toBeDefined();
  });

  it('2. Selecting a quick suggestion updates the personalized note textarea', async () => {
    render(<DiscoverFeed onOpenChat={vi.fn()} />);

    expect(await screen.findByText(/Amina, 28/i)).toBeDefined();

    const directSalamBtn = screen.getByRole('button', { name: /Direct Salam/i });
    fireEvent.click(directSalamBtn);

    expect(await screen.findByText(/Send Salam to Amina/i)).toBeDefined();

    // Click the second suggestion pill
    const suggestionBtn = screen.getByText(/Truly inspired by your Deen, career dedication/i);
    fireEvent.click(suggestionBtn);

    // Textarea value should reflect the chosen suggestion
    const textarea = screen.getByPlaceholderText(/Write a thoughtful, respectful Islamic opening greeting/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('Truly inspired by your Deen');
  });

  it('3. Confirming Send Salam consumes pass, creates conversation, and navigates to chat', async () => {
    const handleOpenChat = vi.fn();
    render(<DiscoverFeed onOpenChat={handleOpenChat} />);

    expect(await screen.findByText(/Amina, 28/i)).toBeDefined();

    // Open modal
    const directSalamBtn = screen.getByRole('button', { name: /Direct Salam/i });
    fireEvent.click(directSalamBtn);

    expect(await screen.findByText(/Send Salam to Amina/i)).toBeDefined();

    // Submit modal
    const sendBtn = screen.getByRole('button', { name: /Send Blessed Salam/i });
    fireEvent.click(sendBtn);

    // Should route to chat
    await waitFor(() => {
      expect(handleOpenChat).toHaveBeenCalled();
    });

    // Pass count should decrement
    const remaining = localStorage.getItem(`serene_salams_left_${mockCurrentUser.id}`);
    expect(remaining).toBe('1');
  });

  it('4. If 0 passes are remaining, clicking Direct Salam prompts refill modal', async () => {
    localStorage.setItem(`serene_salams_left_${mockCurrentUser.id}`, '0');
    vi.spyOn(dbService, 'fetchLikesRemaining').mockResolvedValue({
      likesRemaining: 50,
      directSalams: 0,
      isVip: false
    });

    render(<DiscoverFeed onOpenChat={vi.fn()} />);
    expect(await screen.findByText(/Amina, 28/i)).toBeDefined();

    const directSalamBtn = screen.getByRole('button', { name: /Direct Salam/i });
    fireEvent.click(directSalamBtn);

    // Should prompt out of salams modal
    expect(await screen.findByText(/No Direct Salam Passes Left/i)).toBeDefined();
    expect(screen.getByText(/Watch Ads \(Earn Free Pass\)/i)).toBeDefined();
  });
});
