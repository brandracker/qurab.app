import React, { useState, useMemo } from 'react';
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
  ChevronDown 
} from 'lucide-react';

interface Props {
  data?: {
    fullName?: string;
    dob?: string;
    gender?: string;
    location?: string;
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
    height: string;
    ethnicity: string;
    citizenship: string;
    willingnessToRelocate: 'willing' | 'not_willing' | 'open';
  }) => void;
}

// Location Data Structure
interface StateData {
  name: string;
  cities: string[];
}

interface CountryInfo {
  country: string;
  code: string;
  states: StateData[];
}

const GLOBAL_LOCATIONS: CountryInfo[] = [
  {
    country: 'United Kingdom',
    code: 'UK',
    states: [
      { name: 'Greater London', cities: ['London', 'Croydon', 'Ilford', 'Harrow', 'Brent'] },
      { name: 'West Midlands', cities: ['Birmingham', 'Coventry', 'Wolverhampton', 'Solihull'] },
      { name: 'Greater Manchester', cities: ['Manchester', 'Bolton', 'Oldham', 'Rochdale', 'Salford'] },
      { name: 'West Yorkshire', cities: ['Leeds', 'Bradford', 'Huddersfield', 'Wakefield'] },
      { name: 'Bedfordshire', cities: ['Luton', 'Bedford'] },
      { name: 'Leicestershire', cities: ['Leicester', 'Loughborough'] },
      { name: 'Scotland', cities: ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee'] },
      { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport'] },
      { name: 'Other Region', cities: ['Bristol', 'Sheffield', 'Newcastle', 'Nottingham', 'Southampton'] }
    ]
  },
  {
    country: 'Pakistan',
    code: 'PK',
    states: [
      { name: 'Punjab', cities: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Gujrat'] },
      { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpur Khas'] },
      { name: 'Islamabad Capital Territory', cities: ['Islamabad'] },
      { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Abbottabad', 'Mardan', 'Swat', 'Dera Ismail Khan'] },
      { name: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar'] },
      { name: 'Azad Kashmir', cities: ['Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot'] },
      { name: 'Gilgit-Baltistan', cities: ['Gilgit', 'Skardu', 'Hunza'] }
    ]
  },
  {
    country: 'United States',
    code: 'USA',
    states: [
      { name: 'Texas', cities: ['Dallas', 'Houston', 'Austin', 'Fort Worth', 'Plano', 'Irving'] },
      { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Jose', 'San Diego', 'Irvine', 'Fremont'] },
      { name: 'New York', cities: ['New York City', 'Brooklyn', 'Queens', 'Buffalo', 'Albany'] },
      { name: 'Illinois', cities: ['Chicago', 'Naperville', 'Schaumburg', 'Oak Brook'] },
      { name: 'New Jersey', cities: ['Jersey City', 'Edison', 'Paterson', 'Paramus', 'Princeton'] },
      { name: 'Virginia', cities: ['Alexandria', 'Fairfax', 'Richmond', 'Arlington', 'McLean'] },
      { name: 'Michigan', cities: ['Detroit', 'Dearborn', 'Canton', 'Troy', 'Ann Arbor'] },
      { name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Fort Lauderdale', 'Jacksonville'] },
      { name: 'Georgia', cities: ['Atlanta', 'Alpharetta', 'Duluth', 'Marietta'] },
      { name: 'Other State', cities: ['Seattle, WA', 'Boston, MA', 'Philadelphia, PA', 'Washington DC'] }
    ]
  },
  {
    country: 'Canada',
    code: 'CA',
    states: [
      { name: 'Ontario', cities: ['Toronto', 'Mississauga', 'Brampton', 'Ottawa', 'Oakville', 'Milton', 'Scarborough'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Surrey', 'Burnaby', 'Richmond'] },
      { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Fort McMurray'] },
      { name: 'Quebec', cities: ['Montreal', 'Laval', 'Quebec City'] }
    ]
  },
  {
    country: 'United Arab Emirates',
    code: 'UAE',
    states: [
      { name: 'Dubai', cities: ['Dubai'] },
      { name: 'Abu Dhabi', cities: ['Abu Dhabi', 'Al Ain'] },
      { name: 'Sharjah', cities: ['Sharjah'] },
      { name: 'Ajman', cities: ['Ajman'] }
    ]
  },
  {
    country: 'Saudi Arabia',
    code: 'KSA',
    states: [
      { name: 'Riyadh Province', cities: ['Riyadh', 'Al Kharj'] },
      { name: 'Makkah Province', cities: ['Jeddah', 'Makkah', 'Taif'] },
      { name: 'Eastern Province', cities: ['Dammam', 'Khobar', 'Dhahran', 'Jubail'] },
      { name: 'Al Madinah', cities: ['Madinah', 'Yanbu'] }
    ]
  },
  {
    country: 'Other Global Country',
    code: 'GLOBAL',
    states: [
      { name: 'Europe', cities: ['Paris, France', 'Berlin, Germany', 'Frankfurt, Germany', 'Amsterdam, Netherlands', 'Dublin, Ireland'] },
      { name: 'Middle East', cities: ['Doha, Qatar', 'Kuwait City, Kuwait', 'Muscat, Oman', 'Manama, Bahrain'] },
      { name: 'Asia & Pacific', cities: ['Sydney, Australia', 'Melbourne, Australia', 'Kuala Lumpur, Malaysia', 'Singapore', 'Istanbul, Turkey'] }
    ]
  }
];

export const BasicInfoScreen: React.FC<Props> = ({ data, onBack, onContinue }) => {
  const [fullName, setFullName] = useState(data?.fullName || '');
  const [gender, setGender] = useState(data?.gender || 'male');

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

  // --- Height System (Centimeters with live feet conversion) ---
  const parseInitialCm = (hStr?: string): number => {
    if (!hStr) return 178;
    const match = hStr.match(/(\d{3})\s*cm/i);
    if (match) return parseInt(match[1], 10);
    const numMatch = hStr.match(/(\d{2,3})/);
    if (numMatch) {
      const n = parseInt(numMatch[1], 10);
      if (n >= 130 && n <= 230) return n;
    }
    return 178;
  };

  const [heightCm, setHeightCm] = useState<number>(() => parseInitialCm(data?.height));

  const formatCmToFeet = (cm: number): string => {
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}"`;
  };

  const formattedHeightFull = `${formatCmToFeet(heightCm)} (${heightCm} cm)`;

  // --- Location System (Structured Country / State / City) ---
  const [selectedCountry, setSelectedCountry] = useState<string>('United Kingdom');
  const [selectedState, setSelectedState] = useState<string>('Greater London');
  const [selectedCity, setSelectedCity] = useState<string>('London');
  const [isCustomCity, setIsCustomCity] = useState<boolean>(false);
  const [customCityText, setCustomCityText] = useState<string>('');

  const currentCountryData = useMemo(() => {
    return GLOBAL_LOCATIONS.find(c => c.country === selectedCountry) || GLOBAL_LOCATIONS[0];
  }, [selectedCountry]);

  const currentStates = useMemo(() => {
    return currentCountryData.states;
  }, [currentCountryData]);

  const currentCities = useMemo(() => {
    const st = currentStates.find(s => s.name === selectedState);
    return st ? st.cities : currentStates[0]?.cities || [];
  }, [currentStates, selectedState]);

  const handleCountryChange = (cName: string) => {
    setSelectedCountry(cName);
    const cData = GLOBAL_LOCATIONS.find(c => c.country === cName) || GLOBAL_LOCATIONS[0];
    const firstState = cData.states[0]?.name || '';
    setSelectedState(firstState);
    const firstCity = cData.states[0]?.cities[0] || '';
    setSelectedCity(firstCity);
    setIsCustomCity(false);
  };

  const handleStateChange = (sName: string) => {
    setSelectedState(sName);
    const st = currentStates.find(s => s.name === sName);
    const firstCity = st?.cities[0] || '';
    setSelectedCity(firstCity);
    setIsCustomCity(false);
  };

  // Build final location string
  const finalLocationString = useMemo(() => {
    const city = isCustomCity ? customCityText.trim() || 'City' : selectedCity;
    if (selectedCountry === 'Other Global Country') {
      return city;
    }
    return `${city}, ${currentCountryData.code}`;
  }, [isCustomCity, customCityText, selectedCity, selectedCountry, currentCountryData.code]);

  // --- Ethnicity & Citizenship ---
  const [ethnicity, setEthnicity] = useState(data?.ethnicity || 'South Asian');
  const [citizenship, setCitizenship] = useState(data?.citizenship || 'Citizen');

  // --- Relocation Status ---
  const [willingnessToRelocate, setWillingnessToRelocate] = useState<'willing' | 'not_willing' | 'open'>(
    data?.willingnessToRelocate || 'open'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const dobFormatted = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
    
    onContinue({
      fullName: fullName.trim(),
      dob: dobFormatted,
      gender,
      location: finalLocationString,
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
    <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-background font-sans overflow-y-auto pb-24 select-none text-on-surface">
      <div>
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between mb-3 pt-1">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-outline flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Step 1 of 5</span>
            <span className="text-[11px] text-secondary">· Personal</span>
          </div>
          <div className="w-9" />
        </div>

        {/* 5-Step Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
          <div className="h-1.5 rounded-full bg-surface-variant" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-on-surface mb-1">
          Personal Background
        </h1>
        <p className="text-xs text-secondary mb-4 leading-relaxed">
          Provide your biodata accurately to help prospective matches understand your profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Fatima Tariq or Bilal Ahmad"
              className="w-full bg-white border border-outline rounded-2xl px-3.5 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle transition-all"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Gender</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'male', label: 'Brother (Male)' },
                { id: 'female', label: 'Sister (Female)' }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id)}
                  className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    gender === g.id
                      ? 'border-primary bg-pastel-rose text-primary shadow-subtle'
                      : 'border-outline bg-white text-secondary hover:bg-surface-variant'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth (Polished 3-Dropdown Calendar with Live Age Badge) */}
          <div className="bg-white p-3.5 rounded-2xl border border-outline shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Date of Birth</span>
              </label>
              <span className="px-2 py-0.5 rounded-full bg-pastel-mint text-pastel-mint-text border border-pastel-mint-border text-[10px] font-bold">
                🎂 {calculatedAge} years old
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

          {/* Height (Centimeter Input with Automatic Feet & Inches Conversion) */}
          <div className="bg-white p-3.5 rounded-2xl border border-outline shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-primary" />
                <span>Height</span>
              </label>
              <span className="text-[10px] text-secondary font-medium">Enter in cm or adjust</span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Centimeters Number Box */}
              <div className="relative flex-1">
                <input
                  type="number"
                  min={130}
                  max={225}
                  value={heightCm}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setHeightCm(val);
                  }}
                  className="w-full bg-surface-variant border border-outline rounded-xl px-3 py-2 text-xs font-bold text-on-surface outline-none focus:border-primary pr-9"
                  placeholder="178"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-secondary">
                  cm
                </span>
              </div>

              {/* Automatic Feet / Inches Live Badge */}
              <div className="px-3.5 py-2 bg-pastel-rose text-primary border border-pastel-rose-border rounded-xl text-xs font-bold shrink-0 shadow-2xs min-w-[110px] text-center flex items-center justify-center gap-1">
                <span>{formatCmToFeet(heightCm)}</span>
                <span className="text-[10px] text-primary/70 font-normal">({heightCm} cm)</span>
              </div>
            </div>

            {/* Quick Height Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
              {[155, 160, 165, 170, 175, 178, 183, 188].map(presetCm => (
                <button
                  key={presetCm}
                  type="button"
                  onClick={() => setHeightCm(presetCm)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all shrink-0 ${
                    heightCm === presetCm
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-variant text-secondary border-outline hover:bg-white'
                  }`}
                >
                  {presetCm} cm ({formatCmToFeet(presetCm)})
                </button>
              ))}
            </div>
          </div>

          {/* Ethnicity / Cultural Heritage & Citizenship */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Heritage / Ethnicity</label>
              <div className="relative">
                <select
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                  className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium appearance-none pr-8"
                >
                  {['South Asian', 'Arab / Middle Eastern', 'Turkish', 'Caucasian / European', 'African', 'East Asian', 'Hispanic / Latino', 'Mixed / Other'].map(eth => (
                    <option key={eth} value={eth}>{eth}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Citizenship / Visa</label>
              <div className="relative">
                <select
                  value={citizenship}
                  onChange={(e) => setCitizenship(e.target.value)}
                  className="w-full bg-white border border-outline rounded-2xl px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary shadow-subtle font-medium appearance-none pr-8"
                >
                  {['Citizen', 'Permanent Resident / PR', 'Work Visa', 'Student Visa', 'Dual National', 'Prefer not to say'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Current City & Country (Structured Country / State / City Dropdowns) */}
          <div className="bg-white p-3.5 rounded-2xl border border-outline shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Current Location</span>
              </label>
              <span className="text-[11px] font-bold text-primary truncate max-w-[170px]">
                {finalLocationString}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Country Picker */}
              <div>
                <span className="text-[10px] text-secondary font-bold uppercase block mb-1">Country</span>
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-surface-variant border border-outline rounded-xl px-2.5 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary appearance-none pr-7 truncate"
                  >
                    {GLOBAL_LOCATIONS.map(c => (
                      <option key={c.country} value={c.country}>{c.country}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* State / Province Picker */}
              <div>
                <span className="text-[10px] text-secondary font-bold uppercase block mb-1">State / Province</span>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-surface-variant border border-outline rounded-xl px-2.5 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary appearance-none pr-7 truncate"
                  >
                    {currentStates.map(st => (
                      <option key={st.name} value={st.name}>{st.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* City Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-secondary font-bold uppercase">City</span>
                <button
                  type="button"
                  onClick={() => setIsCustomCity(!isCustomCity)}
                  className="text-[10px] text-primary hover:underline font-bold"
                >
                  {isCustomCity ? '← Choose from list' : '+ Enter custom city'}
                </button>
              </div>

              {isCustomCity ? (
                <input
                  type="text"
                  value={customCityText}
                  onChange={(e) => setCustomCityText(e.target.value)}
                  placeholder="e.g. Oxford or Rawalpindi"
                  className="w-full bg-surface-variant border border-outline rounded-xl px-3 py-2 text-xs text-on-surface font-semibold outline-none focus:border-primary"
                />
              ) : (
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-surface-variant border border-outline rounded-xl px-2.5 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary appearance-none pr-7"
                  >
                    {currentCities.map(ct => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
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
        </form>
      </div>

      {/* Bottom Action */}
      <div className="pt-5">
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-full bg-primary text-white font-sans text-xs font-bold shadow-brand hover:bg-primary-dark active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Deen & Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default BasicInfoScreen;
