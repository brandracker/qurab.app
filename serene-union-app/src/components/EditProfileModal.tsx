import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  Compass, 
  Heart, 
  Check, 
  Loader2, 
  UserCheck,
  MapPin,
  GraduationCap,
  Navigation,
  Globe2
} from 'lucide-react';
import { Country, State, type ICountry } from 'country-state-city';
import { reverseGeocodeOffline } from '../utils/offlineGeo';
import type { UserProfile, Sect, PracticeLevel, MarriageTimeline } from '../types';
import { dbService } from '../services/dbService';

interface Props {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onSaved?: (updatedUser: UserProfile) => void;
}

type TabType = 'personal' | 'career' | 'deen' | 'lifestyle';

// Top priority country codes for quick Islamic & diaspora selection
const TOP_COUNTRY_CODES = ['GB', 'PK', 'US', 'CA', 'AE', 'SA', 'TR', 'AU', 'DE', 'MY', 'IN', 'BD', 'QA', 'KW', 'OM', 'EG', 'FR', 'NL', 'ID'];

// Curated major cities for popular regions
const POPULAR_STATE_CITIES: Record<string, string[]> = {
  // UK
  'GB-ENG': ['London', 'Birmingham', 'Manchester', 'Leeds', 'Bradford', 'Luton', 'Leicester', 'Sheffield', 'Bristol', 'Coventry'],
  'GB-SCT': ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee'],
  'GB-WLS': ['Cardiff', 'Swansea', 'Newport'],
  'GB-NIR': ['Belfast', 'Derry'],
  // Pakistan
  'PK-PB': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Gujrat'],
  'PK-SD': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas'],
  'PK-KP': ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Dera Ismail Khan', 'Nowshera'],
  'PK-BA': ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar'],
  'PK-IS': ['Islamabad'],
  'PK-JK': ['Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot'],
  'PK-GB': ['Gilgit', 'Skardu', 'Hunza'],
  // USA
  'US-TX': ['Dallas', 'Houston', 'Austin', 'Fort Worth', 'Plano', 'Irving', 'Frisco', 'Arlington'],
  'US-CA': ['Los Angeles', 'San Francisco', 'San Jose', 'San Diego', 'Irvine', 'Fremont', 'Sacramento'],
  'US-NY': ['New York', 'Brooklyn', 'Queens', 'Buffalo', 'Albany', 'Rochester'],
  'US-IL': ['Chicago', 'Naperville', 'Schaumburg', 'Oak Brook'],
  'US-NJ': ['Jersey City', 'Edison', 'Paterson', 'Paramus', 'Princeton', 'Newark'],
  'US-VA': ['Alexandria', 'Fairfax', 'Richmond', 'Arlington', 'McLean'],
  'US-MI': ['Detroit', 'Dearborn', 'Canton', 'Troy', 'Ann Arbor'],
  'US-FL': ['Miami', 'Orlando', 'Tampa', 'Fort Lauderdale', 'Jacksonville'],
  'US-GA': ['Atlanta', 'Alpharetta', 'Duluth', 'Marietta', 'Norcross'],
  // Canada
  'CA-ON': ['Toronto', 'Mississauga', 'Brampton', 'Ottawa', 'Oakville', 'Milton', 'Markham', 'Scarborough'],
  'CA-BC': ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Coquitlam'],
  'CA-AB': ['Calgary', 'Edmonton', 'Fort McMurray'],
  'CA-QC': ['Montreal', 'Laval', 'Quebec City'],
  // UAE
  'AE-DU': ['Dubai'],
  'AE-AZ': ['Abu Dhabi', 'Al Ain'],
  'AE-SH': ['Sharjah'],
  'AE-AJ': ['Ajman'],
  // Saudi Arabia
  'SA-01': ['Riyadh', 'Al Kharj'],
  'SA-02': ['Jeddah', 'Makkah', 'Taif'],
  'SA-04': ['Dammam', 'Khobar', 'Dhahran', 'Jubail'],
  'SA-03': ['Madinah', 'Yanbu'],
  // Turkey
  'TR-34': ['Istanbul'],
  'TR-06': ['Ankara'],
  // Australia
  'AU-NSW': ['Sydney', 'Parramatta'],
  'AU-VIC': ['Melbourne']
};

