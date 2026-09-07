import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { MockD1Database } from '../helpers/test-db';
import { profilesRouter } from '../../src/routes/users';
import type { AppContext } from '../../src/types';

describe('ISS-010: High Concurrency Profile Creation & Phone Collision Prevention', () => {
  let app: Hono<AppContext>;
  let mockDb: MockD1Database;

  beforeEach(() => {
    mockDb = new MockD1Database();
    app = new Hono<AppContext>();

    app.use('*', async (c, next) => {
      c.env = {
        DB: mockDb as any,
        MEDIA_BUCKET: {} as any,
        ENVIRONMENT: 'test'
      };
      await next();
    });

    app.route('/api/profiles', profilesRouter);
  });

  it('handles 20 simultaneous registrations without phone collision or 500 crashes', async () => {
    const candidatePromises = Array.from({ length: 20 }).map((_, idx) => {
      const candidatePayload = {
        id: `usr_concurrent_${idx}_${Date.now()}`,
        fullName: `Candidate ${idx}`,
        dob: '1996-05-15',
        gender: idx % 2 === 0 ? 'male' : 'female',
        location: 'London, UK',
        profession: 'Software Engineer',
        education: 'BSc',
        // Omitting phone to test automatic collision-free fallback generation
        practiceLevel: 'practicing',
        sect: 'Sunni',
        madhhab: 'Hanafi'
      };

      return app.request('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidatePayload)
      });
    });

    const responses = await Promise.all(candidatePromises);

    // Verify all 20 concurrent requests succeeded with 200 OK
    for (const res of responses) {
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    }

    // Verify all phone numbers in the database are unique
    const dbRaw = mockDb.getRawDb();
    const rows = dbRaw.prepare("SELECT phone FROM users WHERE id LIKE 'usr_concurrent_%'").all() as { phone: string }[];
    expect(rows.length).toBe(20);

    const phones = rows.map(r => r.phone);
    const uniquePhones = new Set(phones);
    expect(uniquePhones.size).toBe(20);
  });
});
