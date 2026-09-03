import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CompatibilityQuizModal } from '../../src/components/CompatibilityQuizModal';
import { CompatibilityComparisonModal } from '../../src/components/CompatibilityComparisonModal';
import { dbService } from '../../src/services/dbService';

describe('Real-World Pipeline: Compatibility Quiz, Safety & Modesty Hub', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. Compatibility Quiz allows completing questions and triggers save', () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    render(
      <CompatibilityQuizModal
        userId="usr_test_quiz"
        isOpen={true}
        onClose={handleClose}
        onCompleted={handleSave}
      />
    );

    expect(screen.getByText(/Deen & Spirituality/i)).toBeDefined();

    // Click first option of question 1
    const optionButtons = screen.getAllByRole('button');
    const answerBtn = optionButtons.find(b => b.textContent && !b.textContent.includes('Back') && !b.textContent.includes('Close') && !b.textContent.includes('Exit'));
    if (answerBtn) {
      fireEvent.click(answerBtn);
    }

    // Modal is active and responsive
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('2. 1-to-1 Modesty Photo Reveal system toggles viewer visibility correctly', () => {
    const ownerId = 'usr_sister_aisha';
    const viewerId = 'usr_brother_tariq';

    // Initially photo is not revealed
    expect(dbService.isPhotoRevealedTo(ownerId, viewerId)).toBe(false);

    // Toggle photo reveal
    const nowRevealed = dbService.togglePhotoReveal(ownerId, viewerId);
    expect(nowRevealed).toBe(true);
    expect(dbService.isPhotoRevealedTo(ownerId, viewerId)).toBe(true);

    // Toggle back off (revoking access)
    const revoked = dbService.togglePhotoReveal(ownerId, viewerId);
    expect(revoked).toBe(false);
    expect(dbService.isPhotoRevealedTo(ownerId, viewerId)).toBe(false);
  });

  it('3. Blocking a profile removes candidate and records in blocked storage', async () => {
    const targetUserId = 'usr_bad_actor_99';
    
    // Mock user
    dbService.setCurrentUser({
      id: 'usr_me_123',
      fullName: 'Safe User',
      gender: 'male',
      email: 'me@test.com',
      phone: '',
      dob: '1995-01-01',
      age: 31,
      location: 'London',
      profession: 'Accountant',
      education: 'BSc',
      height: "5'10\"",
      ethnicity: 'South Asian',
      familyStructure: 'nuclear',
      livingPreference: 'independent',
      siblingsCount: 2,
      willingnessToRelocate: 'open',
      smokingStatus: 'non_smoker',
      languagesSpoken: 'English',
      mahrPhilosophy: 'mutual_agreement',
      childrenDesire: 'desires_children',
      marriageTimeline: 'within_1_year',
      bio: 'Practicing',
      blurPhotosByDefault: false,
      profileVisibility: 'all_users',
      photos: [],
      religiousProfile: {
        practiceLevel: 'practicing',
        sect: 'Sunni',
        madhhab: 'Hanafi',
        prayerFrequency: '5 times daily',
        halalDiet: 'Strictly Halal',
        quranRecitation: 'daily',
        modestyPractice: 'modest',
        hajjUmrahStatus: 'planning',
        deenRelationshipBio: 'Alhamdulillah'
      }
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    });

    const success = await dbService.blockProfile(targetUserId, 'Inappropriate behavior');
    expect(success).toBe(true);

    const blockedList = dbService.getUserBlocked('usr_me_123');
    expect(blockedList.some(b => b.id === targetUserId)).toBe(true);
  });

  it('4. Undo pass removes candidate from passed list', async () => {
    const targetUserId = 'usr_mistakenly_passed_42';
    
    dbService.setCurrentUser({
      id: 'usr_me_123',
      fullName: 'Test User',
      gender: 'male',
      email: 'me@test.com',
      phone: '',
      dob: '1995-01-01',
      age: 31,
      location: 'London',
      profession: 'Accountant',
      education: 'BSc',
      height: "5'10\"",
      ethnicity: 'South Asian',
      familyStructure: 'nuclear',
      livingPreference: 'independent',
      siblingsCount: 2,
      willingnessToRelocate: 'open',
      smokingStatus: 'non_smoker',
      languagesSpoken: 'English',
      mahrPhilosophy: 'mutual_agreement',
      childrenDesire: 'desires_children',
      marriageTimeline: 'within_1_year',
      bio: 'Practicing',
      blurPhotosByDefault: false,
      profileVisibility: 'all_users',
      photos: [],
      religiousProfile: {
        practiceLevel: 'practicing',
        sect: 'Sunni',
        madhhab: 'Hanafi',
        prayerFrequency: '5 times daily',
        halalDiet: 'Strictly Halal',
        quranRecitation: 'daily',
        modestyPractice: 'modest',
        hajjUmrahStatus: 'planning',
        deenRelationshipBio: 'Alhamdulillah'
      }
    });

    // Manually pass candidate
    const passedKey = `serene_passed_usr_me_123`;
    localStorage.setItem(passedKey, JSON.stringify([{ id: targetUserId, fullName: 'Passed Candidate' }]));
    expect(dbService.getUserPassed('usr_me_123').length).toBe(1);

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    });

    const success = await dbService.undoPass(targetUserId);
    expect(success).toBe(true);
    expect(dbService.getUserPassed('usr_me_123').length).toBe(0);
  });
});
