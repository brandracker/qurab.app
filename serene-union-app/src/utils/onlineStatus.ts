import type { UserProfile } from '../types';

/**
 * Determines whether a user is currently considered online (green dot)
 * or away / offline (yellow dot).
 */
export function isUserOnline(user?: Partial<UserProfile> | null): boolean {
  if (!user) return false;

  // 1. Explicit boolean property
  if (typeof user.isOnline === 'boolean') {
    return user.isOnline;
  }

  // 2. Explicit last active timestamp (active within the last 15 minutes)
  const lastActiveStr = (user as any).lastActiveAt || user.lastActive;
  if (lastActiveStr) {
    const time = new Date(lastActiveStr).getTime();
    if (!isNaN(time)) {
      return (Date.now() - time) < 15 * 60 * 1000;
    }
  }

  // 3. Deterministic hash distribution for mock/seed profiles (~40% online, ~60% away)
  // Ensures consistent status across all screens (Mutual matches, New matches strip, Chat conversations)
  if (user.id) {
    let hash = 0;
    for (let i = 0; i < user.id.length; i++) {
      hash = (hash << 5) - hash + user.id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 5 < 2;
  }

  return false;
}

