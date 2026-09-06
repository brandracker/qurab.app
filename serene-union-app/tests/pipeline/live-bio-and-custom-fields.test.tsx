import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { dbService } from '../../src/services/dbService';
import { MyProfileScreen } from '../../src/screens/MyProfileScreen';
import type { UserProfile } from '../../src/types';

describe('Real-World Pipeline: Live Bio Update & Custom Fields Sync (Cloud D1 Source of Truth)', () => {
  const baseUser: UserProfile = {
    id: 'usr_cloud_sync_999',
    fullName: 'Hamza Tariq',
    email: 'hamza@example.com',
    gender: 'male',
    dob: '1994-06-12',
    age: 32,
    location: 'Birmingham, UK',
    city: 'Birmingham',
    country: 'United Kingdom',
    profession: 'Senior Cloud Architect',
    education: 'MSc Computer Science',
    marriageTimeline: 'within_1_year',
    bio: 'Initial bio before live cloud update.',
    photos: ['https://example.com/hamza.jpg'],
    citizenship: 'British Citizen',
    workArrangement: 'hybrid',
    incomeBracket: '80k_plus',
    hobbies: ['📚 Islamic History', '🏔️ Mountain Hiking', '☕ Specialty Coffee'],
    personalityTraits: ['🤍 Family-Oriented', '🌿 Calm & Patient'],
    maritalStatus: 'never_married',
    dualIncomePreference: 'career_supportive',
    partnerRequirements: {
      minAge: 22,
      maxAge: 30,
      maritalStatus: 'never_married',
      practiceLevel: 'practicing',
      relocation: 'open',
      description: 'Seeking a practicing sister on the Sunnah.'
    },
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      madhhab: 'Hanafi',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    },
    isProfileCompleted: true,
    isVip: true
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    dbService.setCurrentUser(baseUser);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1. dbService.updateBioLive sends PUT request to Cloudflare D1 endpoint, updates in-memory user and dispatches event', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Bio updated successfully',
        bio: 'Brand new live bio synced directly with Cloudflare D1!'
      })
    } as Response);

    const eventListener = vi.fn();
    window.addEventListener('serene_user_profile_updated', eventListener);

    const success = await dbService.updateBioLive(
      'usr_cloud_sync_999',
      'Brand new live bio synced directly with Cloudflare D1!'
    );

    expect(success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/users/usr_cloud_sync_999/bio'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ bio: 'Brand new live bio synced directly with Cloudflare D1!' })
      })
    );

    // In-memory current user updated
    const updatedUser = dbService.getCurrentUser();
    expect(updatedUser.bio).toBe('Brand new live bio synced directly with Cloudflare D1!');

    // Custom event dispatched for UI hydration
    expect(eventListener).toHaveBeenCalled();
    window.removeEventListener('serene_user_profile_updated', eventListener);
  });

  it('2. dbService.updateUserProfileLive sends all custom fields to Cloudflare D1 endpoint', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Profile updated successfully'
      })
    } as Response);

    const updates = {
      citizenship: 'Dual National (UK / Canada)',
      workArrangement: 'remote',
      incomeBracket: '80k_plus',
      hobbies: ['📚 Islamic History', '🥋 Brazilian Jiu-Jitsu'],
      personalityTraits: ['🤍 Family-Oriented', '✨ Creative Thinker'],
      maritalStatus: 'never_married',
      dualIncomePreference: 'career_supportive'
    };

    const result = await dbService.updateUserProfileLive('usr_cloud_sync_999', updates);

    expect(result).toBeTruthy();
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/users/usr_cloud_sync_999/profile'),
      expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('Dual National (UK / Canada)')
      })
    );

    // Current user receives updated custom fields
    const current = dbService.getCurrentUser();
    expect(current.citizenship).toBe('Dual National (UK / Canada)');
    expect(current.workArrangement).toBe('remote');
    expect(current.hobbies).toContain('🥋 Brazilian Jiu-Jitsu');
  });

  it('3. MyProfileScreen displays custom fields and allows live bio editing with cloud sync toast', async () => {
    vi.spyOn(dbService, 'fetchUserProfile').mockResolvedValue(baseUser);
    vi.spyOn(dbService, 'fetchLikesRemaining').mockResolvedValue({
      likesRemaining: 50,
      isVip: true,
      directSalams: 5,
      adsWatchedForSalam: 0,
      isSpotlightActive: false,
      spotlightExpiresAt: null
    });

    const updateBioSpy = vi.spyOn(dbService, 'updateBioLive').mockResolvedValue(true);

    const { container } = render(<MyProfileScreen user={baseUser} />);

    expect(container.textContent).toContain('Passions & Interests');
    expect(container.textContent).toContain('Character & Personality');
    expect(container.textContent).toContain('Senior Cloud Architect');

    // Find Edit Bio button
    const editBioToggle = screen.getByRole('button', { name: /edit bio/i });
    fireEvent.click(editBioToggle);

    // Textarea should appear with current bio
    const bioTextarea = screen.getByDisplayValue('Initial bio before live cloud update.');
    expect(bioTextarea).toBeDefined();

    // Change bio text
    fireEvent.change(bioTextarea, {
      target: { value: 'Passionate about Islamic learning and software development.' }
    });

    // Click "Save to Cloud"
    const saveCloudBtn = screen.getByRole('button', { name: /save to cloud/i });
    fireEvent.click(saveCloudBtn);

    // updateBioLive should be called with new bio
    await waitFor(() => {
      expect(updateBioSpy).toHaveBeenCalledWith(
        'usr_cloud_sync_999',
        'Passionate about Islamic learning and software development.'
      );
      // Success toast banner
      expect(screen.getByText(/Bio successfully updated live in Cloud D1!/i)).toBeDefined();
    });
  });
});
