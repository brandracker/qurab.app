import { describe, it, expect, beforeEach, vi } from 'vitest';
import { optimizeImage } from '../../src/utils/imageOptimizer';
import { dbService } from '../../src/services/dbService';

describe('Real-World Pipeline: Photo Optimization & Safari Quota Resilience', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. optimizeImage handles invalid / empty input gracefully without throwing', async () => {
    const emptyBlob = new Blob([], { type: 'image/jpeg' });
    const result = await optimizeImage(emptyBlob);
    expect(typeof result).toBe('string');
  });

  it('2. dbService.setCurrentUser survives QuotaExceededError without crashing the app', () => {
    const testUser: any = {
      id: 'usr_safari_test',
      fullName: 'Amina Test',
      gender: 'female',
      photos: [
        'data:image/jpeg;base64,largeMockString1',
        'data:image/jpeg;base64,largeMockString2',
        'data:image/jpeg;base64,largeMockString3'
      ]
    };

    // Simulate Safari QuotaExceededError on the first setItem attempt
    let firstCall = true;
    const originalSetItem = localStorage.setItem.bind(localStorage);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      if (firstCall) {
        firstCall = false;
        const err = new DOMException('The quota has been exceeded.', 'QuotaExceededError');
        throw err;
      }
      return originalSetItem(key, value);
    });

    // Should NOT throw an unhandled error!
    expect(() => {
      dbService.setCurrentUser(testUser);
    }).not.toThrow();

    // The current user ID should still be set
    expect(dbService.getCurrentUser().id).toBe('usr_safari_test');
  });

  it('3. dbService.setCurrentUser works seamlessly in standard conditions', () => {
    const normalUser: any = {
      id: 'usr_normal_test',
      fullName: 'Bilal Test',
      gender: 'male',
      photos: ['https://example.com/p1.jpg']
    };

    dbService.setCurrentUser(normalUser);
    const retrieved = dbService.getCurrentUser();
    expect(retrieved.id).toBe('usr_normal_test');
    expect(retrieved.fullName).toBe('Bilal Test');
  });
});
