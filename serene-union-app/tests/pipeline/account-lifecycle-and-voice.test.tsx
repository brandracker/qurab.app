import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dbService } from '../../src/services/dbService';
import { SettingsPrivacy } from '../../src/components/SettingsPrivacy';
import { DiscoverFeed } from '../../src/components/DiscoverFeed';
import type { UserProfile } from '../../src/types';

describe('Account Lifecycle (Deactivate, Reactivate, Delete) & Voice Greeting Feed Integration', () => {
  const femaleViewer: UserProfile = {
    id: 'usr_sister_viewer',
    fullName: 'Fatima Al-Husseini',
    dob: '1998-05-12',
    age: 28,
    gender: 'female',
    location: 'London, UK',
    profession: 'Software Engineer',
    education: 'BSc Computer Science',
    marriageTimeline: 'within_1_year',
    bio: 'Looking for a pious husband.',
    photos: ['https://example.com/sister.jpg'],
    accountStatus: 'active',
    profileVisibility: 'all_users'
  };

  const maleWithVoice: UserProfile = {
    id: 'usr_male_1',
    fullName: 'Hamza Farooqi',
    dob: '1996-02-14',
    age: 30,
    gender: 'male',
    location: 'London, UK',
    profession: 'Data Architect',
    education: 'MSc Data Science',
    marriageTimeline: 'within_1_year',
    bio: 'Practicing deen and sunnah.',
    photos: ['https://example.com/hamza.jpg'],
    accountStatus: 'active',
    profileVisibility: 'all_users',
    voiceGreetingUrl: 'https://serene-union-api.brandracker.workers.dev/api/photos/media/voice_usr_1787950367460_1788715719148.webm',
    voiceGreetingDuration: 45
  };

  const maleWithoutVoice: UserProfile = {
    id: 'usr_male_2',
    fullName: 'Tariq Javed',
    dob: '1995-07-20',
    age: 31,
    gender: 'male',
    location: 'Manchester, UK',
    profession: 'Doctor',
    education: 'MBBS',
    marriageTimeline: 'within_1_year',
    bio: 'Seeking pious partner.',
    photos: ['https://example.com/tariq.jpg'],
    accountStatus: 'active',
    profileVisibility: 'all_users'
  };

  const maleDeactivated: UserProfile = {
    id: 'usr_male_3',
    fullName: 'Zubair Deactivated',
    dob: '1994-01-10',
    age: 32,
    gender: 'male',
    location: 'Birmingham, UK',
    profession: 'Pharmacist',
    education: 'PharmD',
    marriageTimeline: 'within_1_year',
    bio: 'Taking a temporary break.',
    photos: ['https://example.com/zubair.jpg'],
    accountStatus: 'deactivated',
    profileVisibility: 'hidden'
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    dbService.setCurrentUser(femaleViewer);
  });

  it('1. dbService.getDiscoverFeed filters out deactivated accounts and prioritizes male profiles with voice greetings', () => {
    const feed = dbService.getDiscoverFeed(undefined, [maleWithoutVoice, maleWithVoice, maleDeactivated]);

    // Deactivated user must NOT be in discover feed
    expect(feed.some(p => p.id === 'usr_male_3')).toBe(false);

    // Male with voice greeting must be prioritized at the top of the feed
    expect(feed.length).toBe(2);
    expect(feed[0].id).toBe('usr_male_1');
    expect(feed[0].voiceGreetingUrl).toBeTruthy();
    expect(feed[0].voiceGreetingDuration).toBe(45);
  });

  it('2. DiscoverFeed renders audio player button for boys with voice greeting', async () => {
    vi.spyOn(dbService, 'fetchLiveProfiles').mockResolvedValue([maleWithVoice, maleWithoutVoice]);

    render(<DiscoverFeed onSelectProfile={() => {}} onLikeProfile={() => {}} onDirectSalam={() => {}} />);

    // Wait for the candidate card with name "Hamza"
    await waitFor(() => {
      expect(screen.getByText(/Hamza/i)).toBeDefined();
    });

    // Verify Voice button with duration is displayed for male candidate
    expect(screen.getByText(/Voice \(45s\)/i)).toBeDefined();
  });

  it('3. SettingsPrivacy displays Account Status & Controls and allows pausing/deactivating profile', async () => {
    const deactivateSpy = vi.spyOn(dbService, 'deactivateAccount').mockResolvedValue(true);
    const onUpdateSpy = vi.fn();

    render(<SettingsPrivacy currentUser={femaleViewer} onUpdateUser={onUpdateSpy} />);

    // Check account status banner
    expect(screen.getByText(/Active on Discover/i)).toBeDefined();
    expect(screen.getByText(/Pause \/ Deactivate Profile/i)).toBeDefined();

    // Click Pause button
    const pauseBtn = screen.getByRole('button', { name: /^pause$/i });
    fireEvent.click(pauseBtn);

    // Confirmation modal should appear
    expect(screen.getByText(/Pause \/ Deactivate Profile\?/i)).toBeDefined();
    expect(screen.getByText(/Existing chats & matches are preserved safely/i)).toBeDefined();

    // Click Confirm Pause in modal
    const confirmBtn = screen.getByRole('button', { name: /confirm pause/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(deactivateSpy).toHaveBeenCalledWith('usr_sister_viewer');
    });

    // Wait for modal to close and status to update
    await waitFor(() => {
      expect(screen.queryByText(/Confirm Pause/i)).toBeNull();
    });

    expect(screen.getByText(/Paused \/ Hidden/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /reactivate/i })).toBeDefined();
  });

  it('4. SettingsPrivacy allows reactivating a paused account', async () => {
    const pausedUser: UserProfile = {
      ...femaleViewer,
      accountStatus: 'deactivated',
      profileVisibility: 'hidden'
    };
    const reactivateSpy = vi.spyOn(dbService, 'reactivateAccount').mockResolvedValue(true);
    const onUpdateSpy = vi.fn();

    render(<SettingsPrivacy currentUser={pausedUser} onUpdateUser={onUpdateSpy} />);

    expect(screen.getByText(/Paused \/ Hidden/i)).toBeDefined();

    // Click Reactivate button
    const reactivateBtn = screen.getByRole('button', { name: /reactivate/i });
    fireEvent.click(reactivateBtn);

    await waitFor(() => {
      expect(reactivateSpy).toHaveBeenCalledWith('usr_sister_viewer');
    });

    // Badge restores to Active
    await waitFor(() => {
      expect(screen.getByText(/Active on Discover/i)).toBeDefined();
    });
  });

  it('5. SettingsPrivacy enforces DELETE confirmation text before permanent deletion', async () => {
    const deleteSpy = vi.spyOn(dbService, 'deleteAccount').mockResolvedValue(true);
    const onLogoutSpy = vi.fn();

    render(<SettingsPrivacy currentUser={femaleViewer} onLogout={onLogoutSpy} />);

    // Click Delete Profile Permanently button
    const deleteTriggerBtn = screen.getByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteTriggerBtn);

    // Modal appears
    expect(screen.getByText(/Permanently Delete Account\?/i)).toBeDefined();
    const deleteForeverBtn = screen.getByRole('button', { name: /delete forever/i }) as HTMLButtonElement;
    expect(deleteForeverBtn.disabled).toBe(true);

    // Type incorrect text
    const input = screen.getByPlaceholderText('DELETE');
    fireEvent.change(input, { target: { value: 'NO' } });
    expect(deleteForeverBtn.disabled).toBe(true);

    // Type correct DELETE text
    fireEvent.change(input, { target: { value: 'DELETE' } });
    expect(deleteForeverBtn.disabled).toBe(false);

    // Click Delete Forever
    fireEvent.click(deleteForeverBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith('usr_sister_viewer');
      expect(onLogoutSpy).toHaveBeenCalled();
    });
  });
});
