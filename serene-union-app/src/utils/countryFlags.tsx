import React, { useState } from 'react';

export interface CountryInfo {
  code: string;
  name: string;
  emoji: string;
}

// Curated ISO country data for high-traffic diaspora & Muslim regions
const COUNTRY_MAP: Record<string, { name: string; emoji: string }> = {
  PK: { name: 'Pakistan', emoji: '🇵🇰' },
  GB: { name: 'United Kingdom', emoji: '🇬🇧' },
  US: { name: 'United States', emoji: '🇺🇸' },
  CA: { name: 'Canada', emoji: '🇨🇦' },
  AE: { name: 'United Arab Emirates', emoji: '🇦🇪' },
  SA: { name: 'Saudi Arabia', emoji: '🇸🇦' },
  QA: { name: 'Qatar', emoji: '🇶🇦' },
  KW: { name: 'Kuwait', emoji: '🇰🇼' },
  BH: { name: 'Bahrain', emoji: '🇧🇭' },
  OM: { name: 'Oman', emoji: '🇴🇲' },
  TR: { name: 'Turkey', emoji: '🇹🇷' },
  MY: { name: 'Malaysia', emoji: '🇲🇾' },
  ID: { name: 'Indonesia', emoji: '🇮🇩' },
  IN: { name: 'India', emoji: '🇮🇳' },
  BD: { name: 'Bangladesh', emoji: '🇧🇩' },
  AU: { name: 'Australia', emoji: '🇦🇺' },
  DE: { name: 'Germany', emoji: '🇩🇪' },
  FR: { name: 'France', emoji: '🇫🇷' },
  NL: { name: 'Netherlands', emoji: '🇳🇱' },
  IE: { name: 'Ireland', emoji: '🇮🇪' },
  NO: { name: 'Norway', emoji: '🇳🇴' },
  SE: { name: 'Sweden', emoji: '🇸🇪' },
  SG: { name: 'Singapore', emoji: '🇸🇬' },
  EG: { name: 'Egypt', emoji: '🇪🇬' },
  JO: { name: 'Jordan', emoji: '🇯🇴' },
  MA: { name: 'Morocco', emoji: '🇲🇦' },
  ZA: { name: 'South Africa', emoji: '🇿🇦' },
  NZ: { name: 'New Zealand', emoji: '🇳🇿' },
};

// Keyword matcher to resolve city/country/citizenship strings to ISO code
const KEYWORD_TO_ISO: Record<string, string> = {
  // Pakistan
  pakistan: 'PK',
  pakistani: 'PK',
  lahore: 'PK',
  karachi: 'PK',
  islamabad: 'PK',
  rawalpindi: 'PK',
  faisalabad: 'PK',
  multan: 'PK',
  peshawar: 'PK',
  quetta: 'PK',
  sialkot: 'PK',
  gujranwala: 'PK',

  // United Kingdom
  uk: 'GB',
  'united kingdom': 'GB',
  britain: 'GB',
  british: 'GB',
  england: 'GB',
  london: 'GB',
  birmingham: 'GB',
  manchester: 'GB',
  leeds: 'GB',
  bradford: 'GB',
  luton: 'GB',
  leicester: 'GB',
  glasgow: 'GB',
  edinburgh: 'GB',
  cardiff: 'GB',

  // United States
  us: 'US',
  usa: 'US',
  'united states': 'US',
  america: 'US',
  american: 'US',
  dallas: 'US',
  houston: 'US',
  austin: 'US',
  'new york': 'US',
  chicago: 'US',
  california: 'US',
  'los angeles': 'US',
  'san francisco': 'US',
  texas: 'US',
  florida: 'US',
  miami: 'US',
  virginia: 'US',
  michigan: 'US',
  detroit: 'US',
  edison: 'US',

  // Canada
  canada: 'CA',
  canadian: 'CA',
  toronto: 'CA',
  mississauga: 'CA',
  brampton: 'CA',
  vancouver: 'CA',
  calgary: 'CA',
  ottawa: 'CA',
  montreal: 'CA',
  edmonton: 'CA',

  // UAE
  uae: 'AE',
  'united arab emirates': 'AE',
  dubai: 'AE',
  'abu dhabi': 'AE',
  sharjah: 'AE',
  ajman: 'AE',

  // Saudi Arabia
  saudi: 'SA',
  'saudi arabia': 'SA',
  ksa: 'SA',
  riyadh: 'SA',
  jeddah: 'SA',
  makkah: 'SA',
  madinah: 'SA',
  dammam: 'SA',
  khobar: 'SA',

  // Other popular regions
  qatar: 'QA',
  doha: 'QA',
  kuwait: 'KW',
  bahrain: 'BH',
  oman: 'OM',
  muscat: 'OM',
  turkey: 'TR',
  türkiye: 'TR',
  istanbul: 'TR',
  ankara: 'TR',
  malaysia: 'MY',
  'kuala lumpur': 'MY',
  indonesia: 'ID',
  jakarta: 'ID',
  india: 'IN',
  indian: 'IN',
  mumbai: 'IN',
  delhi: 'IN',
  hyderabad: 'IN',
  bangalore: 'IN',
  bangladesh: 'BD',
  bangladeshi: 'BD',
  dhaka: 'BD',
  australia: 'AU',
  australian: 'AU',
  sydney: 'AU',
  melbourne: 'AU',
  germany: 'DE',
  berlin: 'DE',
  frankfurt: 'DE',
  france: 'FR',
  paris: 'FR',
  netherlands: 'NL',
  amsterdam: 'NL',
  ireland: 'IE',
  dublin: 'IE',
  norway: 'NO',
  oslo: 'NO',
  sweden: 'SE',
  stockholm: 'SE',
  singapore: 'SG',
};

