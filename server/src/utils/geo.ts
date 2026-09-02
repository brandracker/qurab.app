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
