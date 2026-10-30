import { describe, it, expect } from 'vitest';
import { 
  getCanonicalConversationId, 
  extractPartnerIdFromConvId, 
  parseConversationParticipants,
  QURB_OFFICIAL_USER_ID 
} from '../../src/utils/conversation';

describe('Conversation Wiring & ID Normalization Unit Tests', () => {
  const user1 = 'usr_1787950367460';
  const user2 = 'usr_1788726208289';
  const seedUser = 'usr_seed_pk_female_1';

  it('1. getCanonicalConversationId is strictly deterministic regardless of parameter order', () => {
    const idA = getCanonicalConversationId(user1, user2);
    const idB = getCanonicalConversationId(user2, user1);
    expect(idA).toBe(idB);
    expect(idA).toBe(`conv_${[user1, user2].sort().join('_')}`);
  });

  it('2. getCanonicalConversationId correctly formats Qurb Official Channel rooms', () => {
    const officialRoom = getCanonicalConversationId(user1, QURB_OFFICIAL_USER_ID);
    expect(officialRoom).toBe(`conv_qurb_official_${user1}`);

    const officialRoomReverse = getCanonicalConversationId(QURB_OFFICIAL_USER_ID, user1);
    expect(officialRoomReverse).toBe(`conv_qurb_official_${user1}`);
  });

  it('3. extractPartnerIdFromConvId accurately extracts partner when current user is participant 1', () => {
    const convId = getCanonicalConversationId(user1, user2);
    // Find who is first
    const [p1, p2] = [user1, user2].sort();
    const partner = extractPartnerIdFromConvId(convId, p1);
    expect(partner).toBe(p2);
  });

  it('4. extractPartnerIdFromConvId accurately extracts partner when current user is participant 2', () => {
    const convId = getCanonicalConversationId(user1, user2);
    const [p1, p2] = [user1, user2].sort();
    const partner = extractPartnerIdFromConvId(convId, p2);
    expect(partner).toBe(p1);
  });

  it('5. extractPartnerIdFromConvId handles IDs with internal underscores (e.g. seed profiles) without shattering', () => {
    const convId = getCanonicalConversationId(user1, seedUser);
    expect(extractPartnerIdFromConvId(convId, user1)).toBe(seedUser);
    expect(extractPartnerIdFromConvId(convId, seedUser)).toBe(user1);
  });

  it('6. extractPartnerIdFromConvId NEVER returns ghost user "usr"', () => {
    const brokenRoom = `conv_usr_${user1}`;
    const result = extractPartnerIdFromConvId(brokenRoom, user1);
    expect(result).toBeNull();
    expect(result).not.toBe('usr');

    const doubleBroken = `conv_usr_usr_${user1}`;
    expect(extractPartnerIdFromConvId(doubleBroken, user1)).toBeNull();
  });

  it('7. parseConversationParticipants parses real IDs and rejects corrupted "usr" rooms', () => {
    const validRoom = getCanonicalConversationId(user1, user2);
    const parsed = parseConversationParticipants(validRoom);
    expect(parsed).not.toBeNull();
    expect(parsed?.[0]).toBe([user1, user2].sort()[0]);
    expect(parsed?.[1]).toBe([user1, user2].sort()[1]);

    const corruptedRoom = `conv_usr_${user1}`;
    expect(parseConversationParticipants(corruptedRoom)).toBeNull();

    const doubleCorrupted = `conv_usr_usr_${user1}`;
    expect(parseConversationParticipants(doubleCorrupted)).toBeNull();
  });
});