// Known city coordinates dictionary for automatic Haversine fallback
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  // UK
  'London': { lat: 51.5074, lon: -0.1278 },
  'Manchester': { lat: 53.4808, lon: -2.2426 },
  'Birmingham': { lat: 52.4862, lon: -1.8904 },
  'Leeds': { lat: 53.8008, lon: -1.5491 },
  'Bradford': { lat: 53.7960, lon: -1.7594 },
  'Luton': { lat: 51.8787, lon: -0.4200 },
  'Leicester': { lat: 52.6369, lon: -1.1398 },
  'Sheffield': { lat: 53.3811, lon: -1.4701 },
  'Glasgow': { lat: 55.8642, lon: -4.2518 },
  'Edinburgh': { lat: 55.9533, lon: -3.1883 },
  // Pakistan
  'Karachi': { lat: 24.8607, lon: 67.0011 },
  'Lahore': { lat: 31.5204, lon: 74.3587 },
  'Islamabad': { lat: 33.6844, lon: 73.0479 },
  'Rawalpindi': { lat: 33.5651, lon: 73.0169 },
  'Faisalabad': { lat: 31.4504, lon: 73.1350 },
  'Multan': { lat: 30.1575, lon: 71.5249 },
  'Peshawar': { lat: 34.0151, lon: 71.5249 },
  'Quetta': { lat: 30.1798, lon: 66.9750 },
  'Sialkot': { lat: 32.4945, lon: 74.5229 },
  'Gujranwala': { lat: 32.1877, lon: 74.1945 },
  // USA
  'New York': { lat: 40.7128, lon: -74.0060 },
  'Chicago': { lat: 41.8781, lon: -87.6298 },
  'Dallas': { lat: 32.7767, lon: -96.7970 },
  'Houston': { lat: 29.7604, lon: -95.3698 },
  'Los Angeles': { lat: 34.0522, lon: -118.2437 },
  'San Francisco': { lat: 37.7749, lon: -122.4194 },
  'San Jose': { lat: 37.3382, lon: -121.8863 },
  // Canada
  'Toronto': { lat: 43.6532, lon: -79.3832 },
  'Vancouver': { lat: 49.2827, lon: -123.1207 },
  'Calgary': { lat: 51.0447, lon: -114.0719 },
  'Montreal': { lat: 45.5017, lon: -73.5673 },
  'Mississauga': { lat: 43.5890, lon: -79.6441 },
  // UAE & Gulf
  'Dubai': { lat: 25.2048, lon: 55.2708 },
  'Abu Dhabi': { lat: 24.4539, lon: 54.3773 },
  'Sharjah': { lat: 25.3463, lon: 55.4209 },
  'Riyadh': { lat: 24.7136, lon: 46.6753 },
  'Jeddah': { lat: 21.4858, lon: 39.1925 },
  'Makkah': { lat: 21.3891, lon: 39.8579 },
  'Madinah': { lat: 24.5247, lon: 39.5692 },
  'Doha': { lat: 25.2854, lon: 51.5310 },
  // Australia
  'Sydney': { lat: -33.8688, lon: 151.2093 },
  'Melbourne': { lat: -37.8136, lon: 144.9631 }
};

