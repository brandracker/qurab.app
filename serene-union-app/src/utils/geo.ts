const EARTH_RADIUS_KM = 6371;

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;
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
  return distance >= 10 ? Math.round(distance) : Math.round(distance * 10) / 10;
}

export const PAKISTAN_CITY_CENTROIDS: Record<string, { lat: number; lon: number; name: string }> = {
  karachi: { lat: 24.8607, lon: 67.0011, name: 'Karachi' },
  lahore: { lat: 31.5204, lon: 74.3587, name: 'Lahore' },
  islamabad: { lat: 33.6844, lon: 73.0479, name: 'Islamabad' },
  rawalpindi: { lat: 33.5651, lon: 73.0169, name: 'Rawalpindi' },
  faisalabad: { lat: 31.4504, lon: 73.1350, name: 'Faisalabad' },
  multan: { lat: 30.1575, lon: 71.5249, name: 'Multan' },
  peshawar: { lat: 34.0151, lon: 71.5249, name: 'Peshawar' },
  quetta: { lat: 30.1798, lon: 66.9750, name: 'Quetta' },
  sialkot: { lat: 32.4945, lon: 74.5229, name: 'Sialkot' },
  gujranwala: { lat: 32.1877, lon: 74.1945, name: 'Gujranwala' },
  hyderabad: { lat: 25.3960, lon: 68.3578, name: 'Hyderabad' },
  bahawalpur: { lat: 29.3544, lon: 71.6911, name: 'Bahawalpur' },
  sargodha: { lat: 32.0836, lon: 72.6711, name: 'Sargodha' },
  abbottabad: { lat: 34.1688, lon: 73.2215, name: 'Abbottabad' },
  sukkur: { lat: 27.7052, lon: 68.8574, name: 'Sukkur' },
  mardan: { lat: 34.1989, lon: 72.0450, name: 'Mardan' },
  gujrat: { lat: 32.5742, lon: 74.0754, name: 'Gujrat' },
  sheikhupura: { lat: 31.7131, lon: 73.9783, name: 'Sheikhupura' },
  jhelum: { lat: 32.9425, lon: 73.7257, name: 'Jhelum' },
  sahiwal: { lat: 30.6682, lon: 73.1114, name: 'Sahiwal' },
  okara: { lat: 30.8138, lon: 73.4534, name: 'Okara' },
  rahim_yar_khan: { lat: 28.4212, lon: 70.2989, name: 'Rahim Yar Khan' }
};

export function getNearestPakistaniCity(lat: number, lon: number): { city: string; distanceKm: number } {
  let minDistance = Infinity;
  let nearestCity = 'Lahore';

  for (const data of Object.values(PAKISTAN_CITY_CENTROIDS)) {
    const dist = calculateDistanceKm(lat, lon, data.lat, data.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = data.name;
    }
  }

  return { city: nearestCity, distanceKm: minDistance };
}

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
