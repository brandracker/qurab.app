import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('TASK-H1: Strict Single Active Device Policy Integration Tests', () => {
  let env: any;

  beforeEach(() => {
    env = createTestEnv();
  });

  it('1. Logs in on Device A, then Device B kicks out Device A with 401 SESSION_TERMINATED_CONCURRENT_LOGIN', async () => {
    // 1. Create a user via signup
    const signupRes = await app.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'singledevice@example.com',
        password: 'Password123!',
        fullName: 'Zainab Ahmed',
        gender: 'female'
      })
    }, env);

    expect(signupRes.status).toBe(200);
    const signupData = await signupRes.json();
    const userId = signupData.user.id;
    const tokenDeviceA = signupData.token;
    expect(tokenDeviceA).toBeDefined();

    // 2. Device A validates session -> should be valid (200)
    const valResA = await app.request('/api/auth/validate-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token: tokenDeviceA })
    }, env);

    expect(valResA.status).toBe(200);
    const valDataA = await valResA.json();
    expect(valDataA.valid).toBe(true);

    // Device A heartbeat -> should succeed (200)
    const hbResA = await app.request('/api/users/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token: tokenDeviceA })
    }, env);
    expect(hbResA.status).toBe(200);

    // 3. User logs in from Device B
    const loginResB = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'singledevice@example.com',
        password: 'Password123!'
      })
    }, env);

    expect(loginResB.status).toBe(200);
    const loginDataB = await loginResB.json();
    const tokenDeviceB = loginDataB.token;
    expect(tokenDeviceB).toBeDefined();
    expect(tokenDeviceB).not.toBe(tokenDeviceA);

    // 4. Device B heartbeat -> should succeed (200)
    const hbResB = await app.request('/api/users/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token: tokenDeviceB })
    }, env);
    expect(hbResB.status).toBe(200);

    // 5. Device A (old device) sends heartbeat -> must be kicked out with 401 SESSION_TERMINATED_CONCURRENT_LOGIN
    const hbResOldA = await app.request('/api/users/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token: tokenDeviceA })
    }, env);

    expect(hbResOldA.status).toBe(401);
    const hbDataOldA = await hbResOldA.json();
    expect(hbDataOldA.code).toBe('SESSION_TERMINATED_CONCURRENT_LOGIN');
    expect(hbDataOldA.error).toContain('opened on another device');

    // 6. Device A (old device) validates session -> must return 401 SESSION_TERMINATED_CONCURRENT_LOGIN
    const valResOldA = await app.request('/api/auth/validate-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token: tokenDeviceA })
    }, env);

    expect(valResOldA.status).toBe(401);
    const valDataOldA = await valResOldA.json();
    expect(valDataOldA.code).toBe('SESSION_TERMINATED_CONCURRENT_LOGIN');
  });

  it('2. Rejects session validation if userId or token is missing', async () => {
    const res = await app.request('/api/auth/validate-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_xyz' })
    }, env);

    expect(res.status).toBe(400);
  });
});
