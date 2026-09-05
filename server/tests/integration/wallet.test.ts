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
    expect(getData.wallet.directSalams).toBe(7); // 2 default + 5 purchased
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
    const getRes = await app.request('/api/wallet/usr_test_wallet_2', { method: 'GET' }, env);
    const getData = await getRes.json();
    expect(getData.wallet.isSpotlightActive).toBe(true);
  });

  it('4. POST /api/wallet/purchase-google-play activates Barakah VIP Monthly tier', async () => {
    // Seed user
    await env.DB.prepare(`
      INSERT INTO users (id, phone, full_name, dob, gender, location)
      VALUES ('usr_vip_test', '+923001112233', 'VIP Seeker', '1995-01-01', 'male', 'Lahore')
    `).run();

    const payload = {
      userId: 'usr_vip_test',
      productId: 'serene_barakah_monthly'
    };

    const res = await app.request('/api/wallet/purchase-google-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const getRes = await app.request('/api/wallet/usr_vip_test', { method: 'GET' }, env);
    const getData = await getRes.json();
    expect(getData.wallet.subscriptionTier).toBe('barakah_vip');
    expect(getData.wallet.dailyMessagesQuota).toBe(9999);
  });

  it('5. POST /api/wallet/purchase-google-play rejects missing required fields', async () => {
    const res = await app.request('/api/wallet/purchase-google-play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_wallet_invalid' })
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('required');
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
    expect(data.newDailyQuota).toBeGreaterThanOrEqual(40);
  });

  it('7. POST /api/wallet/reward-ad credits direct salam pass reward', async () => {
    // Initialize wallet first
    await app.request('/api/wallet/usr_test_wallet_salam', { method: 'GET' }, env);

    const payload = {
      userId: 'usr_test_wallet_salam',
      rewardType: 'salam'
    };

    const res = await app.request('/api/wallet/reward-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);

    const getRes = await app.request('/api/wallet/usr_test_wallet_salam', { method: 'GET' }, env);
    const getData = await getRes.json();
    expect(getData.wallet.directSalams).toBe(3); // 2 default + 1 reward
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
});


