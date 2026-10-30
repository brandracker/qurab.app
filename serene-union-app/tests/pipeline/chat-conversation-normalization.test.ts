import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dbService } from '../../src/services/dbService';
import { 
  getCanonicalConversationId, 
  extractPartnerIdFromConvId, 
  parseConversationParticipants,
  QURB_OFFICIAL_USER_ID 
} from '../../src/utils/conversation';
import type { UserProfile } from '../../src/types';

describe('Frontend Chat & Conversation Normalization Pipeline Tests', () => {
  const mockUser: UserProfile = {
    id: 'usr_test_brother_1',
    fullName: 'Bilal Khan',
    phone: '+923001234567',
    gender: 'male',
    dob: '1995-05-15',
    location: 'Lahore, Pakistan',
    profession: 'Software Architect',
    education: 'BS CS',
    height: "5'11\"",
    ethnicity: 'Pakistani / Punjabi',
    marriageTimeline: 'within_6_months',
    bio: 'Practicing Muslim.',
    blurPhotosByDefault: true,
    profileVisibility: 'all_users',
    photos: []
  };

  const mockCandidate: UserProfile = {
    id: 'usr_test_sister_2',
    fullName: 'Amina Siddiqui',
    phone: '+923009876543',
    gender: 'female',
    dob: '1998-08-20',
    location: 'Islamabad, Pakistan',
    profession: 'Clinical Psychologist',
    education: 'MSc Psychology',
    height: "5'5\"",
    ethnicity: 'Pakistani / Urdu',
    marriageTimeline: 'within_1_year',
    bio: 'Dedicated to deen and family.',
    blurPhotosByDefault: true,
    profileVisibility: 'all_users',
    photos: []
  };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('serene_current_user_v1', JSON.stringify(mockUser));
    localStorage.setItem('serene_current_user', JSON.stringify(mockUser));
  });

  it('1. getCanonicalConversationId produces identical room ID regardless of argument order', () => {
    const idA = getCanonicalConversationId(mockUser.id, mockCandidate.id);
    const idB = getCanonicalConversationId(mockCandidate.id, mockUser.id);
    const expected = `conv_${[mockUser.id, mockCandidate.id].sort().join('_')}`;

    expect(idA).toBe(expected);
    expect(idB).toBe(expected);
  });

  it('2. extractPartnerIdFromConvId correctly resolves partner and rejects ghost "usr"', () => {
    const convId = getCanonicalConversationId(mockUser.id, mockCandidate.id);
    expect(extractPartnerIdFromConvId(convId, mockUser.id)).toBe(mockCandidate.id);
    expect(extractPartnerIdFromConvId(convId, mockCandidate.id)).toBe(mockUser.id);

    // Corrupted rooms
    expect(extractPartnerIdFromConvId(`conv_usr_${mockUser.id}`, mockUser.id)).toBeNull();
    expect(extractPartnerIdFromConvId(`conv_usr_usr_${mockUser.id}`, mockUser.id)).toBeNull();
  });

  it('3. parseConversationParticipants parses participants and returns null for broken rooms', () => {
    const convId = getCanonicalConversationId(mockUser.id, mockCandidate.id);
    const parsed = parseConversationParticipants(convId);
    expect(parsed).toEqual([mockUser.id, mockCandidate.id].sort());

    expect(parseConversationParticipants(`conv_usr_${mockUser.id}`)).toBeNull();
    expect(parseConversationParticipants(`conv_usr_usr_${mockUser.id}`)).toBeNull();
  });

  it('4. dbService.createMatchConversation canonicalizes participantOne and participantTwo ordering', () => {
    const conv = dbService.createMatchConversation(mockCandidate, 'Assalamu Alaikum');
    const [p1Expected, p2Expected] = [mockUser.id, mockCandidate.id].sort();

    expect(conv.id).toBe(`conv_${p1Expected}_${p2Expected}`);
    expect(conv.participantOne).toBe(p1Expected);
    expect(conv.participantTwo).toBe(p2Expected);
    expect(conv.otherUser.id).toBe(mockCandidate.id);
    expect(conv.lastMessageText).toBe('Assalamu Alaikum');
  });

  it('5. dbService.createMatchConversation rejects ghost participant "usr"', () => {
    const ghostCandidate: UserProfile = { ...mockCandidate, id: 'usr' };
    const conv = dbService.createMatchConversation(ghostCandidate);
    // Should not create or add ghost conversation
    const allConvs = dbService.getConversations();
    expect(allConvs.some(c => c.id?.includes('conv_usr_usr') || c.participantTwo === 'usr')).toBe(false);
  });

  it('6. dbService.fetchLiveConversations purges any corrupt conv_usr_usr records from local storage', async () => {
    // Seed corrupted conversation in local storage
    const corruptConv = {
      id: `conv_usr_usr_${mockUser.id}`,
      participantOne: mockUser.id,
      participantTwo: 'usr',
      otherUser: { id: 'usr', fullName: 'Ghost' },
      messages: []
    };
    localStorage.setItem('serene_real_conversations_v3', JSON.stringify([corruptConv]));

    // Mock remote returning empty list
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/conversations')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, conversations: [] })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    const liveList = await dbService.fetchLiveConversations();
    expect(liveList.some(c => c.id.includes('conv_usr_usr') || c.otherUser?.id === 'usr')).toBe(false);

    // Verify localStorage also purged
    const stored = JSON.parse(localStorage.getItem('serene_real_conversations_v3') || '[]');
    expect(stored.some((c: any) => c.id.includes('conv_usr_usr') || c.otherUser?.id === 'usr')).toBe(false);
  });
});
