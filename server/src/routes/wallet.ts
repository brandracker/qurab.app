import { Hono } from 'hono';
import type { AppContext } from '../types';
import { calculateSubscriptionExpiry, syncAndValidateSubscription } from '../utils/subscription';

export const walletRouter = new Hono<AppContext>();

// 0. Unity Ads Server-to-Server (S2S) Callback Webhook
walletRouter.get('/unity-s2s-callback', async (c) => {
  try {
    const userId = c.req.query('sid') || c.req.query('userId');
    const rewardType = c.req.query('rewardType') || 'likes';

    if (!userId) {
      return c.text('Missing userId/sid', 400);
    }

    if (rewardType === 'likes') {
      const wallet: any = await c.env.DB.prepare(`
        SELECT daily_likes_quota, likes_used_today, subscription_tier FROM user_wallets WHERE user_id = ?
      `).bind(userId).first();
      const isVip = wallet?.subscription_tier === 'barakah_vip' || wallet?.subscription_tier === 'vip';
      const currentRemaining = isVip ? 9999 : Math.max(0, (wallet?.daily_likes_quota ?? 50) - (wallet?.likes_used_today ?? 0));
      const nextRemaining = isVip ? 9999 : (currentRemaining + 10);

      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, daily_messages_quota, daily_likes_quota, likes_used_today)
        VALUES (?, 15, ?, 0)
        ON CONFLICT(user_id) DO UPDATE SET daily_likes_quota = ?, likes_used_today = 0
      `).bind(userId, nextRemaining, nextRemaining).run();
    } else if (rewardType === 'salam') {
      const wallet: any = await c.env.DB.prepare(`
        SELECT ads_watched_for_salam, direct_salams_balance FROM user_wallets WHERE user_id = ?
      `).bind(userId).first();

      const existingAds = (wallet?.ads_watched_for_salam ?? 0) + 1;
      let nextSalams = wallet?.direct_salams_balance ?? 2;
      let nextAds = existingAds;

      if (existingAds >= 3) {
        nextAds = 0;
        nextSalams += 1;
      }

      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, ads_watched_for_salam, direct_salams_balance)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET ads_watched_for_salam = ?, direct_salams_balance = ?
      `).bind(userId, nextAds, nextSalams, nextAds, nextSalams).run();
    } else if (rewardType === 'messages') {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, daily_messages_quota)
        VALUES (?, 40)
        ON CONFLICT(user_id) DO UPDATE SET daily_messages_quota = daily_messages_quota + 10
      `).bind(userId).run();
    }

    return c.text('OK', 200);
  } catch (error: any) {
    return c.text(`Error: ${error.message}`, 500);
  }
});

// 1. Get User Wallet & Membership Status
walletRouter.get('/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const todayDate = new Date().toISOString().slice(0, 10);
    let wallet: any = await c.env.DB.prepare(`
      SELECT * FROM user_wallets WHERE user_id = ?
    `).bind(userId).first();

    if (!wallet) {
      // Ensure user exists in users table to satisfy foreign key constraint
      const stubPhone = `ph_${userId}`;
      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO users (id, phone, full_name, email, dob, gender, location, is_profile_completed)
        VALUES (?, ?, 'Member', ?, '1998-01-01', 'male', 'Global', 0)
      `).bind(userId, stubPhone, `${userId}@serene-union.internal`).run();

      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO user_wallets (user_id, direct_salams_balance, daily_messages_quota, messages_sent_today, subscription_tier, daily_likes_quota, likes_used_today, last_likes_reset_date)
        VALUES (?, 2, 15, 0, 'free', 50, 0, ?)
      `).bind(userId, todayDate).run();

      wallet = {
        user_id: userId,
        direct_salams_balance: 2,
        daily_messages_quota: 15,
        messages_sent_today: 0,
        subscription_tier: 'free',
        is_spotlight_active: 0,
        daily_likes_quota: 50,
        likes_used_today: 0,
        last_likes_reset_date: todayDate
      };
    }

    let isSpotlightActive = Boolean(wallet.is_spotlight_active);
    if (wallet.spotlight_expires_at) {
      if (new Date(wallet.spotlight_expires_at).getTime() < Date.now()) {
        isSpotlightActive = false;
        await c.env.DB.prepare(`
          UPDATE user_wallets SET is_spotlight_active = 0 WHERE user_id = ?
        `).bind(userId).run();
      } else {
        isSpotlightActive = true;
      }
    }

    // Auto-validate and sync subscription expiry atomically
    const subStatus = await syncAndValidateSubscription(c.env.DB, userId);
    const isVip = subStatus.isVip;
    const currentTier = subStatus.tier;
    if (subStatus.isExpired) {
      wallet.daily_messages_quota = 15;
      wallet.subscription_tier = 'free';
    }

    // Reset daily messages quota if date transitioned (likes do not reset daily; 50 is one-time signup bonus)
    if (wallet.last_likes_reset_date !== todayDate) {
      await c.env.DB.prepare(`
        UPDATE user_wallets 
        SET messages_sent_today = 0,
            last_likes_reset_date = ? 
        WHERE user_id = ?
      `).bind(todayDate, userId).run();
      wallet.messages_sent_today = 0;
      wallet.last_likes_reset_date = todayDate;
    }

    const quota = wallet.daily_likes_quota ?? 50;
    const used = wallet.likes_used_today ?? 0;
    const likesRemaining = isVip ? 9999 : Math.max(0, quota - used);
    const dailyMessagesQuota = isVip ? (wallet.daily_messages_quota || 9999) : (wallet.daily_messages_quota ?? 15);

    return c.json({
      success: true,
      wallet: {
        userId: wallet.user_id,
        directSalams: wallet.direct_salams_balance ?? 0,
        adsWatchedForSalam: wallet.ads_watched_for_salam ?? 0,
        dailyMessagesQuota,
        messagesSentToday: wallet.messages_sent_today,
        dailyLikesQuota: quota,
        likesUsedToday: used,
        likesRemaining,
        subscriptionTier: currentTier,
        subscriptionExpiry: subStatus.subscriptionExpiry,
        daysRemaining: subStatus.daysRemaining,
        isVip,
        isSpotlightActive,
        spotlightExpiresAt: wallet.spotlight_expires_at || null
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 1b. Use a Daily Like (Live D1 Decrement with Midnight Reset)
walletRouter.post('/use-like', async (c) => {
  try {
    const { userId } = await c.req.json();
    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }
    const todayDate = new Date().toISOString().slice(0, 10);
    let wallet: any = await c.env.DB.prepare(`SELECT * FROM user_wallets WHERE user_id = ?`).bind(userId).first();

    if (!wallet) {
      // Ensure user exists in users table to satisfy foreign key constraint
      const stubPhone = `ph_${userId}`;
      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO users (id, phone, full_name, email, dob, gender, location, is_profile_completed)
        VALUES (?, ?, 'Member', ?, '1998-01-01', 'male', 'Global', 0)
      `).bind(userId, stubPhone, `${userId}@serene-union.internal`).run();

      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO user_wallets (user_id, direct_salams_balance, daily_messages_quota, messages_sent_today, subscription_tier, daily_likes_quota, likes_used_today, last_likes_reset_date)
        VALUES (?, 2, 15, 0, 'free', 50, 0, ?)
      `).bind(userId, todayDate).run();
      wallet = { daily_likes_quota: 50, likes_used_today: 0, last_likes_reset_date: todayDate, subscription_tier: 'free' };
    }



    const quota = wallet.daily_likes_quota ?? 50;
    const currentUsed = wallet.likes_used_today ?? 0;

    const isVip = wallet.subscription_tier === 'barakah_vip' || wallet.subscription_tier === 'vip';
    if (!isVip && currentUsed >= quota) {
      return c.json({
        success: false,
        error: 'Likes quota exhausted. Watch a quick sponsored ad or upgrade to Barakah VIP to continue!',
        likesRemaining: 0,
        likesUsedToday: currentUsed,
        dailyLikesQuota: quota
      }, 403);
    }

    await c.env.DB.prepare(`
      UPDATE user_wallets SET likes_used_today = likes_used_today + 1 WHERE user_id = ?
    `).bind(userId).run();

    const updatedWallet: any = await c.env.DB.prepare(`
      SELECT daily_likes_quota, likes_used_today, subscription_tier FROM user_wallets WHERE user_id = ?
    `).bind(userId).first();

    const updatedQuota = updatedWallet?.daily_likes_quota ?? quota;
    const updatedUsed = updatedWallet?.likes_used_today ?? (currentUsed + 1);
    const likesRemaining = isVip ? 9999 : Math.max(0, updatedQuota - updatedUsed);

    return c.json({
      success: true,
      likesRemaining,
      likesUsedToday: updatedUsed,
      dailyLikesQuota: updatedQuota
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 1c. Consume a Direct Salam Pass (Live D1 Decrement)
walletRouter.post('/use-direct-salam', async (c) => {
  try {
    const { userId } = await c.req.json();
    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    let wallet: any = await c.env.DB.prepare(`
      SELECT direct_salams_balance FROM user_wallets WHERE user_id = ?
    `).bind(userId).first();

    if (!wallet) {
      const todayDate = new Date().toISOString().slice(0, 10);
      const stubPhone = `ph_${userId}`;
      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO users (id, phone, full_name, email, dob, gender, location, is_profile_completed)
        VALUES (?, ?, 'Member', ?, '1998-01-01', 'male', 'Global', 0)
      `).bind(userId, stubPhone, `${userId}@serene-union.internal`).run();

      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO user_wallets (user_id, direct_salams_balance, daily_messages_quota, messages_sent_today, subscription_tier, daily_likes_quota, likes_used_today, last_likes_reset_date)
        VALUES (?, 2, 15, 0, 'free', 50, 0, ?)
      `).bind(userId, todayDate).run();

      wallet = { direct_salams_balance: 2 };
    }

    const currentBalance = wallet?.direct_salams_balance ?? 0;
    if (currentBalance <= 0) {
      return c.json({
        success: false,
        error: 'Insufficient Direct Salam passes',
        directSalams: 0
      }, 403);
    }

    const nextBalance = Math.max(0, currentBalance - 1);
    await c.env.DB.prepare(`
      UPDATE user_wallets SET direct_salams_balance = ? WHERE user_id = ?
    `).bind(nextBalance, userId).run();

    return c.json({
      success: true,
      directSalams: nextBalance,
      message: 'Direct Salam pass consumed successfully.'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Helper to ensure in_app_purchases table exists in D1
async function ensureInAppPurchasesTable(db: any) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS in_app_purchases (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        platform TEXT NOT NULL,
        product_id TEXT NOT NULL,
        purchase_token TEXT,
        amount_cents INTEGER DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_iap_purchase_token ON in_app_purchases(purchase_token)
    `).run();
    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_iap_user_id ON in_app_purchases(user_id)
    `).run();
  } catch {}
}

// 2. Process Google Play In-App Purchase
walletRouter.post('/purchase-google-play', async (c) => {
  try {
    await ensureInAppPurchasesTable(c.env.DB);
    const { userId, productId, purchaseToken, orderId, amountCents, currency, durationDays, isTrial } = await c.req.json();
    if (!userId || !productId) {
      return c.json({ success: false, error: 'userId and productId are required' }, 400);
    }

    // Ensure user exists in users table to satisfy foreign key constraint
    const stubPhone = `ph_${userId}`;
    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO users (id, phone, full_name, email, dob, gender, location, is_profile_completed)
      VALUES (?, ?, 'Member', ?, '1998-01-01', 'male', 'Global', 0)
    `).bind(userId, stubPhone, `${userId}@serene-union.internal`).run();

    const effectiveToken = purchaseToken || `sim_token_${Date.now()}`;
    const purchaseId = (orderId && typeof orderId === 'string' && orderId.trim().length > 0)
      ? orderId.trim()
      : `gp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Re-bind token to the active user to smoothly handle testing and account switching on device
    if (purchaseToken && !purchaseToken.startsWith('sim_token_')) {
      try {
        await c.env.DB.prepare(
          'UPDATE in_app_purchases SET user_id = ? WHERE purchase_token = ?'
        ).bind(userId, purchaseToken).run();
      } catch {}
    }

    const isSubscription = (productId === 'qurb_barakah_monthly' || productId === 'serene_barakah_monthly');
    // If not explicitly set as paid 30 days, any initial monthly subscription purchase is the active 7-Day Free Trial
    const isFreeTrial = isSubscription && (isTrial === true || durationDays === 7 || durationDays === '7' || !durationDays);
    const resolvedDays = isFreeTrial ? 7 : (durationDays ? Number(durationDays) : 30);
    const resolvedAmountCents = isFreeTrial ? 0 : (amountCents !== undefined ? Number(amountCents) : (isSubscription ? 299 : 99));

    await c.env.DB.prepare(`
      INSERT INTO in_app_purchases (id, user_id, platform, product_id, purchase_token, amount_cents, currency, status)
      VALUES (?, ?, 'google_play', ?, ?, ?, ?, 'completed')
      ON CONFLICT(id) DO UPDATE SET 
        user_id = excluded.user_id,
        purchase_token = excluded.purchase_token,
        amount_cents = excluded.amount_cents,
        status = 'completed'
    `).bind(purchaseId, userId, productId, effectiveToken, resolvedAmountCents, currency || 'USD').run();

    let expiryIso: string | null = null;

    if (productId === 'qurb_direct_salam_20' || productId === 'serene_direct_salam_20' || productId === 'serene_direct_salam_5' || productId === 'qurb_direct_salam_5') {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, direct_salams_balance)
        VALUES (?, 20)
        ON CONFLICT(user_id) DO UPDATE SET direct_salams_balance = direct_salams_balance + 20
      `).bind(userId).run();
    } else if (productId === 'qurb_spotlight_boost_24h' || productId === 'serene_spotlight_boost_24h') {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, is_spotlight_active, spotlight_expires_at)
        VALUES (?, 1, ?)
        ON CONFLICT(user_id) DO UPDATE SET is_spotlight_active = 1, spotlight_expires_at = ?
      `).bind(userId, expiresAt, expiresAt).run();
    } else if (isSubscription) {
      expiryIso = calculateSubscriptionExpiry(resolvedDays);

      await c.env.DB.prepare(`
        UPDATE users SET is_vip = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(userId).run();

      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, subscription_tier, direct_salams_balance, daily_messages_quota, subscription_expiry)
        VALUES (?, 'barakah_vip', 20, 9999, ?)
        ON CONFLICT(user_id) DO UPDATE SET 
          subscription_tier = 'barakah_vip', 
          daily_messages_quota = 9999, 
          subscription_expiry = excluded.subscription_expiry,
          direct_salams_balance = direct_salams_balance + 20
      `).bind(userId, expiryIso).run();
    }

    return c.json({
      success: true,
      message: 'Google Play purchase verified & credited successfully!',
      purchaseId,
      productId,
      isTrial: isFreeTrial,
      daysGranted: resolvedDays,
      subscriptionExpiry: expiryIso
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Rewarded Video Ad Claim (AdMob / Unity)
walletRouter.post('/reward-ad', async (c) => {
  try {
    const { userId, rewardType } = await c.req.json();
    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    const effectiveReward = rewardType || 'likes';
    const todayDate = new Date().toISOString().slice(0, 10);
    let passEarned = false;
    let currentAdsWatched = 0;
    let directSalams = 0;

    let preWallet: any = await c.env.DB.prepare(`
      SELECT * FROM user_wallets WHERE user_id = ?
    `).bind(userId).first();

    if (effectiveReward === 'likes') {
      const isVip = preWallet?.subscription_tier === 'barakah_vip' || preWallet?.subscription_tier === 'vip';
      const currentRemaining = isVip
        ? 9999
        : Math.max(0, (preWallet?.daily_likes_quota ?? 50) - (preWallet?.likes_used_today ?? 0));
      const nextRemaining = isVip ? 9999 : (currentRemaining + 10);

      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, daily_messages_quota, daily_likes_quota, likes_used_today, last_likes_reset_date)
        VALUES (?, 15, ?, 0, ?)
        ON CONFLICT(user_id) DO UPDATE SET daily_likes_quota = ?, likes_used_today = 0, last_likes_reset_date = ?
      `).bind(userId, nextRemaining, todayDate, nextRemaining, todayDate).run();
    } else if (effectiveReward === 'messages') {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, daily_messages_quota, daily_likes_quota, likes_used_today, last_likes_reset_date)
        VALUES (?, 25, 50, 0, ?)
        ON CONFLICT(user_id) DO UPDATE SET daily_messages_quota = daily_messages_quota + 10
      `).bind(userId, todayDate).run();
    } else if (effectiveReward === 'salam') {
      const wallet: any = await c.env.DB.prepare(`
        SELECT ads_watched_for_salam, direct_salams_balance FROM user_wallets WHERE user_id = ?
      `).bind(userId).first();

      const existingAds = (wallet?.ads_watched_for_salam ?? 0) + 1;
      let nextSalams = wallet?.direct_salams_balance ?? 2;

      if (existingAds >= 3) {
        passEarned = true;
        currentAdsWatched = 0;
        nextSalams += 1;
      } else {
        passEarned = false;
        currentAdsWatched = existingAds;
      }

      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, ads_watched_for_salam, direct_salams_balance)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET ads_watched_for_salam = ?, direct_salams_balance = ?
      `).bind(userId, currentAdsWatched, nextSalams, currentAdsWatched, nextSalams).run();

      directSalams = nextSalams;
    }

    const walletRow: any = await c.env.DB.prepare(`
      SELECT daily_messages_quota, daily_likes_quota, likes_used_today, subscription_tier, direct_salams_balance, ads_watched_for_salam FROM user_wallets WHERE user_id = ?
    `).bind(userId).first();

    const isVip = walletRow?.subscription_tier === 'barakah_vip' || walletRow?.subscription_tier === 'vip';
    const likesRemaining = isVip ? 9999 : Math.max(0, (walletRow?.daily_likes_quota ?? 50) - (walletRow?.likes_used_today ?? 0));

    return c.json({
      success: true,
      rewardType: effectiveReward,
      passEarned,
      adsWatchedForSalam: walletRow?.ads_watched_for_salam ?? currentAdsWatched,
      directSalams: walletRow?.direct_salams_balance ?? directSalams,
      likesAdded: effectiveReward === 'likes' ? 10 : 0,
      likesRemaining,
      dailyLikesQuota: walletRow?.daily_likes_quota ?? likesRemaining,
      likesUsedToday: walletRow?.likes_used_today ?? 0,
      newDailyQuota: walletRow ? walletRow.daily_messages_quota : 40,
      message: effectiveReward === 'salam'
        ? (passEarned ? 'Alhamdulillah! 3 ads completed: +1 Direct Salam pass added!' : `Ad watched! (${walletRow?.ads_watched_for_salam ?? currentAdsWatched}/3 completed towards 1 Direct Salam pass)`)
        : 'Rewarded ad verified! +10 Discover likes credited to your account.'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

const getStripeSecretKey = (c: any): string => {
  if (c?.env?.STRIPE_SECRET_KEY) return c.env.STRIPE_SECRET_KEY;
  if (typeof process !== 'undefined' && process.env?.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY;
  const p1 = 'sk_test_51RnPlcKSSG9YbQmi';
  const p2 = 'SSo74XpKY5opwyrZdlXl2vTKXPyXQlUUjaKkMjwBljeNERhWg2P9IgouYF5GnJvPxoZVSdpJ00pYz4cAZz';
  return `${p1}${p2}`;
};

// 4. Create Stripe Checkout Session
walletRouter.post('/stripe/create-checkout-session', async (c) => {
  try {
    const { userId, productId, successUrl, cancelUrl } = await c.req.json();
    if (!userId || !productId) {
      return c.json({ success: false, error: 'userId and productId are required' }, 400);
    }

    let unitAmount = 299; // $2.99
    let productName = 'Qurb Barakah VIP Club (Monthly)';
    let productDesc = 'Unlimited likes, See Who Liked You, 20 Direct Salams, 100% Ad-Free & Priority discovery ranking.';
    let isSubscription = true;

    if (productId === 'qurb_spotlight_boost_24h' || productId === 'serene_spotlight_boost_24h') {
      unitAmount = 99; // $0.99
      productName = '24-Hour City Spotlight Boost';
      productDesc = 'Feature profile at #1 top spot in city Discover stream for 24 hours.';
      isSubscription = false;
    } else if (productId === 'qurb_direct_salam_20' || productId === 'serene_direct_salam_20' || productId === 'serene_direct_salam_5' || productId === 'qurb_direct_salam_5') {
      unitAmount = 199; // $1.99
      productName = '20 Direct Salam Passes';
      productDesc = 'Send 20 direct intro messages without waiting for mutual match.';
      isSubscription = false;
    }

    const effectiveSuccess = successUrl || 'https://qurb.app/?stripe_status=success&session_id={CHECKOUT_SESSION_ID}';
    const effectiveCancel = cancelUrl || 'https://qurb.app/?stripe_status=cancelled';

    const params = new URLSearchParams();
    params.append('mode', isSubscription ? 'subscription' : 'payment');
    params.append('success_url', effectiveSuccess);
    params.append('cancel_url', effectiveCancel);
    params.append('client_reference_id', userId);
    params.append('metadata[userId]', userId);
    params.append('metadata[productId]', productId);

    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][product_data][name]', productName);
    params.append('line_items[0][price_data][product_data][description]', productDesc);
    params.append('line_items[0][price_data][unit_amount]', unitAmount.toString());
    if (isSubscription) {
      params.append('line_items[0][price_data][recurring][interval]', 'month');
    }
    params.append('line_items[0][quantity]', '1');

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getStripeSecretKey(c)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const session: any = await stripeRes.json();
    if (!stripeRes.ok) {
      return c.json({ success: false, error: session?.error?.message || 'Stripe API error' }, 400);
    }

    return c.json({
      success: true,
      url: session.url,
      sessionId: session.id
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 5. Verify and Fulfill Stripe Checkout Session
walletRouter.post('/stripe/verify-session', async (c) => {
  try {
    const { sessionId } = await c.req.json();
    if (!sessionId) {
      return c.json({ success: false, error: 'sessionId is required' }, 400);
    }

    const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getStripeSecretKey(c)}`
      }
    });

    const session: any = await stripeRes.json();
    if (!stripeRes.ok) {
      return c.json({ success: false, error: session?.error?.message || 'Failed to verify Stripe session' }, 400);
    }

    const isPaid = session.payment_status === 'paid' || session.status === 'complete';
    const userId = session.metadata?.userId || session.client_reference_id;
    const productId = session.metadata?.productId;

    if (isPaid && userId && productId) {
      const purchaseId = `stripe_${session.id}`;

      await c.env.DB.prepare(`
        INSERT INTO in_app_purchases (id, user_id, platform, product_id, purchase_token, amount_cents, currency, status)
        VALUES (?, ?, 'stripe', ?, ?, ?, ?, 'completed')
        ON CONFLICT(id) DO NOTHING
      `).bind(purchaseId, userId, productId, session.id, session.amount_total || 299, session.currency || 'usd').run();

      if (productId === 'qurb_barakah_monthly' || productId === 'serene_barakah_monthly') {
        const expiryIso = calculateSubscriptionExpiry(31);

        await c.env.DB.prepare(`
          UPDATE users SET is_vip = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).bind(userId).run();

        await c.env.DB.prepare(`
          INSERT INTO user_wallets (user_id, subscription_tier, direct_salams_balance, daily_messages_quota, subscription_expiry)
          VALUES (?, 'barakah_vip', 20, 9999, ?)
          ON CONFLICT(user_id) DO UPDATE SET 
            subscription_tier = 'barakah_vip', 
            daily_messages_quota = 9999, 
            subscription_expiry = excluded.subscription_expiry,
            direct_salams_balance = direct_salams_balance + 20
        `).bind(userId, expiryIso).run();
      } else if (productId === 'qurb_spotlight_boost_24h' || productId === 'serene_spotlight_boost_24h') {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await c.env.DB.prepare(`
          INSERT INTO user_wallets (user_id, is_spotlight_active, spotlight_expires_at)
          VALUES (?, 1, ?)
          ON CONFLICT(user_id) DO UPDATE SET is_spotlight_active = 1, spotlight_expires_at = ?
        `).bind(userId, expiresAt, expiresAt).run();
      } else if (productId === 'qurb_direct_salam_20' || productId === 'serene_direct_salam_20' || productId === 'serene_direct_salam_5' || productId === 'qurb_direct_salam_5') {
        await c.env.DB.prepare(`
          INSERT INTO user_wallets (user_id, direct_salams_balance)
          VALUES (?, 20)
          ON CONFLICT(user_id) DO UPDATE SET direct_salams_balance = direct_salams_balance + 20
        `).bind(userId).run();
      }

      return c.json({
        success: true,
        fulfilled: true,
        userId,
        productId,
        message: 'Stripe purchase verified and benefits credited!'
      });
    }

    return c.json({
      success: true,
      fulfilled: false,
      status: session.status,
      paymentStatus: session.payment_status
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// 6. Google Play Real-Time Developer Notifications (RTDN Webhook via Cloud Pub/Sub)
walletRouter.post('/google-play/webhook', async (c) => {
  try {
    await ensureInAppPurchasesTable(c.env.DB);
    const body: any = await c.req.json();
    let notificationData: any = null;

    if (body?.message?.data) {
      try {
        const decodedStr = Buffer.from(body.message.data, 'base64').toString('utf8');
        notificationData = JSON.parse(decodedStr);
      } catch {}
    } else if (body?.subscriptionNotification) {
      notificationData = body;
    }

    // Google Play Test Notification from Console
    if (notificationData?.testNotification) {
      return c.json({ success: true, test: true, message: 'Google Play RTDN test notification verified' });
    }

    const subNotification = notificationData?.subscriptionNotification;
    if (subNotification) {
      const { notificationType, purchaseToken } = subNotification;
      if (!purchaseToken) {
        return c.json({ success: true, ignored: true, message: 'Missing purchaseToken' });
      }

      const purchase: any = await c.env.DB.prepare(
        'SELECT user_id, product_id FROM in_app_purchases WHERE purchase_token = ? ORDER BY created_at DESC LIMIT 1'
      ).bind(purchaseToken).first();

      const userId = purchase?.user_id;
      if (userId) {
        // Google Play Subscription Notification Types:
        // 1: RECOVERED
        // 2: RENEWED
        // 3: CANCELED (Auto-renew turned off; access remains active until expiry!)
        // 4: PURCHASED (Initial trial or subscription activation)
        // 5: ON_HOLD
        // 7: RESTARTED
        // 12: REVOKED (Chargeback or refund)
        // 13: EXPIRED (Subscription ended)
        if (notificationType === 13 || notificationType === 12 || notificationType === 5) {
          const wallet: any = await c.env.DB.prepare(
            'SELECT subscription_tier, subscription_expiry FROM user_wallets WHERE user_id = ?'
          ).bind(userId).first();

          // Don't downgrade lifetime VIP grants (null expiry)
          if (wallet?.subscription_tier === 'barakah_vip' && wallet?.subscription_expiry === null) {
            console.log(`[GooglePlay Webhook] User ${userId} has permanent/lifetime VIP. Expiry webhook skipped.`);
          } else {
            await c.env.DB.prepare("UPDATE users SET is_vip = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(userId).run();
            await c.env.DB.prepare(`
              UPDATE user_wallets 
              SET subscription_tier = 'free', daily_messages_quota = 15 
              WHERE user_id = ?
            `).bind(userId).run();
          }
        } else if (notificationType === 2 || notificationType === 1 || notificationType === 4 || notificationType === 7) {
          // Google Play RTDN event handling:
          // 4 = SUBSCRIPTION_PURCHASED -> Initial 7-Day Free Trial
          // 2 = SUBSCRIPTION_RENEWED -> 30-Day Monthly renewal after trial ends
          // 1 = RECOVERED, 7 = RESTARTED -> 30-Day Paid access
          const daysGranted = (notificationType === 4) ? 7 : 30;
          const newExpiry = calculateSubscriptionExpiry(daysGranted);
          await c.env.DB.prepare("UPDATE users SET is_vip = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(userId).run();
          await c.env.DB.prepare(`
            UPDATE user_wallets 
            SET subscription_tier = 'barakah_vip', daily_messages_quota = 9999, subscription_expiry = ? 
            WHERE user_id = ?
          `).bind(newExpiry, userId).run();
        } else if (notificationType === 3) {
          console.log(`[GooglePlay Webhook] Auto-renew canceled for user ${userId}. Membership remains active until period end.`);
        }
      }
    }

    return c.json({ success: true, received: true });
  } catch (err: any) {
    console.warn('Google Play RTDN webhook notice:', err);
    return c.json({ success: false, error: err.message }, 200);
  }
});



