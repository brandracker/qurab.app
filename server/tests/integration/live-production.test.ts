import { describe, it, expect } from 'vitest';

describe('Live Cloudflare Production Worker API Health & Verification Tests', () => {
  const PROD_URL = 'https://serene-union-api.brandracker.workers.dev';

  it('1. Live Worker responds with 200 and valid JSON on health check', async () => {
    const startTime = Date.now();
    const res = await fetch(`${PROD_URL}/api/health`);
    const duration = Date.now() - startTime;

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.status).toBeDefined();
    expect(duration).toBeLessThan(3500); // Production latency within acceptable limits
  });

  it('2. Live Discover endpoint fetches real profiles from Cloudflare D1', async () => {
    const res = await fetch(`${PROD_URL}/api/profiles/discover?userId=usr_guest`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.profiles)).toBe(true);
    expect(data.profiles.length).toBeGreaterThan(0);

    // Verify critical profile properties exist on live items
    const firstProfile = data.profiles[0];
    expect(firstProfile.id).toBeDefined();
    expect(firstProfile.fullName).toBeDefined();
    expect(firstProfile.gender).toBeDefined();
  });

  it('3. Live Conversations endpoint returns 200 with active array', async () => {
    const res = await fetch(`${PROD_URL}/api/conversations?userId=usr_guest`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.conversations)).toBe(true);
  });

  it('4. Live Matches received & mutual endpoints respond without server 500 error', async () => {
    const resReceived = await fetch(`${PROD_URL}/api/matches/received?userId=usr_guest`);
    expect(resReceived.status).toBe(200);
    const dataReceived: any = await resReceived.json();
    expect(dataReceived.success).toBe(true);

    const resMutual = await fetch(`${PROD_URL}/api/matches/mutual?userId=usr_guest`);
    expect(resMutual.status).toBe(200);
    const dataMutual: any = await resMutual.json();
    expect(dataMutual.success).toBe(true);
  });
});
