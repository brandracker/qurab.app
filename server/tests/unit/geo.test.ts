import { describe, it, expect } from 'vitest';
import { calculateDistanceKm, getBoundingBox } from '../../src/utils/geo';

describe('Geo Utilities', () => {
  it('calculates 0 km for identical coordinates', () => {
    expect(calculateDistanceKm(31.5204, 74.3587, 31.5204, 74.3587)).toBe(0);
  });

  it('calculates accurate distance between known cities', () => {
    // London (51.5074, -0.1278) to Manchester (53.4808, -2.2426) is ~262 km
    const distUK = calculateDistanceKm(51.5074, -0.1278, 53.4808, -2.2426);
    expect(distUK).toBeGreaterThan(250);
    expect(distUK).toBeLessThan(275);

    // Lahore (31.5204, 74.3587) to Islamabad (33.6844, 73.0479) is ~270 km
    const distPK = calculateDistanceKm(31.5204, 74.3587, 33.6844, 73.0479);
    expect(distPK).toBeGreaterThan(260);
    expect(distPK).toBeLessThan(285);

    // New York (40.7128, -74.0060) to Philadelphia (39.9526, -75.1652) is ~130 km
    const distUS = calculateDistanceKm(40.7128, -74.0060, 39.9526, -75.1652);
    expect(distUS).toBeGreaterThan(120);
    expect(distUS).toBeLessThan(145);
  });

  it('generates a valid bounding box around a location', () => {
    const lahoreLat = 31.5204;
    const lahoreLon = 74.3587;
    const radius = 50; // 50 km

    const box = getBoundingBox(lahoreLat, lahoreLon, radius);

    expect(box.minLat).toBeLessThan(lahoreLat);
    expect(box.maxLat).toBeGreaterThan(lahoreLat);
    expect(box.minLon).toBeLessThan(lahoreLon);
    expect(box.maxLon).toBeGreaterThan(lahoreLon);

    // Verify a point within 20km falls inside the box
    const nearbyLat = 31.6;
    const nearbyLon = 74.4;
    expect(nearbyLat).toBeGreaterThanOrEqual(box.minLat);
    expect(nearbyLat).toBeLessThanOrEqual(box.maxLat);
    expect(nearbyLon).toBeGreaterThanOrEqual(box.minLon);
    expect(nearbyLon).toBeLessThanOrEqual(box.maxLon);

    // Verify a far point (e.g. Karachi: lat 24.86, lon 67.00) falls outside the box
    expect(24.86).toBeLessThan(box.minLat);
  });
});