export const EditProfileModal: React.FC<Props> = ({
  isOpen,
  user,
  onClose,
  onSaved
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State: Personal
  const [fullName, setFullName] = useState<string>('');
  const [age, setAge] = useState<number>(25);
  const [height, setHeight] = useState<string>('');
  const [ethnicity, setEthnicity] = useState<string>('');
  const [citizenship, setCitizenship] = useState<string>('');

  // Location System State
  const allCountries = useMemo<ICountry[]>(() => {
    const countries = Country.getAllCountries();
    const priority = countries.filter(c => TOP_COUNTRY_CODES.includes(c.isoCode));
    const others = countries.filter(c => !TOP_COUNTRY_CODES.includes(c.isoCode));
    priority.sort((a, b) => TOP_COUNTRY_CODES.indexOf(a.isoCode) - TOP_COUNTRY_CODES.indexOf(b.isoCode));
    others.sort((a, b) => a.name.localeCompare(b.name));
    return [...priority, ...others];
  }, []);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('GB');
  const [selectedStateCode, setSelectedStateCode] = useState<string>('');
  const [isCustomState, setIsCustomState] = useState<boolean>(false);
  const [customStateText, setCustomStateText] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');
  const [isCustomCity, setIsCustomCity] = useState<boolean>(false);
  const [customCityText, setCustomCityText] = useState<string>('');

  // GPS Coordinates & Status
  const [coords, setCoords] = useState<{ latitude?: number; longitude?: number }>({});
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Career & Education
  const [profession, setProfession] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [university, setUniversity] = useState<string>('');
  const [workArrangement, setWorkArrangement] = useState<string>('onsite');
  const [incomeBracket, setIncomeBracket] = useState<string>('undisclosed');

  // Deen
  const [practiceLevel, setPracticeLevel] = useState<PracticeLevel>('practicing');
  const [sect, setSect] = useState<Sect>('Sunni');
  const [madhhab, setMadhhab] = useState<string>('Hanafi');
  const [prayerFrequency, setPrayerFrequency] = useState<string>('5 times daily');
  const [halalDiet, setHalalDiet] = useState<string>('Strictly Halal');
  const [modestyPractice, setModestyPractice] = useState<string>('');

  // Marriage & Lifestyle
  const [marriageTimeline, setMarriageTimeline] = useState<MarriageTimeline>('within_1_year');
  const [maritalStatus, setMaritalStatus] = useState<string>('never_married');
  const [livingPreference, setLivingPreference] = useState<string>('independent');
  const [willingnessToRelocate, setWillingnessToRelocate] = useState<string>('open');
  const [smokingStatus, setSmokingStatus] = useState<string>('non_smoker');
  const [languagesSpoken, setLanguagesSpoken] = useState<string>('English');
  const [childrenDesire, setChildrenDesire] = useState<string>('wants_children');
  const [bio, setBio] = useState<string>('');

  // Hydrate fields on open or user change
  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.fullName || '');
      setAge(user.age || 25);
      setHeight(user.height || "5'8\" (173 cm)");
      setEthnicity(user.ethnicity || 'Global');
      setCitizenship(user.citizenship || '');

      // Resolve Country
      let cCode = 'GB';
      if (user.country) {
        const foundCountry = Country.getAllCountries().find(c => 
          c.name.toLowerCase() === user.country?.toLowerCase() || 
          c.isoCode.toLowerCase() === user.country?.toLowerCase()
        );
        if (foundCountry) cCode = foundCountry.isoCode;
      }
      setSelectedCountryCode(cCode);

      // Resolve State & City
      const userCity = user.city || (user.location && user.location !== 'Global' ? user.location.split(',')[0].trim() : '') || '';
      const states = State.getStatesOfCountry(cCode);
      if (states.length > 0) {
        setSelectedStateCode(states[0].isoCode);
        const presetCities = POPULAR_STATE_CITIES[`${cCode}-${states[0].isoCode}`] || [];
        if (presetCities.includes(userCity)) {
          setSelectedCityName(userCity);
          setIsCustomCity(false);
          setCustomCityText('');
        } else if (userCity) {
          setSelectedCityName('');
          setIsCustomCity(true);
          setCustomCityText(userCity);
        } else if (presetCities.length > 0) {
          setSelectedCityName(presetCities[0]);
          setIsCustomCity(false);
          setCustomCityText('');
        }
      } else {
        setSelectedStateCode('');
        setIsCustomState(true);
        setSelectedCityName('');
        setIsCustomCity(true);
        setCustomCityText(userCity);
      }

      // Initial Coordinates
      if (typeof user.latitude === 'number' && typeof user.longitude === 'number') {
        setCoords({ latitude: user.latitude, longitude: user.longitude });
        setLocationStatus(`📍 Accurate coordinates active (${user.latitude.toFixed(2)}, ${user.longitude.toFixed(2)})`);
      } else if (userCity && CITY_COORDINATES[userCity]) {
        const lookup = CITY_COORDINATES[userCity];
        setCoords({ latitude: lookup.lat, longitude: lookup.lon });
        setLocationStatus(`📍 City coordinates active (${lookup.lat.toFixed(2)}, ${lookup.lon.toFixed(2)})`);
      } else {
        setCoords({});
        setLocationStatus(null);
      }

      // Career & Education
      setProfession(user.profession || '');
      setEducation(user.education || '');
      setUniversity(user.university || '');
      setWorkArrangement(user.workArrangement || 'onsite');
      setIncomeBracket(user.incomeBracket || 'undisclosed');

      // Deen
      setPracticeLevel(user.religiousProfile?.practiceLevel || 'practicing');
      setSect(user.religiousProfile?.sect || 'Sunni');
      setMadhhab(user.religiousProfile?.madhhab || 'Hanafi');
      setPrayerFrequency(user.religiousProfile?.prayerFrequency || '5 times daily');
      setHalalDiet(user.religiousProfile?.halalDiet || 'Strictly Halal');
      setModestyPractice(user.religiousProfile?.modestyPractice || '');

      // Lifestyle
      setMarriageTimeline((user.marriageTimeline as MarriageTimeline) || 'within_1_year');
      setMaritalStatus(user.maritalStatus || 'never_married');
      setLivingPreference(user.livingPreference || 'independent');
      setWillingnessToRelocate(user.willingnessToRelocate || 'open');
      setSmokingStatus(user.smokingStatus || 'non_smoker');
      setLanguagesSpoken(user.languagesSpoken || 'English');
      setChildrenDesire(user.childrenDesire || 'wants_children');
      setBio(user.bio || user.religiousProfile?.deenRelationshipBio || '');
      setSuccessMessage(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Available states for chosen country
  const availableStates = State.getStatesOfCountry(selectedCountryCode);
  const currentRegionKey = `${selectedCountryCode}-${selectedStateCode}`;
  const availableCities = (!isCustomState && selectedStateCode) ? (POPULAR_STATE_CITIES[currentRegionKey] || []) : [];
  const isCustomCityActive = isCustomCity || availableCities.length === 0;

  const selectedCountryObj = Country.getCountryByCode(selectedCountryCode);
  const selectedStateObj = selectedCountryCode && selectedStateCode 
    ? State.getStateByCodeAndCountry(selectedStateCode, selectedCountryCode) 
    : null;

  // Country Change Handler
  const handleCountryChange = (cCode: string) => {
    setSelectedCountryCode(cCode);
    setIsCustomState(false);
    setCustomStateText('');
    setIsCustomCity(false);
    setCustomCityText('');

    const states = State.getStatesOfCountry(cCode);
    if (states.length > 0) {
      setSelectedStateCode(states[0].isoCode);
      const cities = POPULAR_STATE_CITIES[`${cCode}-${states[0].isoCode}`];
      if (cities && cities.length > 0) {
        setSelectedCityName(cities[0]);
        if (CITY_COORDINATES[cities[0]]) {
          const l = CITY_COORDINATES[cities[0]];
          setCoords({ latitude: l.lat, longitude: l.lon });
          setLocationStatus(`📍 City coordinates active (${l.lat.toFixed(2)}, ${l.lon.toFixed(2)})`);
        }
      } else {
        setSelectedCityName('');
        setIsCustomCity(true);
      }
    } else {
      setSelectedStateCode('');
      setIsCustomState(true);
      setSelectedCityName('');
      setIsCustomCity(true);
    }
  };

  // State Change Handler
  const handleStateChange = (sCode: string) => {
    setSelectedStateCode(sCode);
    setIsCustomState(false);
    setCustomStateText('');
    setIsCustomCity(false);
    setCustomCityText('');

    const cities = POPULAR_STATE_CITIES[`${selectedCountryCode}-${sCode}`];
    if (cities && cities.length > 0) {
      setSelectedCityName(cities[0]);
      if (CITY_COORDINATES[cities[0]]) {
        const l = CITY_COORDINATES[cities[0]];
        setCoords({ latitude: l.lat, longitude: l.lon });
        setLocationStatus(`📍 City coordinates active (${l.lat.toFixed(2)}, ${l.lon.toFixed(2)})`);
      }
    } else {
      setSelectedCityName('');
      setIsCustomCity(true);
    }
  };

  // City Change Handler
  const handleCityChange = (cityName: string) => {
    setSelectedCityName(cityName);
    setIsCustomCity(false);
    setCustomCityText('');
    if (CITY_COORDINATES[cityName]) {
      const l = CITY_COORDINATES[cityName];
      setCoords({ latitude: l.lat, longitude: l.lon });
      setLocationStatus(`📍 City coordinates active (${l.lat.toFixed(2)}, ${l.lon.toFixed(2)})`);
    }
  };

  // GPS Auto-Detect Handler with 100% Offline Device Math Reverse Geocoding
  const handleDetectLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationStatus('Detecting accurate GPS location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Math.round(position.coords.latitude * 10000) / 10000;
        const lon = Math.round(position.coords.longitude * 10000) / 10000;
        setCoords({ latitude: lat, longitude: lon });

        // 100% Offline Device Math: Instantly resolve country, state, and city
        try {
          const geoResult = reverseGeocodeOffline(lat, lon);
          if (geoResult.countryCode) {
            setSelectedCountryCode(geoResult.countryCode);
          }
          if (geoResult.stateCode) {
            setSelectedStateCode(geoResult.stateCode);
            setIsCustomState(false);
          }
          if (geoResult.cityName) {
            setSelectedCityName(geoResult.cityName);
            setIsCustomCity(false);
            setCustomCityText('');
          }
          setIsLocating(false);
          setLocationStatus(`📍 Accurate coordinates captured: ${geoResult.cityName}, ${geoResult.countryName} (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
        } catch {
          setIsLocating(false);
          setLocationStatus(`📍 Accurate coordinates captured (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === 1) {
          setLocationStatus('Location permission not granted. Selected city coordinates will be used.');
        } else {
          setLocationStatus('GPS signal unavailable. Selected city coordinates will be used.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);

    const cityName = isCustomCityActive 
      ? (customCityText.trim() || selectedCityName.trim() || 'City') 
      : (selectedCityName.trim() || customCityText.trim() || 'City');
    const countryName = selectedCountryObj?.name || 'Global';
    const stateName = isCustomState ? customStateText.trim() : (selectedStateObj?.name || '');
    const locationString = stateName ? `${cityName}, ${stateName}, ${countryName}` : `${cityName}, ${countryName}`;

    // Auto-resolve coordinates if GPS was not manually captured
    let finalLat = coords.latitude;
    let finalLon = coords.longitude;
    if (finalLat === undefined || finalLon === undefined) {
      if (CITY_COORDINATES[cityName]) {
        finalLat = CITY_COORDINATES[cityName].lat;
        finalLon = CITY_COORDINATES[cityName].lon;
      } else if (selectedCountryObj?.latitude && selectedCountryObj?.longitude) {
        finalLat = parseFloat(selectedCountryObj.latitude);
        finalLon = parseFloat(selectedCountryObj.longitude);
      }
    }

    const updatedProfile: Partial<UserProfile> = {
      fullName: fullName.trim() || user.fullName,
      age: Number(age) || user.age,
      city: cityName,
      country: countryName,
      location: locationString,
      latitude: finalLat,
      longitude: finalLon,
      height,
      ethnicity: ethnicity.trim(),
      citizenship: citizenship.trim(),
      profession: profession.trim(),
      education: education.trim(),
      university: university.trim(),
      workArrangement: workArrangement as any,
      incomeBracket: incomeBracket as any,
      marriageTimeline,
      maritalStatus: maritalStatus as any,
      livingPreference: livingPreference as any,
      willingnessToRelocate: willingnessToRelocate as any,
      smokingStatus: smokingStatus as any,
      languagesSpoken: languagesSpoken.trim(),
      childrenDesire,
      bio: bio.trim(),
      religiousProfile: {
        ...(user.religiousProfile || {
          practiceLevel: 'practicing',
          sect: 'Sunni',
          prayerFrequency: '5 times daily',
          halalDiet: 'Strictly Halal'
        }),
        practiceLevel,
        sect,
        madhhab,
        prayerFrequency,
        halalDiet,
        modestyPractice: modestyPractice.trim(),
        deenRelationshipBio: bio.trim()
      }
    };

    try {
      const savedUser = await dbService.updateUserProfileLive(user.id, updatedProfile);
      const mergedUser: UserProfile = savedUser || { ...user, ...updatedProfile } as UserProfile;
      
      setSuccessMessage('Profile & location details updated successfully!');
      if (onSaved) {
        onSaved(mergedUser);
      }
      
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 600);
    } catch (err) {
      console.warn('Failed to update profile live:', err);
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs px-0 sm:px-4 font-sans animate-fade-in select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] flex flex-col shadow-2xl border border-outline overflow-hidden animate-slide-up">
        
        {/* Header */}
        <header className="sticky top-0 bg-white px-5 py-3.5 border-b border-outline flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pastel-rose text-primary flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 id="edit-profile-modal-title" className="font-serif text-sm font-bold text-on-surface">
                Edit Matrimonial Biodata
              </h2>
              <p className="text-[10px] text-secondary">
                Update personal, verified location, career, and Islamic values in-place
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close edit profile dialog"
            className="w-8 h-8 rounded-full bg-surface hover:bg-outline/40 flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Tab Navigation */}
        <nav className="flex items-center justify-between border-b border-outline px-3 bg-surface/30">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'personal'
                ? 'border-primary text-primary font-bold bg-white'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('career')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'career'
                ? 'border-primary text-primary font-bold bg-white'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deen')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'deen'
                ? 'border-primary text-primary font-bold bg-white'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Deen</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lifestyle')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'lifestyle'
                ? 'border-primary text-primary font-bold bg-white'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Lifestyle</span>
          </button>
        </nav>

        {/* Scrollable Form Body */}
        <form id="edit-profile-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-medium animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Tab 1: Personal Details */}
          {activeTab === 'personal' && (
            <div className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Zayn Malik"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="80"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={"e.g. 5'10\" (178 cm)"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Enhanced Location Selection System */}
              <div className="p-3.5 bg-pastel-rose/30 border border-primary/20 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-on-surface flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-primary" />
                    <span>Verified Location & Haversine Coordinates</span>
                  </span>
                  <span className="text-[10px] text-secondary font-medium">Worldwide</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Country Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-secondary mb-1">
                      Country
                    </label>
                    <select
                      aria-label="Country"
                      value={selectedCountryCode}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                    >
                      {allCountries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-secondary mb-1">
                      State / Province
                    </label>
                    {availableStates.length > 0 && !isCustomState ? (
                      <select
                        aria-label="State or Province"
                        value={selectedStateCode}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                      >
                        {availableStates.map((s) => (
                          <option key={s.isoCode} value={s.isoCode}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={customStateText}
                        onChange={(e) => setCustomStateText(e.target.value)}
                        placeholder="e.g. Greater London"
                        className="w-full px-2.5 py-2 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                      />
                    )}
                  </div>
                </div>

                {/* City Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-secondary flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>City</span>
                    </label>
                    {availableCities.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsCustomCity(!isCustomCity)}
                        className="text-[10px] text-primary font-bold hover:underline"
                      >
                        {isCustomCity ? 'Choose from list' : 'Type custom city'}
                      </button>
                    )}
                  </div>

                  {availableCities.length > 0 && !isCustomCity ? (
                    <select
                      aria-label="City"
                      value={selectedCityName}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                    >
                      {availableCities.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      aria-label="City Name"
                      value={customCityText}
                      onChange={(e) => {
                        setCustomCityText(e.target.value);
                        if (CITY_COORDINATES[e.target.value.trim()]) {
                          const l = CITY_COORDINATES[e.target.value.trim()];
                          setCoords({ latitude: l.lat, longitude: l.lon });
                          setLocationStatus(`📍 City coordinates active (${l.lat.toFixed(2)}, ${l.lon.toFixed(2)})`);
                        }
                      }}
                      placeholder="e.g. Manchester, London, Karachi"
                      className="w-full px-2.5 py-2 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                    />
                  )}
                </div>

                {/* GPS Auto-Detect Button for Pinpoint Haversine Distance */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-white/80 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
                  >
                    {isLocating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    ) : (
                      <Navigation className="w-3.5 h-3.5 text-primary" />
                    )}
                    <span>Auto-detect accurate GPS location</span>
                  </button>

                  {locationStatus && (
                    <p className="text-[10px] text-emerald-800 font-semibold mt-1.5 px-1 flex items-center gap-1">
                      <span>{locationStatus}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Ethnicity
                  </label>
                  <input
                    type="text"
                    value={ethnicity}
                    onChange={(e) => setEthnicity(e.target.value)}
                    placeholder="e.g. South Asian, Arab"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Citizenship
                  </label>
                  <input
                    type="text"
                    value={citizenship}
                    onChange={(e) => setCitizenship(e.target.value)}
                    placeholder="e.g. British, Canadian"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Career & Education */}
          {activeTab === 'career' && (
            <div className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  Profession / Job Title
                </label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-primary" />
                  <span>Degree / Qualification</span>
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. BSc Computer Science"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  University / College
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. University of Manchester"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Work Arrangement
                  </label>
                  <select
                    value={workArrangement}
                    onChange={(e) => setWorkArrangement(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Remote</option>
                    <option value="entrepreneur">Business / Entrepreneur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Income Bracket
                  </label>
                  <select
                    value={incomeBracket}
                    onChange={(e) => setIncomeBracket(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="undisclosed">Prefer not to say</option>
                    <option value="under_40k">Under $40,000</option>
                    <option value="40k_80k">$40,000 - $80,000</option>
                    <option value="80k_150k">$80,000 - $150,000</option>
                    <option value="150k_plus">$150,000+</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Deen & Practice */}
          {activeTab === 'deen' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Sect
                  </label>
                  <select
                    value={sect}
                    onChange={(e) => setSect(e.target.value as Sect)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Sunni">Sunni</option>
                    <option value="Shia">Shia</option>
                    <option value="Just Muslim">Just Muslim</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Madhhab
                  </label>
                  <select
                    value={madhhab}
                    onChange={(e) => setMadhhab(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Hanafi">Hanafi</option>
                    <option value="Shafi'i">Shafi'i</option>
                    <option value="Maliki">Maliki</option>
                    <option value="Hanbali">Hanbali</option>
                    <option value="Jafari">Jafari</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Practice Level
                  </label>
                  <select
                    value={practiceLevel}
                    onChange={(e) => setPracticeLevel(e.target.value as PracticeLevel)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="practicing">Practicing</option>
                    <option value="moderately_practicing">Moderately Practicing</option>
                    <option value="cultural">Cultural</option>
                    <option value="revert">Revert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Prayer Frequency
                  </label>
                  <select
                    value={prayerFrequency}
                    onChange={(e) => setPrayerFrequency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="5 times daily">5 times daily</option>
                    <option value="Usually">Usually</option>
                    <option value="Sometimes">Sometimes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Halal Diet
                  </label>
                  <select
                    value={halalDiet}
                    onChange={(e) => setHalalDiet(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Strictly Halal">Strictly Halal</option>
                    <option value="Zabiha Only">Zabiha Only</option>
                    <option value="Halal at Home">Halal at Home</option>
                    <option value="Vegetarian">Vegetarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Modesty Practice
                  </label>
                  <input
                    type="text"
                    value={modestyPractice}
                    onChange={(e) => setModestyPractice(e.target.value)}
                    placeholder="e.g. Hijab / Sunnah Beard"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Lifestyle & Matrimony */}
          {activeTab === 'lifestyle' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Marriage Timeline
                  </label>
                  <select
                    value={marriageTimeline}
                    onChange={(e) => setMarriageTimeline(e.target.value as MarriageTimeline)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="1_to_3_months">1 - 3 Months</option>
                    <option value="within_1_year">Within 1 Year</option>
                    <option value="right_person">When Right Person</option>
                    <option value="exploring">Exploring Intently</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Marital Status
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="never_married">Never Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="single_parent">Single Parent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Living Preference
                  </label>
                  <select
                    value={livingPreference}
                    onChange={(e) => setLivingPreference(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="independent">Independent Home</option>
                    <option value="with_in_laws">With In-Laws</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Relocate Willingness
                  </label>
                  <select
                    value={willingnessToRelocate}
                    onChange={(e) => setWillingnessToRelocate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="open">Open to Relocate</option>
                    <option value="willing">Willing to Move</option>
                    <option value="not_willing">Not Willing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Smoking Status
                  </label>
                  <select
                    value={smokingStatus}
                    onChange={(e) => setSmokingStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-white text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="non_smoker">Non-Smoker</option>
                    <option value="trying_to_quit">Trying to Quit</option>
                    <option value="occasional">Occasional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    value={languagesSpoken}
                    onChange={(e) => setLanguagesSpoken(e.target.value)}
                    placeholder="e.g. English, Urdu, Arabic"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface mb-1">
                  Matrimonial Bio & Aspirations
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief overview of your personality, goals, and what you seek in a spouse..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface/20 text-xs font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <footer className="sticky bottom-0 bg-white px-5 py-3.5 border-t border-outline flex items-center justify-end gap-2.5 z-10 shadow-subtle">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-full border border-outline text-secondary hover:text-on-surface font-sans text-xs font-bold transition-all active:scale-98"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark transition-all active:scale-98 flex items-center justify-center gap-1.5 min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </footer>

      </div>
    </div>
  );
};

export default EditProfileModal;
