import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chatService } from '../../src/services/chatService';
import { dbService } from '../../src/services/dbService';
import { ProfileDetailModal } from '../../src/components/ProfileDetailModal';
import type { UserProfile } from '../../src/types';

describe('ISS-011, ISS-012, ISS-016: Service Layer & Photo Reveal Unification', () => {
  const mockUser: UserProfile = {
    id: 'usr_me_1',
    phone: '+1234567890',
    fullName: 'Test User',
    dob: '1995-01-01',
    age: 31,
    gender: 'male',
    location: 'London, UK',
    profession: 'Engineer',
    education: 'BSc',
    ethnicity: 'South Asian',
    marriageTimeline: 'within_1_year',
    bio: 'Seeking spouse',
    blurPhotosByDefault: false,
    profileVisibility: 'all_users',
    photos: ['https://example.com/me.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  };

  const mockCandidate: UserProfile = {
    id: 'usr_partner_1',
    phone: '+1987654321',
    fullName: 'Aisha Candidate',
    dob: '1998-05-15',
    age: 28,
    gender: 'female',
    location: 'London, UK',
    profession: 'Designer',
    education: 'BA',
    ethnicity: 'Arab',
    marriageTimeline: 'within_1_year',
    bio: 'Pious companion',
    blurPhotosByDefault: true,
    profileVisibility: 'all_users',
    photos: ['https://example.com/aisha.jpg'],
    religiousProfile: {
      practiceLevel: 'practicing',
      sect: 'Sunni',
      prayerFrequency: '5 times daily',
      halalDiet: 'Strictly Halal'
    }
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    dbService.setCurrentUser(mockUser);
  });

  it('1. chatService.togglePhotoRevealLive calls the correct parameterized D1 endpoint', async () => {
    let capturedUrl = '';
    let capturedBody = '';

    global.fetch = vi.fn().mockImplementation((url: string, opts?: any) => {
      capturedUrl = url;
      capturedBody = opts?.body ? JSON.parse(opts.body) : {};
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, isRevealed: true })
      });
    });

    const convId = 'conv_usr_me_1_usr_partner_1';
    await chatService.togglePhotoRevealLive(convId, mockUser.id, mockCandidate.id, true);

    // Verify endpoint contains :id parameter (no 404)
    expect(capturedUrl).toContain(`/conversations/${convId}/photo-reveal`);
    expect(capturedBody).toMatchObject({
      ownerId: mockUser.id,
      viewerId: mockCandidate.id,
      isRevealed: true
    });
  });

  it('2. Photo reveal status is synchronized between chatService, dbService and ProfileDetailModal', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    // Candidate reveals photos to Current User
    await chatService.togglePhotoRevealLive('conv_123', mockCandidate.id, mockUser.id, true);

    // Both services must agree that photo is revealed to currentUser
    expect(chatService.isPhotoRevealedTo(mockCandidate.id, mockUser.id)).toBe(true);
    expect(dbService.isPhotoRevealedTo(mockCandidate.id, mockUser.id)).toBe(true);

    // ProfileDetailModal should render with unblurred photo
    render(
      <ProfileDetailModal
        profile={mockCandidate}
        isOpen={true}
        onClose={() => {}}
      />
    );

    // Verify photo image is unblurred (does not contain blur-xl)
    const img = screen.getByAltText(mockCandidate.fullName);
    expect(img).toBeTruthy();
    expect(img.className).not.toContain('blur-xl');
    expect(img.className).toContain('scale-100');
  });
});
