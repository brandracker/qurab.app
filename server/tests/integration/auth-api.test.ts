import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('Auth & Health API Integration Tests', () => {
  let env: any;

  beforeEach(() => {
    env = createTestEnv();
  });

  it('GET /api/health returns 200 and system status', async () => {
    const res = await app.request('/api/health', { method: 'GET' }, env);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.service).toContain('Serene Union');
  });

  it('POST /api/auth/signup creates a new user account', async () => {
    const payload = {
      email: 'test.user@sereneunion.com',
      password: 'StrongHalalPassword123!',
      fullName: 'Ahmed Faris'
    };

    const res = await app.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe(payload.email.toLowerCase());
    expect(data.user.fullName).toBe('Ahmed Faris');
    expect(data.user.isNewUser).toBe(true);
  });

  it('POST /api/auth/signup rejects duplicate email registration', async () => {
    const payload = {
      email: 'duplicate@sereneunion.com',
      password: 'Pass123!Password',
      fullName: 'Original User'
    };

    // First signup
    await app.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    // Duplicate signup attempt
    const res2 = await app.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res2.status).toBe(400);
    const data = await res2.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('already exists');
  });

  it('POST /api/auth/login succeeds with valid credentials', async () => {
    const email = 'login.test@sereneunion.com';
    const password = 'CorrectPassword123!';

    // Create user first
    await app.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName: 'Bilal Khan' })
    }, env);

    // Attempt login
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.fullName).toBe('Bilal Khan');
    expect(data.token).toBeDefined();
  });

  it('POST /api/auth/login fails with invalid password', async () => {
    const email = 'wrongpass@sereneunion.com';
    const password = 'RealPassword123!';

    await app.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName: 'Test' })
    }, env);

    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'WrongPassword999' })
    }, env);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid email or password');
  });

  it('Phone OTP dispatch and verification lifecycle', async () => {
    const phone = '+15550001122';

    // 1. Dispatch OTP
    const sendRes = await app.request('/api/auth/send-phone-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    }, env);

    expect(sendRes.status).toBe(200);
    const sendData = await sendRes.json();
    expect(sendData.success).toBe(true);
    const code = sendData.otpPreview;
    expect(code).toBeDefined();

    // 2. Verify with wrong code
    const wrongRes = await app.request('/api/auth/verify-phone-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otpCode: '000000' })
    }, env);
    expect(wrongRes.status).toBe(400);

    // 3. Verify with correct code
    const correctRes = await app.request('/api/auth/verify-phone-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otpCode: code, fullName: 'Phone User' })
    }, env);

    expect(correctRes.status).toBe(200);
    const verifyData = await correctRes.json();
    expect(verifyData.success).toBe(true);
    expect(verifyData.user.phone).toBe(phone);
    expect(verifyData.token).toBeDefined();
  });

  it('POST /api/auth/google-login creates a new user on first sign-in', async () => {
    const payload = {
      email: 'google.newseeker@gmail.com',
      fullName: 'Zayd Al-Ansari',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      googleUid: 'goog_123456789'
    };

    const res = await app.request('/api/auth/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe('google.newseeker@gmail.com');
    expect(data.user.fullName).toBe('Zayd Al-Ansari');
    expect(data.user.isNewUser).toBe(true);
    expect(data.user.photos).toContain(payload.photoUrl);
  });

  it('POST /api/auth/google-login logs in existing user seamlessly', async () => {
    // 1. Initial login (registers user)
    await app.request('/api/auth/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'returning.seeker@gmail.com',
        fullName: 'Amina Begum'
      })
    }, env);

    // 2. Second login
    const res = await app.request('/api/auth/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'returning.seeker@gmail.com',
        fullName: 'Amina Begum'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.isNewUser).toBe(false);
    expect(data.user.fullName).toBe('Amina Begum');
  });

  it('POST /api/auth/email-sync creates a new matrimony profile on initial registration', async () => {
    const payload = {
      email: 'khadija.seeker@sereneunion.com',
      fullName: 'Khadija Al-Zahra',
      gender: 'female',
      firebaseUid: 'fb_khadija_991'
    };

    const res = await app.request('/api/auth/email-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe('khadija.seeker@sereneunion.com');
    expect(data.user.fullName).toBe('Khadija Al-Zahra');
    expect(data.user.gender).toBe('female');
    expect(data.user.isNewUser).toBe(true);
  });

  it('POST /api/auth/email-sync returns full profile for returning user', async () => {
    // 1. Initial sync
    await app.request('/api/auth/email-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'returning.sister@sereneunion.com',
        fullName: 'Fatima Noor',
        gender: 'female'
      })
    }, env);

    // 2. Subsequent sync
    const res = await app.request('/api/auth/email-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'returning.sister@sereneunion.com'
      })
    }, env);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.isNewUser).toBe(false);
    expect(data.user.fullName).toBe('Fatima Noor');
  });
});


