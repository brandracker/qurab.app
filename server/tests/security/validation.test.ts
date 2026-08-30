import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../helpers/test-db';

describe('Security & Input Validation Tests', () => {
  let env: any;

  beforeEach(() => {
    env = createTestEnv();
  });

  it('rejects signup with missing password or missing email with 400', async () => {
    const resNoPass = await app.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nopass@example.com' })
    }, env);
    expect(resNoPass.status).toBe(400);

    const resNoEmail = await app.request('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'Password123!' })
    }, env);
    expect(resNoEmail.status).toBe(400);
  });

  it('rejects empty message dispatch with 400', async () => {
    const res = await app.request('/api/conversations/conv_123/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'usr_1',
        senderName: 'Test',
        text: '   '
      })
    }, env);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Message text is required');
  });

  it('returns 404 when querying a non-existent user profile', async () => {
    const res = await app.request('/api/users/non_existent_usr_99999', { method: 'GET' }, env);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('not found');
  });

  it('handles special characters and SQL injection attempts gracefully in search and auth', async () => {
    const maliciousEmail = "' OR '1'='1' -- ";
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: maliciousEmail,
        password: 'any_password'
      })
    }, env);

    // Must return 401 unauthorized, NOT dump internal DB errors or grant bypass
    expect(res.status).toBe(401);
  });
});