/**
 * Resolves a location, country, or citizenship string into CountryInfo (ISO code, name, emoji).
 */
export function extractCountryInfo(
  location?: string,
  country?: string,
  citizenship?: string
): CountryInfo {
  const combined = `${country || ''} ${location || ''} ${citizenship || ''}`.toLowerCase();

  // 1. Direct check against keyword mappings
  for (const [kw, code] of Object.entries(KEYWORD_TO_ISO)) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(combined)) {
      const info = COUNTRY_MAP[code];
      if (info) {
        return { code, name: info.name, emoji: info.emoji };
      }
    }
  }

  // Fallback if country is specified in uppercase 2-letter code
  const upperCode = (country || '').toUpperCase().trim();
  if (COUNTRY_MAP[upperCode]) {
    return { code: upperCode, name: COUNTRY_MAP[upperCode].name, emoji: COUNTRY_MAP[upperCode].emoji };
  }

  // Default international fallback
  return { code: 'INT', name: 'Global', emoji: '🌐' };
}

// Inline standalone SVG for Pakistan flag (100% offline & instant on all OS)
const PakistanFlagSvg: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg 
    viewBox="0 0 60 40" 
    className={`${className} rounded-[2px] shadow-xs shrink-0 overflow-hidden border border-white/20 inline-block align-middle`}
    aria-hidden="true"
  >
    <rect width="60" height="40" fill="#01411C" />
    <rect width="15" height="40" fill="#ffffff" />
    <circle cx="39" cy="20" r="10.5" fill="#ffffff" />
    <circle cx="42" cy="18" r="9" fill="#01411C" />
    <polygon points="41,12 42.2,15.5 45.8,15.5 43,17.8 44,21.5 41,19.2 38,21.5 39,17.8 36.2,15.5 39.8,15.5" fill="#ffffff" />
  </svg>
);

// Inline standalone SVG for UAE flag
const UaeFlagSvg: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg 
    viewBox="0 0 60 30" 
    className={`${className} rounded-[2px] shadow-xs shrink-0 overflow-hidden border border-white/20 inline-block align-middle`}
    aria-hidden="true"
  >
    <rect width="60" height="10" fill="#00732f" />
    <rect y="10" width="60" height="10" fill="#ffffff" />
    <rect y="20" width="60" height="10" fill="#000000" />
    <rect width="15" height="30" fill="#ff0000" />
  </svg>
);

interface CountryFlagProps {
  location?: string;
  country?: string;
  citizenship?: string;
  className?: string;
  flagClassName?: string;
  showName?: boolean;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  location,
  country,
  citizenship,
  className = '',
  flagClassName = 'w-5 h-3.5',
  showName = false
}) => {
  const info = extractCountryInfo(location, country, citizenship);
  const [imgError, setImgError] = useState(false);

  return (
    <span
      className={`inline-flex items-center gap-1.5 align-middle select-none font-sans ${className}`}
      title={info.name}
      aria-label={`Country: ${info.name}`}
    >
      {/* 1. Offline SVG flags for PK & AE */}
      {info.code === 'PK' ? (
        <PakistanFlagSvg className={flagClassName} />
      ) : info.code === 'AE' ? (
        <UaeFlagSvg className={flagClassName} />
      ) : info.code !== 'INT' && !imgError ? (
        <img
          src={`https://flagcdn.com/w40/${info.code.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w80/${info.code.toLowerCase()}.png 2x`}
          alt={info.name}
          onError={() => setImgError(true)}
          className={`${flagClassName} object-cover rounded-[2px] shadow-xs border border-white/20 inline-block align-middle shrink-0`}
          loading="lazy"
        />
      ) : (
        <span className="text-base leading-none filter drop-shadow-xs" role="img" aria-label={info.name}>
          {info.emoji}
        </span>
      )}

      {showName && (
        <span className="text-xs font-semibold text-on-surface truncate">
          {info.name}
        </span>
      )}
    </span>
  );
};
