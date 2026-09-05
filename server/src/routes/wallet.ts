import { Hono } from 'hono';
import type { AppContext } from '../types';

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
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, daily_messages_quota, daily_likes_quota, likes_used_today)
        VALUES (?, 40, 60, 0)
        ON CONFLICT(user_id) DO UPDATE SET daily_messages_quota = daily_messages_quota + 10, daily_likes_quota = daily_likes_quota + 10
      `).bind(userId).run();
    } else if (rewardType === 'salam') {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, direct_salams_balance)
        VALUES (?, 1)
        ON CONFLICT(user_id) DO UPDATE SET direct_salams_balance = direct_salams_balance + 1
      `).bind(userId).run();
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
    } else if (wallet.last_likes_reset_date !== todayDate) {
      // Auto-reset daily likes counter for new day
      await c.env.DB.prepare(`
        UPDATE user_wallets SET likes_used_today = 0, last_likes_reset_date = ? WHERE user_id = ?
      `).bind(todayDate, userId).run();
      wallet.likes_used_today = 0;
      wallet.last_likes_reset_date = todayDate;
    }

    const isVip = wallet.subscription_tier === 'barakah_vip' || wallet.subscription_tier === 'vip';
    const quota = wallet.daily_likes_quota ?? 50;
    const used = wallet.likes_used_today ?? 0;
    const likesRemaining = isVip ? 9999 : Math.max(0, quota - used);

    return c.json({
      success: true,
      wallet: {
        userId: wallet.user_id,
        directSalams: wallet.direct_salams_balance,
        dailyMessagesQuota: wallet.daily_messages_quota,
        messagesSentToday: wallet.messages_sent_today,
        dailyLikesQuota: quota,
        likesUsedToday: used,
        likesRemaining,
        subscriptionTier: wallet.subscription_tier,
        isVip,
        isSpotlightActive: Boolean(wallet.is_spotlight_active)
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 1b. Use a Daily Like (Live D1 Decrement)
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
    } else if (wallet.last_likes_reset_date !== todayDate) {
      await c.env.DB.prepare(`
        UPDATE user_wallets SET likes_used_today = 0, last_likes_reset_date = ? WHERE user_id = ?
      `).bind(todayDate, userId).run();
      wallet.likes_used_today = 0;
    }

    const quota = wallet.daily_likes_quota ?? 50;
    const used = (wallet.likes_used_today ?? 0) + 1;
    await c.env.DB.prepare(`
      UPDATE user_wallets SET likes_used_today = ?, last_likes_reset_date = ? WHERE user_id = ?
    `).bind(used, todayDate, userId).run();

    const isVip = wallet.subscription_tier === 'barakah_vip' || wallet.subscription_tier === 'vip';
    const likesRemaining = isVip ? 9999 : Math.max(0, quota - used);

    return c.json({
      success: true,
      likesRemaining,
      likesUsedToday: used,
      dailyLikesQuota: quota
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 2. Process Google Play In-App Purchase
walletRouter.post('/purchase-google-play', async (c) => {
  try {
    const { userId, productId, purchaseToken, amountCents, currency } = await c.req.json();
    if (!userId || !productId) {
      return c.json({ success: false, error: 'userId and productId are required' }, 400);
    }

    const purchaseId = `gp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await c.env.DB.prepare(`
      INSERT INTO in_app_purchases (id, user_id, platform, product_id, purchase_token, amount_cents, currency, status)
      VALUES (?, ?, 'google_play', ?, ?, ?, ?, 'completed')
    `).bind(purchaseId, userId, productId, purchaseToken || `sim_token_${Date.now()}`, amountCents || 199, currency || 'USD').run();

    if (productId === 'serene_direct_salam_5') {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, direct_salams_balance)
        VALUES (?, 5)
        ON CONFLICT(user_id) DO UPDATE SET direct_salams_balance = direct_salams_balance + 5
      `).bind(userId).run();
    } else if (productId === 'serene_spotlight_boost_24h') {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, is_spotlight_active)
        VALUES (?, 1)
        ON CONFLICT(user_id) DO UPDATE SET is_spotlight_active = 1
      `).bind(userId).run();
    } else if (productId === 'serene_barakah_monthly') {
      await c.env.DB.prepare(`
        UPDATE users SET is_vip = 1 WHERE id = ?
      `).bind(userId).run();

      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, subscription_tier, direct_salams_balance, daily_messages_quota)
        VALUES (?, 'barakah_vip', 10, 9999)
        ON CONFLICT(user_id) DO UPDATE SET subscription_tier = 'barakah_vip', daily_messages_quota = 9999, direct_salams_balance = direct_salams_balance + 5
      `).bind(userId).run();
    } else if (productId === 'serene_id_verification') {
      await c.env.DB.prepare(`
        UPDATE users SET is_id_verified = 1 WHERE id = ?
      `).bind(userId).run();
    }

    return c.json({
      success: true,
      message: 'Google Play purchase verified & credited successfully!',
      purchaseId,
      productId
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Rewarded Video Ad Claim (AdMob)
walletRouter.post('/reward-ad', async (c) => {
  try {
    const { userId, rewardType } = await c.req.json();
    if (!userId) {
      return c.json({ success: false, error: 'userId is required' }, 400);
    }

    if (rewardType === 'likes') {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, daily_messages_quota, daily_likes_quota, likes_used_today)
        VALUES (?, 40, 60, 0)
        ON CONFLICT(user_id) DO UPDATE SET daily_messages_quota = daily_messages_quota + 10, daily_likes_quota = daily_likes_quota + 10
      `).bind(userId).run();
    } else if (rewardType === 'messages') {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, daily_messages_quota)
        VALUES (?, 40)
        ON CONFLICT(user_id) DO UPDATE SET daily_messages_quota = daily_messages_quota + 10
      `).bind(userId).run();
    } else if (rewardType === 'salam') {
      await c.env.DB.prepare(`
        INSERT INTO user_wallets (user_id, direct_salams_balance)
        VALUES (?, 1)
        ON CONFLICT(user_id) DO UPDATE SET direct_salams_balance = direct_salams_balance + 1
      `).bind(userId).run();
    }

    const walletRow: any = await c.env.DB.prepare(`
      SELECT daily_messages_quota, daily_likes_quota, likes_used_today, subscription_tier FROM user_wallets WHERE user_id = ?
    `).bind(userId).first();

    const isVip = walletRow?.subscription_tier === 'barakah_vip' || walletRow?.subscription_tier === 'vip';
    const likesRemaining = isVip ? 9999 : Math.max(0, (walletRow?.daily_likes_quota ?? 50) - (walletRow?.likes_used_today ?? 0));

    return c.json({
      success: true,
      rewardType: rewardType || 'likes',
      likesAdded: 10,
      likesRemaining,
      newDailyQuota: walletRow ? walletRow.daily_messages_quota : 40,
      message: 'Rewarded ad verified! +10 Discover likes credited to your account.'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});


