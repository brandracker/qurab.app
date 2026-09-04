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
});
