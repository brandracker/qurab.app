import { Geolocation } from '@capacitor/geolocation';
import { calculateDistanceKm, getCityCentroid, getNearestPakistaniCity } from './geo';
import { API_BASE } from '../services/dbService';

export interface TravelCheckResult {
  hasTraveled: boolean;
  detectedCity: string;
  previousCity: string;
  distanceKm: number;
}

const GEO_CHECK_KEY = 'qurb_last_geo_check';
const THROTTLE_HOURS = 24;

export async function checkUserTravel(currentCity: string, currentCountry = 'Pakistan'): Promise<TravelCheckResult | null> {
  try {
    // 1. Throttled Heartbeat: Check only once every 24 hours to save mobile battery
    const lastCheckStr = localStorage.getItem(GEO_CHECK_KEY);
    if (lastCheckStr) {
      const lastCheck = parseInt(lastCheckStr, 10);
      const hoursSince = (Date.now() - lastCheck) / (1000 * 60 * 60);
      if (hoursSince < THROTTLE_HOURS) {
        return null;
      }
    }

    let detectedCity: string | null = null;
    let detectedCountry: string = currentCountry;

    // 2. GPS Geolocation Primary (100% accurate, safe from ISP CGNAT)
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false, // Low power, fast cellular/Wi-Fi triangulation
        timeout: 4500,
        maximumAge: 3600000 // 1 hour cached OK
      });

      if (position?.coords) {
        const { latitude, longitude } = position.coords;
        const nearest = getNearestPakistaniCity(latitude, longitude);
        detectedCity = nearest.city;
      }
    } catch {
      // GPS permission denied or hardware unavailable -> fallback to edge IP
    }

    // 3. Cloudflare Edge IP Fallback (Only when GPS is unavailable)
    if (!detectedCity) {
      try {
        const res = await fetch(`${API_BASE}/users/detect-location`);
        const data = await res.json();
        if (data.success && data.city) {
          detectedCity = data.city;
          detectedCountry = data.country || 'PK';
        }
      } catch {}
    }

    // 4. VPN Shield & Anti-Foreign Jump Protection
    // If user's account is in Pakistan, and detected IP is foreign (e.g., DE, US, GB), do NOT override!
    if (detectedCountry && detectedCountry !== 'PK' && detectedCountry !== 'Pakistan') {
      console.info('VPN Shield: Detected foreign connection while account country is Pakistan. Blocking auto-override.');
      localStorage.setItem(GEO_CHECK_KEY, Date.now().toString());
      return null;
    }

    if (!detectedCity) {
      localStorage.setItem(GEO_CHECK_KEY, Date.now().toString());
      return null;
    }

    // 5. Compare with current registered city
    const cleanCurrent = currentCity.toLowerCase().trim();
    const cleanDetected = detectedCity.toLowerCase().trim();

    if (cleanCurrent === cleanDetected) {
      localStorage.setItem(GEO_CHECK_KEY, Date.now().toString());
      return null;
    }

    const currentCoords = getCityCentroid(currentCity);
    const detectedCoords = getCityCentroid(detectedCity);

    let distance = 0;
    if (currentCoords && detectedCoords) {
      distance = calculateDistanceKm(currentCoords.lat, currentCoords.lon, detectedCoords.lat, detectedCoords.lon);
    } else {
      distance = 50; // default if not in centroid list
    }

    // Only prompt travel banner if distance > 45 km (e.g., Gujranwala -> Lahore)
    if (distance > 45) {
      localStorage.setItem(GEO_CHECK_KEY, Date.now().toString());
      return {
        hasTraveled: true,
        detectedCity,
        previousCity: currentCity,
        distanceKm: distance
      };
    }

    localStorage.setItem(GEO_CHECK_KEY, Date.now().toString());
    return null;
  } catch {
    return null;
  }
}
