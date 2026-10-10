import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Calendar, 
  Ruler, 
  MapPin, 
  Globe2, 
  Plane, 
  Home, 
  Check, 
  ChevronDown,
  ShieldCheck,
  Loader2,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { Country, State, type ICountry, type IState } from 'country-state-city';
import { reverseGeocodeOffline } from '../utils/offlineGeo';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { dbService } from '../services/dbService';

interface Props {
  data?: {
    fullName?: string;
    dob?: string;
    gender?: string;
    location?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    height?: string;
    ethnicity?: string;
    citizenship?: string;
    willingnessToRelocate?: 'willing' | 'not_willing' | 'open';
  };
  onBack: () => void;
  onContinue: (info: {
    fullName: string;
    dob: string;
    gender: string;
    location: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    height: string;
    ethnicity: string;
    citizenship: string;
    willingnessToRelocate: 'willing' | 'not_willing' | 'open';
  }) => void;
}

// Top priority country codes for quick Islamic & diaspora selection
const TOP_COUNTRY_CODES = ['GB', 'PK', 'US', 'CA', 'AE', 'SA', 'TR', 'AU', 'DE', 'MY', 'IN', 'BD', 'QA', 'KW', 'OM', 'EG', 'FR', 'NL', 'ID'];

export const BasicInfoScreen: React.FC<Props> = ({ data, onBack, onContinue }) => {
  const [fullName, setFullName] = useState(data?.fullName || '');
  const [gender, setGender] = useState<'male' | 'female'>(() => {
    if (data?.gender === 'female' || data?.gender === 'male') return data.gender;
    const lower = (data?.fullName || '').toLowerCase();
    if (
      lower.includes('fatima') || lower.includes('zainab') || lower.includes('maryam') ||
      lower.includes('aisha') || lower.includes('sarah') || lower.includes('noor') ||
      lower.includes('ayesha') || lower.includes('naheed')
    ) {
      return 'female';
    }
    return 'male';
  });

  // --- Date of Birth System ---
  const initialDobParts = useMemo(() => {
    if (data?.dob) {
      const parts = data.dob.split('-');
      if (parts.length === 3) {
        return {
          year: parseInt(parts[0], 10),
          month: parseInt(parts[1], 10),
          day: parseInt(parts[2], 10)
        };
      }
    }
    return { year: 1998, month: 1, day: 1 };
  }, [data?.dob]);

  const [birthYear, setBirthYear] = useState<number>(initialDobParts.year);
  const [birthMonth, setBirthMonth] = useState<number>(initialDobParts.month);
  const [birthDay, setBirthDay] = useState<number>(initialDobParts.day);

  // Calculate live age
  const calculatedAge = useMemo(() => {
    const today = new Date();
    let age = today.getFullYear() - birthYear;
    const m = today.getMonth() + 1 - birthMonth;
    if (m < 0 || (m === 0 && today.getDate() < birthDay)) {
      age--;
    }
    return Math.max(18, age);
  }, [birthYear, birthMonth, birthDay]);

  // --- Height System (Dual-Unit: Feet & Inches + Centimeters with live sync) ---
  const parseInitialCm = (hStr?: string): number => {
    if (!hStr) return 178;
    const match = hStr.match(/(\d{3})\s*cm/i);
    if (match) return parseInt(match[1], 10);
    const ftMatch = hStr.match(/(\d)['’]\s*(\d{1,2})/);
    if (ftMatch) {
      const ft = parseInt(ftMatch[1], 10);
      const inc = parseInt(ftMatch[2], 10);
      return Math.round((ft * 12 + inc) * 2.54);
    }
    const numMatch = hStr.match(/(\d{2,3})/);
    if (numMatch) {
      const n = parseInt(numMatch[1], 10);
      if (n >= 120 && n <= 235) return n;
    }
    return 178;
  };

  const [heightCm, setHeightCm] = useState<number>(() => parseInitialCm(data?.height));
  const [heightInputText, setHeightInputText] = useState<string>(() => String(parseInitialCm(data?.height)));
  const [heightUnit, setHeightUnit] = useState<'ft' | 'cm'>('ft');

  // Re-synchronize local state when incoming data changes (e.g. Edit Profile prefill)
  useEffect(() => {
    if (data?.fullName) setFullName(data.fullName);
    if (data?.gender === 'male' || data?.gender === 'female') setGender(data.gender);
    if (data?.height) {
      const parsed = parseInitialCm(data.height);
      setHeightCm(parsed);
      setHeightInputText(String(parsed));
    }
    if (data?.ethnicity) setEthnicity(data.ethnicity);
    if (data?.citizenship) setCitizenship(data.citizenship);
    if (data?.willingnessToRelocate) setWillingnessToRelocate(data.willingnessToRelocate);
    if (data?.dob) {
      const parts = data.dob.split('-');
      if (parts.length === 3) {
        setBirthYear(parseInt(parts[0], 10));
        setBirthMonth(parseInt(parts[1], 10));
        setBirthDay(parseInt(parts[2], 10));
      }
    }
  }, [data]);

  const formatCmToFeet = (cm: number): string => {
    if (!cm || cm < 50) return "5'10\"";
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}"`;
  };

  const totalInches = Math.round((heightCm || 178) / 2.54);
  const currentFeet = Math.max(4, Math.min(7, Math.floor(totalInches / 12)));
  const currentInches = Math.max(0, Math.min(11, totalInches % 12));

  const handleFeetChange = (newFeet: number) => {
    const newCm = Math.round((newFeet * 12 + currentInches) * 2.54);
    setHeightCm(newCm);
    setHeightInputText(String(newCm));
  };

  const handleInchesChange = (newInches: number) => {
    const newCm = Math.round((currentFeet * 12 + newInches) * 2.54);
    setHeightCm(newCm);
    setHeightInputText(String(newCm));
  };

  const formattedHeightFull = `${formatCmToFeet(heightCm)} (${heightCm} cm)`;

  // --- Worldwide Global Location System (All 250 Countries, States, & Cities) ---
  const allCountries = useMemo<ICountry[]>(() => {
    const countries = Country.getAllCountries();
    const priority = countries.filter(c => TOP_COUNTRY_CODES.includes(c.isoCode));
    const others = countries.filter(c => !TOP_COUNTRY_CODES.includes(c.isoCode));
    // Sort priority by TOP_COUNTRY_CODES order
    priority.sort((a, b) => TOP_COUNTRY_CODES.indexOf(a.isoCode) - TOP_COUNTRY_CODES.indexOf(b.isoCode));
    // Sort others alphabetically
    others.sort((a, b) => a.name.localeCompare(b.name));
    return [...priority, ...others];
  }, []);

  const initialCountryCode = useMemo(() => {
    if (data?.country) {
      const match = Country.getAllCountries().find(c => 
        c.name.toLowerCase() === data.country?.toLowerCase() || 
        c.isoCode.toLowerCase() === data.country?.toLowerCase()
      );
      if (match) return match.isoCode;
    }
    return 'GB';
  }, [data?.country]);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(initialCountryCode);
  const [selectedStateCode, setSelectedStateCode] = useState<string>('');
  const [isCustomState, setIsCustomState] = useState<boolean>(false);
  const [customStateText, setCustomStateText] = useState<string>('');

  const initialCity = useMemo(() => {
    if (data?.city) return data.city;
    if (data?.location && data.location !== 'Global') {
      const parts = data.location.split(',');
      if (parts.length > 0 && parts[0].trim() && parts[0].trim().toLowerCase() !== 'city') {
        return parts[0].trim();
      }
    }
    return '';
  }, [data?.city, data?.location]);

  const [selectedCityName, setSelectedCityName] = useState<string>(initialCity);
  const [isCustomCity, setIsCustomCity] = useState<boolean>(Boolean(initialCity));
  const [customCityText, setCustomCityText] = useState<string>(initialCity);

  // Available states for chosen country
  const availableStates = useMemo<IState[]>(() => {
    if (!selectedCountryCode) return [];
    return State.getStatesOfCountry(selectedCountryCode);
  }, [selectedCountryCode]);

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
    'US-NY': ['New York City', 'Brooklyn', 'Queens', 'Buffalo', 'Albany', 'Rochester'],
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

  const currentRegionKey = `${selectedCountryCode}-${selectedStateCode}`;
  const availableCities = useMemo<string[]>(() => {
    if (isCustomState || !selectedStateCode) return [];
    return POPULAR_STATE_CITIES[currentRegionKey] || [];
  }, [currentRegionKey, isCustomState, selectedStateCode]);

  // Initialize first state & city when country changes
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

  const handleStateChange = (sCode: string) => {
    setSelectedStateCode(sCode);
    setIsCustomState(false);
    setCustomStateText('');
    setIsCustomCity(false);
    setCustomCityText('');

    const cities = POPULAR_STATE_CITIES[`${selectedCountryCode}-${sCode}`];
    if (cities && cities.length > 0) {
      setSelectedCityName(cities[0]);
    } else {
      setSelectedCityName('');
      setIsCustomCity(true);
    }
  };


  // Selected Country Info
  const selectedCountryObj = useMemo(() => {
    return Country.getCountryByCode(selectedCountryCode);
  }, [selectedCountryCode]);

  // Selected State Info
  const selectedStateObj = useMemo(() => {
    if (!selectedCountryCode || !selectedStateCode) return null;
    return State.getStateByCodeAndCountry(selectedStateCode, selectedCountryCode);
  }, [selectedCountryCode, selectedStateCode]);

  // Determine if custom city text mode is active (manual toggle or when no preset cities available)
  const isCustomCityActive = isCustomCity || availableCities.length === 0;

  // Build final location string
  const finalLocationString = useMemo(() => {
    const cityName = isCustomCityActive ? (customCityText.trim() || 'City') : (selectedCityName || 'City');
    const stateName = isCustomState ? (customStateText.trim() || '') : (selectedStateObj?.name || '');
    const countryCodeOrName = selectedCountryObj?.isoCode || 'Global';

    if (stateName) {
      return `${cityName}, ${stateName}, ${countryCodeOrName}`;
    }
    return `${cityName}, ${countryCodeOrName}`;
  }, [isCustomCityActive, customCityText, selectedCityName, isCustomState, customStateText, selectedStateObj, selectedCountryObj]);

  // --- Ethnicity & Citizenship ---
  const [ethnicity, setEthnicity] = useState(data?.ethnicity || 'South Asian');
  const [citizenship, setCitizenship] = useState(data?.citizenship || 'Citizen');

  // --- Relocation Status ---
  const [willingnessToRelocate, setWillingnessToRelocate] = useState<'willing' | 'not_willing' | 'open'>(
    data?.willingnessToRelocate || 'open'
  );

  // --- Accurate GPS Geolocation Coordinates ---
  const [coords, setCoords] = useState<{ latitude?: number; longitude?: number }>({
    latitude: data?.latitude,
    longitude: data?.longitude
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(
    data?.latitude ? '📍 Accurate GPS coordinates active' : null
  );

  const handleDetectLocation = async () => {
    setIsLocating(true);
    setLocationStatus('Detecting accurate GPS location...');

    // 1. Android Native Capacitor Geolocation
    if (Capacitor.isNativePlatform()) {
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
          setCoords({ latitude: lat, longitude: lon });

          try {
            const geoResult = reverseGeocodeOffline(lat, lon);
            if (geoResult.countryCode) setSelectedCountryCode(geoResult.countryCode);
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
            return;
          } catch {
            setIsLocating(false);
            setLocationStatus(`📍 Accurate coordinates captured (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
            return;
          }
        }
      } catch (nativeErr) {
        console.warn('Native GPS capture attempt, attempting fallback:', nativeErr);
      }
    }

    // 2. Web Browser Geolocation
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      try {
        const ipLoc = await dbService.detectLocationByIP();
        if (ipLoc) {
          setCoords({ latitude: ipLoc.latitude, longitude: ipLoc.longitude });
          const geoResult = reverseGeocodeOffline(ipLoc.latitude, ipLoc.longitude);
          if (geoResult.countryCode) setSelectedCountryCode(geoResult.countryCode);
          if (geoResult.cityName) {
            setSelectedCityName(geoResult.cityName);
            setIsCustomCity(false);
            setCustomCityText('');
          }
          setIsLocating(false);
          setLocationStatus(`📍 Accurate coordinates captured: ${ipLoc.city}, ${ipLoc.country} (${ipLoc.latitude.toFixed(2)}, ${ipLoc.longitude.toFixed(2)})`);
          return;
        }
      } catch {}
      setIsLocating(false);
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

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
          setLocationStatus('Location permission not granted. Selected city will be used.');
        } else {
          setLocationStatus('GPS signal unavailable. Selected city will be used.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required to build your verified profile.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your real full name (at least 2 letters).';
    }

    if (calculatedAge < 18) {
      newErrors.dob = 'You must be at least 18 years old for matrimonial registration.';
    }

    if (isCustomCityActive && !customCityText.trim() && !selectedCityName.trim()) {
      newErrors.city = 'Please enter your city name.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto-scroll to first invalid element
      const firstKey = Object.keys(newErrors)[0];
      const targetId = firstKey === 'fullName' ? 'field-fullName' : (firstKey === 'city' ? 'field-city' : 'field-dob');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    const dobFormatted = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
    const cityName = isCustomCityActive 
      ? (customCityText.trim() || selectedCityName.trim() || 'City') 
      : (selectedCityName.trim() || customCityText.trim() || 'City');
    const countryName = selectedCountryObj?.name || 'Global';

    onContinue({
      fullName: fullName.trim(),
      dob: dobFormatted,
      gender,
      location: finalLocationString,
      city: cityName,
      country: countryName,
      latitude: coords.latitude,
      longitude: coords.longitude,
      height: formattedHeightFull,
      ethnicity,
      citizenship,
      willingnessToRelocate
    });
  };

  // Month list for DOB
  const MONTHS = [
    { value: 1, name: 'Jan' },
    { value: 2, name: 'Feb' },
    { value: 3, name: 'Mar' },
    { value: 4, name: 'Apr' },
    { value: 5, name: 'May' },
    { value: 6, name: 'Jun' },
    { value: 7, name: 'Jul' },
    { value: 8, name: 'Aug' },
    { value: 9, name: 'Sep' },
    { value: 10, name: 'Oct' },
    { value: 11, name: 'Nov' },
    { value: 12, name: 'Dec' }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-b from-[#FF2560] via-[#F31A56] to-[#DE0E46] font-sans overflow-y-auto pb-24 select-none text-white transition-all">
      <div>
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between mb-3 pt-1">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white text-[#FF2560] flex items-center justify-center hover:bg-white/90 active:scale-95 transition-all shadow-md cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-xs">
            <span className="text-[11px] font-bold text-white tracking-wider uppercase">Step 1 of 5</span>
            <span className="text-[11px] font-medium text-white/90">· Personal</span>
          </div>
          <div className="w-9" />
        </div>

        {/* 5-Step Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-4 px-0.5">
          <div className="h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] scale-y-110" />
          <div className="h-2 rounded-full bg-white/25" />
          <div className="h-2 rounded-full bg-white/25" />
          <div className="h-2 rounded-full bg-white/25" />
          <div className="h-2 rounded-full bg-white/25" />
        </div>

        <div className="px-1 mb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-xs">
              Personal Background
            </h1>
          </div>
          <p className="text-xs text-white/90 leading-relaxed font-medium">
            Provide your biodata accurately to help prospective matches understand your profile.
          </p>
        </div>

        {/* Top Validation Warning Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-3.5 rounded-2xl bg-white text-rose-700 flex items-start gap-2.5 shadow-lg border border-rose-200 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="block font-bold text-rose-900">Please fill in all highlighted required fields before continuing:</strong>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Kindly provide your full name and complete all required biodata fields.
              </p>
            </div>
          </div>
        )}

        {/* Crisp Floating White Card Panel */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] space-y-4 text-slate-900 border border-white/60">
          {/* Full Name */}
          <div id="field-fullName">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Full Name <span className="text-[#FF2560]">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors(prev => { const cp = { ...prev }; delete cp.fullName; return cp; });
              }}
              placeholder="e.g. Fatima Tariq or Bilal Ahmad"
              className={`w-full rounded-2xl px-3.5 py-2.5 text-xs outline-none transition-all border-2 ${
                errors.fullName
                  ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-200 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FF2560] focus:ring-2 focus:ring-[#FF2560]/15 shadow-2xs'
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'male' as const, label: 'Brother (Male)' },
                { id: 'female' as const, label: 'Sister (Female)' }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id)}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    gender === g.id
                      ? 'border-primary border-[#FF2560] bg-[#FFF0F3] text-primary text-[#FF2560] font-bold shadow-sm ring-1 ring-[#FF2560]'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth (Polished 3-Dropdown Calendar with Verified Age Badge) */}
          <div className="bg-white p-3.5 rounded-2xl border border-outline shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Date of Birth</span>
              </label>
              {/* Elegant Modern Age Badge without cake emoji */}
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{calculatedAge} years old</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Day */}
              <div className="relative">
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className="w-full bg-surface-variant border border-outline rounded-xl px-2.5 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary appearance-none pr-6"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>Day {d}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Month */}
              <div className="relative">
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className="w-full bg-surface-variant border border-outline rounded-xl px-2.5 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary appearance-none pr-6"
                >
                  {MONTHS.map(m => (
                    <option key={m.value} value={m.value}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Year */}
              <div className="relative">
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="w-full bg-surface-variant border border-outline rounded-xl px-2.5 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary appearance-none pr-6"
                >
                  {Array.from({ length: 50 }, (_, i) => 2007 - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Height (Dual-Unit System: Feet & Inches Picker + Centimeters Input with Live Conversion) */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-[#FF2560]" />
                <span>Height</span>
              </label>

              {/* Unit Toggle: Feet & Inches (ft/in) vs Centimeters (cm) */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setHeightUnit('ft')}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    heightUnit === 'ft'
                      ? 'bg-white text-[#FF2560] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ft / in
                </button>
                <button
                  type="button"
                  onClick={() => setHeightUnit('cm')}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    heightUnit === 'cm'
                      ? 'bg-white text-[#FF2560] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  cm
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {heightUnit === 'ft' ? (
                /* Dual Feet & Inches Dropdowns */
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="relative">
                    <select
                      value={currentFeet}
                      onChange={(e) => handleFeetChange(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#FF2560] appearance-none pr-6 cursor-pointer shadow-2xs"
                    >
                      {[4, 5, 6, 7].map(f => (
                        <option key={f} value={f}>{f} ft</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={currentInches}
                      onChange={(e) => handleInchesChange(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#FF2560] appearance-none pr-6 cursor-pointer shadow-2xs"
                    >
                      {Array.from({ length: 12 }, (_, i) => i).map(inc => (
                        <option key={inc} value={inc}>{inc} in</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              ) : (
                /* Centimeters Clean Numeric Input (No 0 Glitch) */
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={heightInputText}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setHeightInputText(cleaned);
                      if (cleaned) {
                        const val = parseInt(cleaned, 10);
                        if (val >= 100 && val <= 235) {
                          setHeightCm(val);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (!heightInputText || parseInt(heightInputText, 10) < 120 || parseInt(heightInputText, 10) > 235) {
                        setHeightInputText(String(heightCm));
                      }
                    }}
                    placeholder="e.g. 178"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#FF2560] pr-10 shadow-2xs"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                    cm
                  </span>
                </div>
              )}

              {/* Automatic Feet / Inches Live Badge */}
              <div className="px-3 py-1.5 bg-[#FFF0F3] text-[#FF2560] border border-[#FFD0DB] rounded-xl text-xs font-bold shrink-0 shadow-2xs min-w-[110px] text-center flex flex-col items-center justify-center">
                <span className="text-xs font-bold">{formatCmToFeet(heightCm)}</span>
                <span className="text-[10px] text-[#FF2560]/75 font-normal">({heightCm} cm)</span>
              </div>
            </div>

            {/* Quick Height Presets (Both Units) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
              {[
                { ft: "5'2\"", cm: 157 },
                { ft: "5'5\"", cm: 165 },
                { ft: "5'7\"", cm: 170 },
                { ft: "5'9\"", cm: 175 },
                { ft: "5'10\"", cm: 178 },
                { ft: "5'11\"", cm: 180 },
                { ft: "6'0\"", cm: 183 },
                { ft: "6'2\"", cm: 188 }
              ].map(preset => (
                <button
                  key={preset.cm}
                  type="button"
                  onClick={() => {
                    setHeightCm(preset.cm);
                    setHeightInputText(String(preset.cm));
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all shrink-0 cursor-pointer ${
                    heightCm === preset.cm
                      ? 'bg-[#FF2560] text-white border-[#FF2560] shadow-xs ring-1 ring-[#FF2560]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {preset.ft} <span className="text-[9px] font-normal opacity-80">({preset.cm}cm)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ethnicity / Cultural Heritage & Citizenship */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Heritage / Ethnicity</label>
              <div className="relative flex items-center bg-white border border-outline rounded-2xl p-1.5 shadow-subtle hover:border-primary transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <div className="w-7 h-7 rounded-xl bg-rose-50 text-primary border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <Globe2 className="w-3.5 h-3.5" />
                </div>
                <select
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                  className="w-full bg-transparent pl-2 pr-6 py-1 text-xs text-on-surface outline-none font-bold appearance-none cursor-pointer truncate"
                >
                  {['South Asian', 'Arab / Middle Eastern', 'Turkish', 'Caucasian / European', 'African', 'East Asian', 'Hispanic / Latino', 'Mixed / Other'].map(eth => (
                    <option key={eth} value={eth}>{eth}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Citizenship / Visa</label>
              <div className="relative flex items-center bg-white border border-outline rounded-2xl p-1.5 shadow-subtle hover:border-primary transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <select
                  value={citizenship}
                  onChange={(e) => setCitizenship(e.target.value)}
                  className="w-full bg-transparent pl-2 pr-6 py-1 text-xs text-on-surface outline-none font-bold appearance-none cursor-pointer truncate"
                >
                  {['Citizen', 'Permanent Resident / PR', 'Work Visa', 'Student Visa', 'Dual National', 'Prefer not to say'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Current City & Country (All 250 Worldwide Countries + Structured States & Cities + Custom Input) */}
          <div className="bg-white p-3.5 rounded-2xl border border-outline shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Current Location</span>
              </label>
              <span className="text-[11px] font-bold text-primary truncate max-w-[190px]">
                {finalLocationString}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Worldwide Country Picker */}
              <div>
                <span className="text-[10px] text-secondary font-bold uppercase block mb-1">
                  Country ({allCountries.length})
                </span>
                <div className="relative flex items-center bg-surface-variant border border-outline rounded-xl p-1 shadow-2xs hover:border-primary transition-all focus-within:border-primary focus-within:bg-white">
                  <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
                    <Globe2 className="w-3 h-3" />
                  </div>
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-transparent pl-1.5 pr-5 py-1 text-xs font-bold text-on-surface outline-none appearance-none truncate cursor-pointer"
                  >
                    {allCountries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.flag ? `${c.flag} ` : ''}{c.name} ({c.isoCode})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* State / Province Picker with Custom Option */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-secondary font-bold uppercase">State / Province</span>
                  {availableStates.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCustomState(!isCustomState)}
                      className="text-[9px] text-primary hover:underline font-bold"
                    >
                      {isCustomState ? 'List' : '+ Custom'}
                    </button>
                  )}
                </div>

                {isCustomState || availableStates.length === 0 ? (
                  <input
                    type="text"
                    value={customStateText}
                    onChange={(e) => setCustomStateText(e.target.value)}
                    placeholder="Enter state/region"
                    className="w-full bg-surface-variant border border-outline rounded-xl px-2.5 py-1.5 text-xs text-on-surface font-semibold outline-none focus:border-primary"
                  />
                ) : (
                  <div className="relative flex items-center bg-surface-variant border border-outline rounded-xl p-1 shadow-2xs hover:border-primary transition-all focus-within:border-primary focus-within:bg-white">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                      <Home className="w-3 h-3" />
                    </div>
                    <select
                      value={selectedStateCode}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full bg-transparent pl-1.5 pr-5 py-1 text-xs font-bold text-on-surface outline-none appearance-none truncate cursor-pointer"
                    >
                      {availableStates.map(st => (
                        <option key={st.isoCode} value={st.isoCode}>{st.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>

            {/* City Selection with Custom City Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-secondary font-bold uppercase">City</span>
                {availableCities.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCustomCity(!isCustomCity)}
                    className="text-[10px] text-primary hover:underline font-bold"
                  >
                    {isCustomCity ? '← Choose from list' : '+ Enter custom city'}
                  </button>
                )}
              </div>

              <div id="field-city">
                {isCustomCityActive ? (
                  <>
                    <input
                      type="text"
                      value={customCityText}
                      onChange={(e) => {
                        setCustomCityText(e.target.value);
                        setIsCustomCity(true);
                        if (errors.city) setErrors(prev => { const cp = { ...prev }; delete cp.city; return cp; });
                      }}
                      placeholder="e.g. London, Lahore, Dallas, or your town"
                      className={`w-full rounded-xl px-3 py-2 text-xs text-on-surface font-semibold outline-none transition-all border-2 ${
                        errors.city
                          ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-200'
                          : 'bg-surface-variant border-outline focus:border-primary'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </>
                ) : (
                <div className="relative flex items-center bg-surface-variant border border-outline rounded-xl p-1 shadow-2xs hover:border-primary transition-all focus-within:border-primary focus-within:bg-white">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <select
                    value={selectedCityName}
                    onChange={(e) => setSelectedCityName(e.target.value)}
                    className="w-full bg-transparent pl-1.5 pr-5 py-1 text-xs font-bold text-on-surface outline-none appearance-none truncate cursor-pointer"
                  >
                    {availableCities.map(ct => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
              </div>

              {/* GPS Auto-Detect Location Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  aria-label="Auto-detect accurate GPS location"
                  className="w-full py-2 px-3 rounded-xl bg-pastel-mint text-emerald-800 border border-pastel-mint-border hover:bg-pastel-mint/80 active:scale-98 transition-all flex items-center justify-center gap-1.5 text-xs font-bold shadow-2xs disabled:opacity-50"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                      <span>Detecting GPS Location...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{coords.latitude ? '📍 GPS Location Active (Tap to Update)' : '📍 Auto-Detect Exact Location (GPS)'}</span>
                    </>
                  )}
                </button>
                {locationStatus && (
                  <p className="text-[10px] text-secondary mt-1 text-center font-medium">
                    {locationStatus}
                  </p>
                )}
              </div>
            </div>
          </div>


          {/* International Relocation (Professional Colorful Icons) */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              International Relocation
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { 
                  id: 'willing', 
                  label: 'International', 
                  sub: 'Willing to move',
                  icon: Plane,
                  colorBg: 'bg-sky-50 text-sky-600 border-sky-200'
                },
                { 
                  id: 'open', 
                  label: 'Flexible', 
                  sub: 'Open to discuss',
                  icon: Globe2,
                  colorBg: 'bg-purple-50 text-purple-600 border-purple-200'
                },
                { 
                  id: 'not_willing', 
                  label: 'Local Only', 
                  sub: 'Stay in city',
                  icon: Home,
                  colorBg: 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }
              ].map(opt => {
                const IconComponent = opt.icon;
                const isSelected = willingnessToRelocate === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWillingnessToRelocate(opt.id as any)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                      isSelected
                        ? 'border-primary bg-pastel-rose text-primary shadow-subtle ring-1 ring-primary'
                        : 'border-outline bg-white text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${opt.colorBg} shadow-2xs`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-[11px] font-bold leading-tight">
                        {opt.label}
                      </strong>
                      <span className="text-[9px] text-secondary block leading-tight mt-0.5">
                        {opt.sub}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-5">
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-full bg-white text-[#FF2560] font-sans text-xs font-bold shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:bg-white/95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue to Deen & Practice</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
export default BasicInfoScreen;
