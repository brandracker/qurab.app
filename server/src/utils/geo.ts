/**
 * Geo-spatial distance and bounding box utilities for Serene Union
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates great-circle distance between two points using the Haversine formula
 * @param lat1 Latitude of point 1 in degrees
 * @param lon1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @returns Distance in kilometers (rounded to 1 decimal place, or nearest int if >= 10)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  const toRad = (degree: number) => (degree * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  // Round to nearest integer if >= 10km, else 1 decimal place
  return distance >= 10 ? Math.round(distance) : Math.round(distance * 10) / 10;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

/**
 * Calculates a bounding box (latitude/longitude boundaries) around a point for a given radius in km.
 * This is used for fast indexed B-Tree SQL filtering before calculating exact distances.
 * 1 degree latitude ~= 111 km
 * 1 degree longitude ~= 111 km * cos(latitude)
 */
export function getBoundingBox(
  lat: number,
  lon: number,
  radiusKm: number
): BoundingBox {
  const deltaLat = radiusKm / 111.0;
  
  // Guard against division by 0 near the poles
  const latRad = (lat * Math.PI) / 180;
  const cosLat = Math.max(Math.cos(latRad), 0.01);
  const deltaLon = radiusKm / (111.0 * cosLat);

  return {
    minLat: Math.max(-90, lat - deltaLat),
    maxLat: Math.min(90, lat + deltaLat),
    minLon: Math.max(-180, lon - deltaLon),
    maxLon: Math.min(180, lon + deltaLon),
  };
}

export const PAKISTAN_CITY_CENTROIDS: Record<string, { lat: number; lon: number }> = {
  karachi: { lat: 24.8607, lon: 67.0011 },
  lahore: { lat: 31.5204, lon: 74.3587 },
  islamabad: { lat: 33.6844, lon: 73.0479 },
  rawalpindi: { lat: 33.5651, lon: 73.0169 },
  faisalabad: { lat: 31.4504, lon: 73.1350 },
  multan: { lat: 30.1575, lon: 71.5249 },
  peshawar: { lat: 34.0151, lon: 71.5249 },
  quetta: { lat: 30.1798, lon: 66.9750 },
  sialkot: { lat: 32.4945, lon: 74.5229 },
  gujranwala: { lat: 32.1877, lon: 74.1945 },
  hyderabad: { lat: 25.3960, lon: 68.3578 },
  bahawalpur: { lat: 29.3544, lon: 71.6911 },
  sargodha: { lat: 32.0836, lon: 72.6711 },
  abbottabad: { lat: 34.1688, lon: 73.2215 },
  sukkur: { lat: 27.7052, lon: 68.8574 },
  mardan: { lat: 34.1989, lon: 72.0450 },
  gujrat: { lat: 32.5742, lon: 74.0754 },
  sheikhupura: { lat: 31.7131, lon: 73.9783 },
  jhelum: { lat: 32.9425, lon: 73.7257 },
  sahiwal: { lat: 30.6682, lon: 73.1114 },
  okara: { lat: 30.8138, lon: 73.4534 },
  rahim_yar_khan: { lat: 28.4212, lon: 70.2989 }
};

export function getCityCentroid(cityName?: string | null): { lat: number; lon: number } | null {
  if (!cityName || typeof cityName !== 'string') return null;
  const clean = cityName.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  for (const [key, coords] of Object.entries(PAKISTAN_CITY_CENTROIDS)) {
    const keyNorm = key.replace(/_/g, ' ');
    if (clean.includes(keyNorm) || clean.includes(key)) {
      return coords;
    }
  }
  return null;
}
