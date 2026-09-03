import { describe, it, expect } from 'vitest';

describe('Real-World Production Pipeline: Discover & Candidate Gender Verification', () => {
  const PROD_URL = 'https://serene-union-api.brandracker.workers.dev';

  it('1. Live Production Health Check', async () => {
    const res = await fetch(`${PROD_URL}/api/health`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.status).toBeDefined();
  });

  it('2. Live Discover returns only Female candidates when requested by a Brother (Male user)', async () => {
    // usr_1788452702123 is Imran (male in D1)
    const res = await fetch(`${PROD_URL}/api/profiles/discover?userId=usr_1788452702123`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.profiles)).toBe(true);
    expect(data.profiles.length).toBeGreaterThan(0);

    // Every candidate returned MUST be female!
    const nonFemale = data.profiles.filter((p: any) => p.gender && p.gender.toLowerCase() !== 'female');
    expect(nonFemale.length).toBe(0);
  });

  it('3. Live Discover returns only Male candidates when requested by a Sister (Female user)', async () => {
    // usr_1788059093932 is Sarah (female in D1)
    const res = await fetch(`${PROD_URL}/api/profiles/discover?userId=usr_1788059093932`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.profiles)).toBe(true);
    expect(data.profiles.length).toBeGreaterThan(0);

    // Every candidate returned MUST be male!
    const nonMale = data.profiles.filter((p: any) => p.gender && p.gender.toLowerCase() !== 'male');
    expect(nonMale.length).toBe(0);
  });

  it('4. [FLAW DETECTION TEST] Discovers 0 profiles when an affected account (Ahmad) queries Discover', async () => {
    // Ahmad (usr_1788377169482) is male on frontend but was saved with female gender in D1
    const res = await fetch(`${PROD_URL}/api/profiles/discover?userId=usr_1788377169482`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);

    // Backend returned profiles:
    const backendProfiles = data.profiles || [];
    
    // Simulate frontend filtering: Ahmad is Male, so he wants Female candidates
    const frontendTargetGender = 'female';
    const frontendRemaining = backendProfiles.filter((p: any) => p.gender?.toLowerCase() === frontendTargetGender);

    // This assertion checks if Ahmad gets candidates. In the current BUGGY code,
    // frontendRemaining is 0! This test documents the exact live flaw.
    expect(frontendRemaining.length).toBeGreaterThan(0);
  });

  it('5. Live Matches Received API returns 200 without server crash', async () => {
    const res = await fetch(`${PROD_URL}/api/matches/received?userId=usr_test_verification`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
  });

  it('6. Live Matches Mutual API returns 200 without server crash', async () => {
    const res = await fetch(`${PROD_URL}/api/matches/mutual?userId=usr_test_verification`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
  });
});
