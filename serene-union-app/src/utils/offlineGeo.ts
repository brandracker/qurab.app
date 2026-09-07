import { City, Country, State } from 'country-state-city';

export interface OfflineLocationResult {
  countryCode: string;
  countryName: string;
  stateCode?: string;
  stateName?: string;
  cityName: string;
  latitude: number;
  longitude: number;
  formattedLocation: string;
}

// Canonical metropolitan centroids for common regions (within ~25km radius)
export const METRO_CITY_COORDINATES: Record<string, { lat: number; lon: number; countryCode: string; stateCode: string }> = {
  // UK
  'London': { lat: 51.5074, lon: -0.1278, countryCode: 'GB', stateCode: 'ENG' },
  'Manchester': { lat: 53.4808, lon: -2.2426, countryCode: 'GB', stateCode: 'ENG' },
  'Birmingham': { lat: 52.4862, lon: -1.8904, countryCode: 'GB', stateCode: 'ENG' },
  'Leeds': { lat: 53.8008, lon: -1.5491, countryCode: 'GB', stateCode: 'ENG' },
  'Bradford': { lat: 53.7960, lon: -1.7594, countryCode: 'GB', stateCode: 'ENG' },
  'Luton': { lat: 51.8787, lon: -0.4200, countryCode: 'GB', stateCode: 'ENG' },
  'Leicester': { lat: 52.6369, lon: -1.1398, countryCode: 'GB', stateCode: 'ENG' },
  'Sheffield': { lat: 53.3811, lon: -1.4701, countryCode: 'GB', stateCode: 'ENG' },
  'Glasgow': { lat: 55.8642, lon: -4.2518, countryCode: 'GB', stateCode: 'SCT' },
  'Edinburgh': { lat: 55.9533, lon: -3.1883, countryCode: 'GB', stateCode: 'SCT' },
  // Pakistan
  'Lahore': { lat: 31.5204, lon: 74.3587, countryCode: 'PK', stateCode: 'PB' },
  'Karachi': { lat: 24.8607, lon: 67.0011, countryCode: 'PK', stateCode: 'SD' },
  'Islamabad': { lat: 33.6844, lon: 73.0479, countryCode: 'PK', stateCode: 'IS' },
  'Rawalpindi': { lat: 33.5651, lon: 73.0169, countryCode: 'PK', stateCode: 'PB' },
  'Faisalabad': { lat: 31.4504, lon: 73.1350, countryCode: 'PK', stateCode: 'PB' },
  'Multan': { lat: 30.1575, lon: 71.5249, countryCode: 'PK', stateCode: 'PB' },
  'Peshawar': { lat: 34.0151, lon: 71.5249, countryCode: 'PK', stateCode: 'KP' },
  'Quetta': { lat: 30.1798, lon: 66.9750, countryCode: 'PK', stateCode: 'BA' },
  'Sialkot': { lat: 32.4945, lon: 74.5229, countryCode: 'PK', stateCode: 'PB' },
  'Gujranwala': { lat: 32.1877, lon: 74.1945, countryCode: 'PK', stateCode: 'PB' },
  // UAE & Gulf
  'Dubai': { lat: 25.2048, lon: 55.2708, countryCode: 'AE', stateCode: 'DU' },
  'Abu Dhabi': { lat: 24.4539, lon: 54.3773, countryCode: 'AE', stateCode: 'AZ' },
  'Sharjah': { lat: 25.3463, lon: 55.4209, countryCode: 'AE', stateCode: 'SH' },
  'Riyadh': { lat: 24.7136, lon: 46.6753, countryCode: 'SA', stateCode: '01' },
  'Jeddah': { lat: 21.4858, lon: 39.1925, countryCode: 'SA', stateCode: '02' },
  'Makkah': { lat: 21.3891, lon: 39.8579, countryCode: 'SA', stateCode: '02' },
  'Madinah': { lat: 24.5247, lon: 39.5692, countryCode: 'SA', stateCode: '03' },
  'Doha': { lat: 25.2854, lon: 51.5310, countryCode: 'QA', stateCode: 'DA' },
  // USA & Canada
  'New York': { lat: 40.7128, lon: -74.0060, countryCode: 'US', stateCode: 'NY' },
  'Chicago': { lat: 41.8781, lon: -87.6298, countryCode: 'US', stateCode: 'IL' },
  'Dallas': { lat: 32.7767, lon: -96.7970, countryCode: 'US', stateCode: 'TX' },
  'Houston': { lat: 29.7604, lon: -95.3698, countryCode: 'US', stateCode: 'TX' },
  'Los Angeles': { lat: 34.0522, lon: -118.2437, countryCode: 'US', stateCode: 'CA' },
  'San Francisco': { lat: 37.7749, lon: -122.4194, countryCode: 'US', stateCode: 'CA' },
  'Toronto': { lat: 43.6532, lon: -79.3832, countryCode: 'CA', stateCode: 'ON' },
  'Vancouver': { lat: 49.2827, lon: -123.1207, countryCode: 'CA', stateCode: 'BC' },
  'Calgary': { lat: 51.0447, lon: -114.0719, countryCode: 'CA', stateCode: 'AB' },
  // Australia
  'Sydney': { lat: -33.8688, lon: 151.2093, countryCode: 'AU', stateCode: 'NSW' },
  'Melbourne': { lat: -37.8136, lon: 144.9631, countryCode: 'AU', stateCode: 'VIC' }
};

