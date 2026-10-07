import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { reverseGeocodeOffline } from './offlineGeo';
import { dbService } from '../services/dbService';

export interface DetectedLocationResult {
  latitude: number;
  longitude: number;
  countryCode?: string;
  countryName?: string;
  stateCode?: string;
  stateName?: string;
  cityName?: string;
  formattedLocation?: string;
  source: 'gps' | 'ip';
}

/**
 * Universal High-Accuracy Location Detection
 * 1. Attempts Native Capacitor GPS (with runtime permission prompt on Android)
 * 2. Attempts Browser Geolocation (with high accuracy & timeout)
 * 3. Gracefully falls back to Cloudflare Edge IP Geolocation if GPS is denied or unavailable
 */
export async function detectDeviceLocation(): Promise<DetectedLocationResult> {
  const isNative = Capacitor.isNativePlatform();

  // --- Step 1: Native Capacitor / GPS Geolocation ---
  if (isNative) {
    try {
      let perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        perm = await Geolocation.requestPermissions();
      }

      if (perm.location === 'granted') {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });

        const lat = Math.round(position.coords.latitude * 10000) / 10000;
        const lon = Math.round(position.coords.longitude * 10000) / 10000;
        const geoResult = reverseGeocodeOffline(lat, lon);

        return {
          latitude: lat,
          longitude: lon,
          countryCode: geoResult.countryCode,
          countryName: geoResult.countryName,
          stateCode: geoResult.stateCode,
          stateName: geoResult.stateName,
          cityName: geoResult.cityName,
          formattedLocation: geoResult.formattedLocation,
          source: 'gps'
        };
      }
    } catch (nativeErr) {
      console.warn('Native GPS capture attempt notice, falling back to IP detection:', nativeErr);
    }
  }

  // --- Step 2: Web Browser Geolocation ---
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 8000,
          enableHighAccuracy: true
        });
      });

      const lat = Math.round(position.coords.latitude * 10000) / 10000;
      const lon = Math.round(position.coords.longitude * 10000) / 10000;
      const geoResult = reverseGeocodeOffline(lat, lon);

      return {
        latitude: lat,
        longitude: lon,
        countryCode: geoResult.countryCode,
        countryName: geoResult.countryName,
        stateCode: geoResult.stateCode,
        stateName: geoResult.stateName,
        cityName: geoResult.cityName,
        formattedLocation: geoResult.formattedLocation,
        source: 'gps'
      };
    } catch (browserErr) {
      console.warn('Browser GPS capture attempt notice, falling back to IP detection:', browserErr);
    }
  }

  // --- Step 3: Cloudflare Edge IP Geolocation Fallback ---
  const ipResult = await dbService.detectLocationByIP();
  if (ipResult) {
    const lat = Math.round(ipResult.latitude * 10000) / 10000;
    const lon = Math.round(ipResult.longitude * 10000) / 10000;
    const geoResult = reverseGeocodeOffline(lat, lon);

    return {
      latitude: lat,
      longitude: lon,
      countryCode: geoResult.countryCode || ipResult.country,
      countryName: geoResult.countryName || ipResult.country,
      stateCode: geoResult.stateCode,
      stateName: geoResult.stateName,
      cityName: geoResult.cityName !== 'Current Location' ? geoResult.cityName : (ipResult.city || 'Current City'),
      formattedLocation: geoResult.formattedLocation || `${ipResult.city}, ${ipResult.country}`,
      source: 'ip'
    };
  }

  throw new Error('Unable to determine location via GPS or network IP.');
}
