/**
 * Canonical Room & Partner ID Resolution Utilities
 * Ensures deterministic, bi-directional conversation ID consistency across frontend and server.
 */

export const QURB_OFFICIAL_USER_ID = 'usr_qurb_official';

/**
 * Validates that an ID is a legitimate participant user ID and not a corrupted fragment.
 */
export function isValidUserId(id: string | null | undefined): boolean {
  if (!id || typeof id !== 'string') return false;
  const trimmed = id.trim();
  if (trimmed === 'usr' || trimmed === 'usr_usr' || trimmed.startsWith('usr_usr') || trimmed.startsWith('usr_usr_')) {
    return false;
  }
  return trimmed.length >= 3;
}

/**
 * Returns the canonical conversation ID for two users.
 * Deterministic: getCanonicalConversationId('usr_b', 'usr_a') === 'conv_usr_a_usr_b'
 */
export function getCanonicalConversationId(user1Id: string, user2Id: string): string {
  if (!user1Id || !user2Id) return '';
  if (user1Id === QURB_OFFICIAL_USER_ID) return `conv_qurb_official_${user2Id}`;
  if (user2Id === QURB_OFFICIAL_USER_ID) return `conv_qurb_official_${user1Id}`;
  const sorted = [user1Id, user2Id].sort();
  return `conv_${sorted[0]}_${sorted[1]}`;
}

/**
 * Robustly extracts the partner user ID from a conversation ID given the current user's ID.
 * Never slices or splits naively on '_' because user IDs commonly contain underscores (e.g. 'usr_123', 'usr_seed_pk_female_1').
 * Never returns 'usr' or malformed fragments.
 */
export function extractPartnerIdFromConvId(convId: string, currentUserId: string): string | null {
  if (!convId || !currentUserId || !isValidUserId(currentUserId)) return null;
  if (convId.includes('qurb_official')) return QURB_OFFICIAL_USER_ID;
  if (!convId.startsWith('conv_')) return null;

  const raw = convId.slice(5); // strip leading 'conv_'

  // Case 1: currentUserId is the first participant (conv_currentUser_partner)
  if (raw.startsWith(currentUserId + '_')) {
    const candidate = raw.slice(currentUserId.length + 1);
    if (isValidUserId(candidate)) {
      return candidate;
    }
  }

  // Case 2: currentUserId is the second participant (conv_partner_currentUser)
  if (raw.endsWith('_' + currentUserId)) {
    const candidate = raw.slice(0, raw.length - currentUserId.length - 1);
    if (isValidUserId(candidate)) {
      return candidate;
    }
  }

  // Case 3: Both user IDs start with 'usr_' (e.g. usr_123_usr_456)
  const secondUsrIndex = raw.indexOf('_usr_', 1);
  if (secondUsrIndex !== -1) {
    const p1 = raw.substring(0, secondUsrIndex);
    const p2 = raw.substring(secondUsrIndex + 1);
    if (p1 === currentUserId && isValidUserId(p2)) return p2;
    if (p2 === currentUserId && isValidUserId(p1)) return p1;
  }

  return null;
}

/**
 * Extracts both participant IDs from a conversation ID without knowing currentUser.
 * Returns [p1, p2] sorted, or null if cannot be determined reliably.
 */
export function parseConversationParticipants(convId: string): [string, string] | null {
  if (!convId || !convId.startsWith('conv_') || convId.includes('qurb_official')) return null;
  const raw = convId.slice(5);

  const secondUsrIndex = raw.indexOf('_usr_', 1);
  if (secondUsrIndex !== -1) {
    const p1 = raw.substring(0, secondUsrIndex);
    const p2 = raw.substring(secondUsrIndex + 1);
    if (isValidUserId(p1) && isValidUserId(p2)) {
      return [p1, p2].sort() as [string, string];
    }
  }

  return null;
}