/**
 * 100% Offline Mathematical Reverse Geocoder (Zero Network, Zero API Keys, Runs on Device)
 * Given coordinates (lat, lon), mathematically resolves:
 * Country Code, Country Name, State Code, City Name, and Formatted Location string.
 */
export function reverseGeocodeOffline(lat: number, lon: number): OfflineLocationResult {
  // Step 1: Check known major metropolitan centroids (within ~25km = 0.25 deg)
  for (const [cityName, meta] of Object.entries(METRO_CITY_COORDINATES)) {
    const dist = Math.hypot(lat - meta.lat, lon - meta.lon);
    if (dist <= 0.25) {
      const country = Country.getCountryByCode(meta.countryCode);
      const countryName = country ? country.name : meta.countryCode;
      const state = State.getStateByCodeAndCountry(meta.stateCode, meta.countryCode);
      const stateName = state ? state.name : '';
      return {
        countryCode: meta.countryCode,
        countryName,
        stateCode: meta.stateCode,
        stateName,
        cityName,
        latitude: lat,
        longitude: lon,
        formattedLocation: stateName ? `${cityName}, ${stateName}, ${countryName}` : `${cityName}, ${countryName}`
      };
    }
  }

  // Step 2: Search all 148,000+ cities using expanding geographic bounding box
  const allCities = City.getAllCities();
  let nearestCity: any = null;
  let minDist = Infinity;

  // Expanding bounding box filter (1.5 deg ~= 160km, 4.0 deg ~= 440km, 15.0 deg global)
  for (const delta of [1.5, 4.0, 15.0]) {
    for (let i = 0; i < allCities.length; i++) {
      const c = allCities[i];
      if (!c.latitude || !c.longitude) continue;
      const cLat = parseFloat(c.latitude);
      if (cLat < lat - delta || cLat > lat + delta) continue;
      const cLon = parseFloat(c.longitude);
      if (cLon < lon - delta || cLon > lon + delta) continue;

      const d = Math.hypot(lat - cLat, lon - cLon);
      if (d < minDist) {
        minDist = d;
        nearestCity = c;
      }
    }
    if (nearestCity) break;
  }

  if (nearestCity) {
    const country = Country.getCountryByCode(nearestCity.countryCode);
    const countryName = country ? country.name : nearestCity.countryCode;
    const state = State.getStateByCodeAndCountry(nearestCity.stateCode, nearestCity.countryCode);
    const stateName = state ? state.name : '';
    const cityName = nearestCity.name;
    return {
      countryCode: nearestCity.countryCode,
      countryName,
      stateCode: nearestCity.stateCode,
      stateName,
      cityName,
      latitude: lat,
      longitude: lon,
      formattedLocation: stateName ? `${cityName}, ${stateName}, ${countryName}` : `${cityName}, ${countryName}`
    };
  }

  // Step 3: Fallback to nearest country centroid if coordinates in remote territory
  const allCountries = Country.getAllCountries();
  let nearestCountry = allCountries[0];
  let minCountryDist = Infinity;
  for (const c of allCountries) {
    if (c.latitude && c.longitude) {
      const d = Math.hypot(lat - parseFloat(c.latitude), lon - parseFloat(c.longitude));
      if (d < minCountryDist) {
        minCountryDist = d;
        nearestCountry = c;
      }
    }
  }

  return {
    countryCode: nearestCountry.isoCode,
    countryName: nearestCountry.name,
    cityName: 'Current Location',
    latitude: lat,
    longitude: lon,
    formattedLocation: nearestCountry.name
  };
}
