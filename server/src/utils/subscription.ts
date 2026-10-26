export interface SubscriptionValidationResult {
  isVip: boolean;
  tier: 'free' | 'barakah_vip' | string;
  subscriptionExpiry: string | null;
  isExpired: boolean;
  daysRemaining: number | null;
}

/**
 * Calculates ISO subscription expiry date based on requested duration.
 * Supported durations:
 * - 7: 7-day Trial / Week
 * - 30: 1 Month (Standard)
 * - 90: 3 Months (Quarterly)
 * - 365: 1 Year (Annual)
 * - 'lifetime' / null: Permanent lifetime access (no expiry)
 */
export function calculateSubscriptionExpiry(duration?: number | string | null): string | null {
  if (duration === 'lifetime' || duration === 'permanent' || duration === null) {
    return null;
  }

  if (typeof duration === 'string' && isNaN(Number(duration))) {
    const parsed = new Date(duration);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  const days = Number(duration) > 0 ? Number(duration) : 30; // default 30 days
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Validates and atomically enforces subscription expiry on both `users` and `user_wallets` tables.
 * If expired:
 *  - resets `users.is_vip = 0`
 *  - resets `user_wallets.subscription_tier = 'free'`
 *  - resets `user_wallets.daily_messages_quota = 15`
 */
export async function syncAndValidateSubscription(db: any, userId: string): Promise<SubscriptionValidationResult> {
  if (!db || !userId) {
    return {
      isVip: false,
      tier: 'free',
      subscriptionExpiry: null,
      isExpired: false,
      daysRemaining: 0
    };
  }

  try {
    const wallet: any = await db.prepare(
      'SELECT subscription_tier, subscription_expiry, daily_messages_quota FROM user_wallets WHERE user_id = ?'
    ).bind(userId).first();

    const user: any = await db.prepare(
      'SELECT is_vip FROM users WHERE id = ?'
    ).bind(userId).first();

    const isVipTier = wallet?.subscription_tier === 'barakah_vip' || wallet?.subscription_tier === 'vip' || Boolean(user?.is_vip);

    if (!isVipTier) {
      return {
        isVip: false,
        tier: wallet?.subscription_tier || 'free',
        subscriptionExpiry: wallet?.subscription_expiry || null,
        isExpired: false,
        daysRemaining: 0
      };
    }

    const expiryStr = wallet?.subscription_expiry;

    // Lifetime grant if expiry is null
    if (!expiryStr) {
      return {
        isVip: true,
        tier: 'barakah_vip',
        subscriptionExpiry: null,
        isExpired: false,
        daysRemaining: null
      };
    }

    const expiryTime = new Date(expiryStr).getTime();
    const now = Date.now();

    // Check if subscription period has expired
    if (expiryTime <= now) {
      await db.prepare(`
        UPDATE user_wallets 
        SET subscription_tier = 'free', 
            daily_messages_quota = 15
        WHERE user_id = ?
      `).bind(userId).run();

      await db.prepare(`
        UPDATE users 
        SET is_vip = 0, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(userId).run();

      return {
        isVip: false,
        tier: 'free',
        subscriptionExpiry: expiryStr,
        isExpired: true,
        daysRemaining: 0
      };
    }

    // Active subscription
    const daysRemaining = Math.max(1, Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24)));
    return {
      isVip: true,
      tier: 'barakah_vip',
      subscriptionExpiry: expiryStr,
      isExpired: false,
      daysRemaining
    };
  } catch (err) {
    console.warn('syncAndValidateSubscription notice:', err);
    return {
      isVip: false,
      tier: 'free',
      subscriptionExpiry: null,
      isExpired: false,
      daysRemaining: 0
    };
  }
}
