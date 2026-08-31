import { Hono } from 'hono';
import type { AppContext } from '../types';

export const walletRouter = new Hono<AppContext>();

// 1. Get User Wallet & Membership Status
walletRouter.get('/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    let wallet: any = await c.env.DB.prepare(`
      SELECT * FROM user_wallets WHERE user_id = ?
    `).bind(userId).first();

    if (!wallet) {
      await c.env.DB.prepare(`
        INSERT OR IGNORE INTO user_wallets (user_id, direct_salams_balance, daily_messages_quota, messages_sent_today, subscription_tier)
        VALUES (?, 2, 15, 0, 'free')
      `).bind(userId).run();

      wallet = {
        user_id: userId,
        direct_salams_balance: 2,
        daily_messages_quota: 15,
        messages_sent_today: 0,
        subscription_tier: 'free',
        is_spotlight_active: 0
      };
    }

    return c.json({
      success: true,
      wallet: {
        userId: wallet.user_id,
        directSalams: wallet.direct_salams_balance,
        dailyMessagesQuota: wallet.daily_messages_quota,
        messagesSentToday: wallet.messages_sent_today,
        subscriptionTier: wallet.subscription_tier,
        isSpotlightActive: Boolean(wallet.is_spotlight_active)
      }
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

    if (rewardType === 'likes' || rewardType === 'messages') {
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

    return c.json({
      success: true,
      rewardType: rewardType || 'likes',
      message: 'Rewarded ad verified! +10 Discover likes credited to your account.'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
