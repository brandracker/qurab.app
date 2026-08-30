import { describe, it, expect } from 'vitest';

async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isOtpExpired(expiresAtIso: string): boolean {
  return new Date() > new Date(expiresAtIso);
}

describe('Auth Unit Logic & Cryptography', () => {
  it('should hash passwords consistently with SHA-256', async () => {
    const pass = 'SalamSecure123!';
    const hash1 = await hashPassword(pass);
    const hash2 = await hashPassword(pass);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex is 64 characters
    expect(hash1).not.toBe(pass);
  });

  it('should generate a 6-digit numeric OTP code', () => {
    for (let i = 0; i < 20; i++) {
      const code = generateOtpCode();
      expect(code).toHaveLength(6);
      expect(Number(code)).toBeGreaterThanOrEqual(100000);
      expect(Number(code)).toBeLessThanOrEqual(999999);
    }
  });

  it('should correctly identify expired vs active OTP timestamps', () => {
    const pastDate = new Date(Date.now() - 60000).toISOString();
    const futureDate = new Date(Date.now() + 60000).toISOString();

    expect(isOtpExpired(pastDate)).toBe(true);
    expect(isOtpExpired(futureDate)).toBe(false);
  });
});
