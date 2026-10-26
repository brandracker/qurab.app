import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('Wallet, In-App Purchases & Rewarded Ads API Integration Tests', () => {
  let env: any;

  beforeEach(async () => {
    env = createTestEnv();
    await env.DB.prepare(`
      INSERT INTO users (id, phone, full_name, dob, gender, location)
      VALUES ('usr_test_wallet_1', '+923001112231', 'Test Wallet 1', '1995-01-01', 'male', 'Lahore'),
             ('usr_test_wallet_2', '+923001112232', 'Test Wallet 2', '1995-01-01', 'female', 'Karachi'),
             ('usr_test_wallet_3', '+923001112233', 'Test Wallet 3', '1995-01-01', 'male', 'Lahore'),
             ('usr_test_wallet_ad', '+923001112234', 'Ad Seeker', '1995-01-01', 'male', 'Islamabad'),
             ('usr_test_wallet_salam', '+923001112235', 'Salam Seeker', '1995-01-01', 'female', 'Lahore')
    `).run();
  });

  it('1. GET /api/wallet/:userId initializes user wallet with default free balance', async () => {
    const res = await app.request('/api/wallet/usr_test_wallet_1', { method: 'GET' }, env);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.wallet.directSalams).toBe(2);
    expect(data.wallet.dailyMessagesQuota).toBe(15);
    expect(data.wallet.subscriptionTier).toBe('free');
    expect(data.wallet.isSpotlightActive).toBe(false);
  });

  it('2. POST /api/wallet/purchase-google-play credits Direct Salams on valid purchase', async () => {
    // 1. Initialize wallet
    await app.request('/api/wallet/usr_test_wallet_1', { method: 'GET' }, env);

    const payload = {
      userId: 'usr_test_wallet_1',
      productId: 'serene_direct_salam_5',
      purchaseToken: 'gp_token_mock_123',
      amountCents: 499,
      currency: 'USD'
    };

    const res = await app.request('/api/wallet/purchase-google-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify wallet updated
    const getRes = await app.request('/api/wallet/usr_test_wallet_1', { method: 'GET' }, env);
    const getData = await getRes.json();
    expect(getData.wallet.directSalams).toBe(22); // 2 default + 20 purchased
  });

  it('3. POST /api/wallet/purchase-google-play activates 24h Spotlight Boost', async () => {
    const payload = {
      userId: 'usr_test_wallet_2',
      productId: 'serene_spotlight_boost_24h'
    };

    const res = await app.request('/api/wallet/purchase-google-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    const getRes = await app.request('/api/wallet/usr_test_wallet_2', { method: 'GET' }, env);
    const getData = await getRes.json();
    expect(getData.wallet.isSpotlightActive).toBe(true);
  });

  it('4. POST /api/wallet/purchase-google-play activates Barakah VIP Monthly tier', async () => {
    const payload = {
      userId: 'usr_test_wallet_3',
      productId: 'serene_barakah_monthly'
    };

    const res = await app.request('/api/wallet/purchase-google-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    const getRes = await app.request('/api/wallet/usr_test_wallet_3', { method: 'GET' }, env);
    const getData = await getRes.json();
    expect(getData.wallet.subscriptionTier).toBe('barakah_vip');
    expect(getData.wallet.isVip).toBe(true);
  });

  it('5. POST /api/wallet/purchase-google-play rejects missing required fields', async () => {
    const res = await app.request('/api/wallet/purchase-google-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_test' })
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it('6. POST /api/wallet/reward-ad credits +10 likes quota upon video ad completion', async () => {
    const payload = {
      userId: 'usr_test_wallet_ad',
      rewardType: 'likes'
    };

    const res = await app.request('/api/wallet/reward-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.likesAdded).toBe(10);
  });

  it('7. POST /api/wallet/reward-ad credits direct salam pass reward after 3 ads', async () => {
    // Initialize wallet first
    await app.request('/api/wallet/usr_test_wallet_salam', { method: 'GET' }, env);

    const payload = {
      userId: 'usr_test_wallet_salam',
      rewardType: 'salam'
    };

    // Ad 1 of 3
    const res1 = await app.request('/api/wallet/reward-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);
    expect(res1.status).toBe(200);
    const data1 = await res1.json();
    expect(data1.passEarned).toBe(false);
    expect(data1.adsWatchedForSalam).toBe(1);
    expect(data1.directSalams).toBe(2);

    // Ad 2 of 3
    const res2 = await app.request('/api/wallet/reward-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);
    const data2 = await res2.json();
    expect(data2.passEarned).toBe(false);
    expect(data2.adsWatchedForSalam).toBe(2);

    // Ad 3 of 3 (unlocks +1 pass)
    const res3 = await app.request('/api/wallet/reward-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);
    const data3 = await res3.json();
    expect(data3.passEarned).toBe(true);
    expect(data3.adsWatchedForSalam).toBe(0);
    expect(data3.directSalams).toBe(3);

    const getRes = await app.request('/api/wallet/usr_test_wallet_salam', { method: 'GET' }, env);
    const getData = await getRes.json();
    expect(getData.wallet.directSalams).toBe(3); // 2 default + 1 reward
  });

  it('7b. POST /api/wallet/use-direct-salam consumes a pass', async () => {
    const res = await app.request('/api/wallet/use-direct-salam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_test_wallet_salam' })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.directSalams).toBe(1); // 2 default - 1 consumed = 1
  });

  it('8. POST /api/wallet/reward-ad rejects request missing userId', async () => {
    const res = await app.request('/api/wallet/reward-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardType: 'likes' })
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it('9. POST /api/wallet/use-like decrements daily likes in D1', async () => {
    const res = await app.request('/api/wallet/use-like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_test_like_dec' })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.likesRemaining).toBe(49);
    expect(data.likesUsedToday).toBe(1);
  });

  it('10. Centralized Notifications: GET & POST /api/notifications in D1', async () => {
    const createRes = await app.request('/api/notifications/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_test_notif_sync',
        type: 'match',
        title: 'Mutual Match',
        message: 'You have a mutual connection!'
      })
    }, env);

    expect(createRes.status).toBe(200);
    const createData = await createRes.json();
    expect(createData.success).toBe(true);

    const getRes = await app.request('/api/notifications?userId=usr_test_notif_sync', { method: 'GET' }, env);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(getData.notifications.length).toBe(1);
    expect(getData.notifications[0].title).toBe('Mutual Match');
  });

  it('11. GET /api/wallet/unity-s2s-callback credits reward via Unity Ads S2S webhook', async () => {
    // Initialize wallet
    await app.request('/api/wallet/usr_test_unity_s2s', { method: 'GET' }, env);

    const res = await app.request('/api/wallet/unity-s2s-callback?sid=usr_test_unity_s2s&rewardType=likes&oid=unity_order_123', {
      method: 'GET'
    }, env);

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('OK');

    const walletRes = await app.request('/api/wallet/usr_test_unity_s2s', { method: 'GET' }, env);
    const walletData = await walletRes.json();
    expect(walletData.wallet.dailyLikesQuota).toBe(60); // 50 default + 10 reward
  });

  it('12. GET /api/wallet/unity-s2s-callback rejects request when sid or userId is missing', async () => {
    const res = await app.request('/api/wallet/unity-s2s-callback?rewardType=likes', {
      method: 'GET'
    }, env);

    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toContain('Missing');
  });

  it('13. POST /api/wallet/stripe/create-checkout-session validates required params', async () => {
    const res = await app.request('/api/wallet/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_test_stripe' })
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('required');
  });

  it('14. POST /api/wallet/stripe/verify-session validates required sessionId', async () => {
    const res = await app.request('/api/wallet/stripe/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('sessionId is required');
  });

  it('15. Likes quota is persistent and does NOT reset across date changes (monetization architecture)', async () => {
    await app.request('/api/wallet/usr_test_onetime', { method: 'GET' }, env);
    for (let i = 0; i < 5; i++) {
      await app.request('/api/wallet/use-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'usr_test_onetime' })
      }, env);
    }

    let walletRes = await app.request('/api/wallet/usr_test_onetime', { method: 'GET' }, env);
    let walletData = await walletRes.json();
    expect(walletData.wallet.likesRemaining).toBe(45);
    expect(walletData.wallet.likesUsedToday).toBe(5);

    // Simulate older date in database
    await env.DB.prepare(`
      UPDATE user_wallets SET last_likes_reset_date = '2025-01-01' WHERE user_id = 'usr_test_onetime'
    `).run();

    // Query wallet on new date - must REMAIN persistent at 45 likes (NO free midnight refill!)
    walletRes = await app.request('/api/wallet/usr_test_onetime', { method: 'GET' }, env);
    walletData = await walletRes.json();
    expect(walletData.wallet.likesRemaining).toBe(45);
    expect(walletData.wallet.likesUsedToday).toBe(5);

    // Consume remaining 45 likes
    await env.DB.prepare(`
      UPDATE user_wallets SET likes_used_today = 50 WHERE user_id = 'usr_test_onetime'
    `).run();

    // Swiping when quota exhausted returns 403 error
    const exhaustRes = await app.request('/api/wallet/use-like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_test_onetime' })
    }, env);
    expect(exhaustRes.status).toBe(403);
    const exhaustData = await exhaustRes.json();
    expect(exhaustData.error).toContain('Likes quota exhausted');

    // Watching rewarded ad restores +10 likes
    const adRes = await app.request('/api/wallet/reward-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_test_onetime', rewardType: 'likes' })
    }, env);
    expect(adRes.status).toBe(200);
    const adData = await adRes.json();
    expect(adData.likesRemaining).toBe(10);
  });

  it('17. Google Play purchase with 7-day trial sets 7-day expiry and credits Barakah VIP', async () => {
    const payload = {
      userId: 'usr_test_wallet_2',
      productId: 'qurb_barakah_monthly',
      purchaseToken: 'gp_token_trial_7d',
      amountCents: 0,
      currency: 'USD',
      isTrial: true,
      durationDays: 7
    };

    const res = await app.request('/api/wallet/purchase-google-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.subscriptionExpiry).toBeDefined();

    // Verify wallet reflects 7 days remaining
    const getRes = await app.request('/api/wallet/usr_test_wallet_2', { method: 'GET' }, env);
    const getData = await getRes.json();
    expect(getData.wallet.isVip).toBe(true);
    expect(getData.wallet.subscriptionTier).toBe('barakah_vip');
    expect(getData.wallet.daysRemaining).toBeLessThanOrEqual(7);
    expect(getData.wallet.daysRemaining).toBeGreaterThanOrEqual(6);
  });

  it('18. Expired subscription automatically downgrades user to free tier upon GET /api/wallet/:userId', async () => {
    // Manually set an expired subscription in database (expired yesterday)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare(`
      INSERT INTO user_wallets (user_id, subscription_tier, subscription_expiry, daily_messages_quota)
      VALUES ('usr_test_wallet_3', 'barakah_vip', ?, 9999)
      ON CONFLICT(user_id) DO UPDATE SET 
        subscription_tier = 'barakah_vip', 
        subscription_expiry = excluded.subscription_expiry,
        daily_messages_quota = 9999
    `).bind(yesterday).run();

    await env.DB.prepare("UPDATE users SET is_vip = 1 WHERE id = 'usr_test_wallet_3'").run();

    // Query wallet: auto-expiration should downgrade immediately
    const res = await app.request('/api/wallet/usr_test_wallet_3', { method: 'GET' }, env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.wallet.isVip).toBe(false);
    expect(data.wallet.subscriptionTier).toBe('free');
    expect(data.wallet.dailyMessagesQuota).toBe(15);

    // Verify users table is also updated
    const userRow = await env.DB.prepare("SELECT is_vip FROM users WHERE id = 'usr_test_wallet_3'").first();
    expect(userRow.is_vip).toBe(0);
  });

  it('19. Google Play RTDN Webhook revokes VIP on SUBSCRIPTION_EXPIRED (type 13)', async () => {
    // 1. Give active VIP
    await app.request('/api/wallet/purchase-google-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_test_wallet_1',
        productId: 'qurb_barakah_monthly',
        purchaseToken: 'gp_token_rtdn_test',
        amountCents: 299,
        currency: 'USD'
      })
    }, env);

    // Verify VIP active
    let check = await app.request('/api/wallet/usr_test_wallet_1', { method: 'GET' }, env);
    let checkData = await check.json();
    expect(checkData.wallet.isVip).toBe(true);

    // 2. Google Cloud Pub/Sub sends notificationType 13 (EXPIRED)
    const pubsubPayload = {
      message: {
        data: Buffer.from(JSON.stringify({
          version: '1.0',
          packageName: 'app.qurb.serene',
          subscriptionNotification: {
            notificationType: 13,
            purchaseToken: 'gp_token_rtdn_test',
            subscriptionId: 'qurb_barakah_monthly'
          }
        })).toString('base64')
      }
    };

    const webhookRes = await app.request('/api/wallet/google-play/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pubsubPayload)
    }, env);

    expect(webhookRes.status).toBe(200);
    const webhookData = await webhookRes.json();
    expect(webhookData.success).toBe(true);

    // 3. User should now be revoked to free tier
    check = await app.request('/api/wallet/usr_test_wallet_1', { method: 'GET' }, env);
    checkData = await check.json();
    expect(checkData.wallet.isVip).toBe(false);
    expect(checkData.wallet.subscriptionTier).toBe('free');
  });
});


