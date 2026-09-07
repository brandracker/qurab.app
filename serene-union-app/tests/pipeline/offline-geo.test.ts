import { describe, it, expect } from 'vitest';
import { reverseGeocodeOffline } from '../../src/utils/offlineGeo';

describe('Offline Device Math: Reverse Geocoding Engine (Zero Network / Zero External API)', () => {
  it('1. Accurately resolves London coordinates to United Kingdom and London', () => {
    const result = reverseGeocodeOffline(51.5074, -0.1278);
    expect(result.countryCode).toBe('GB');
    expect(result.countryName).toBe('United Kingdom');
    expect(result.cityName).toBe('London');
  });

  it('2. Accurately resolves Lahore coordinates to Pakistan, Punjab, and Lahore', () => {
    const result = reverseGeocodeOffline(31.5204, 74.3587);
    expect(result.countryCode).toBe('PK');
    expect(result.countryName).toBe('Pakistan');
    expect(result.cityName).toBe('Lahore');
  });

  it('3. Accurately resolves Dubai coordinates to UAE and Dubai', () => {
    const result = reverseGeocodeOffline(25.2048, 55.2708);
    expect(result.countryCode).toBe('AE');
    expect(result.countryName).toBe('United Arab Emirates');
    expect(result.cityName).toBe('Dubai');
  });

  it('4. Accurately resolves Dallas coordinates to United States and Dallas', () => {
    const result = reverseGeocodeOffline(32.7767, -96.7970);
    expect(result.countryCode).toBe('US');
    expect(result.countryName).toBe('United States');
    expect(result.cityName).toBe('Dallas');
  });

  it('5. Accurately resolves Toronto coordinates to Canada and Toronto', () => {
    const result = reverseGeocodeOffline(43.6532, -79.3832);
    expect(result.countryCode).toBe('CA');
    expect(result.countryName).toBe('Canada');
    expect(result.cityName).toBe('Toronto');
  });
});
