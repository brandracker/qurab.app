/**
 * Clean UI String and Profile Formatters for Pakistani Matrimonial Display
 */

/**
 * Capitalizes a word respecting hyphens (e.g. "e-dil" -> "e-Dil" or "Al-Hassan")
 */
function titleCaseWord(word: string): string {
  if (!word) return '';
  if (word.includes('-')) {
    return word
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('-');
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Cleans and standardizes user display names:
 * - Eliminates database artifacts like "Nazm_ _e-Dil" -> "Nazm e-Dil"
 * - Converts ALL-CAPS names ("FARHAN ASIF") or all-lowercase ("waleed khan") to elegant Title Case
 * - Strips spurious checkmark symbols ("✓")
 */
export function formatDisplayName(rawName?: string | null, fallback = 'Candidate'): string {
  if (!rawName || typeof rawName !== 'string') return fallback;

  // 1. Strip spurious checkmarks, underscores, and normalize whitespace
  let clean = rawName
    .replace(/[✓✔]/g, '')
    .replace(/_+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean || clean.toLowerCase() === 'candidate' || clean.toLowerCase() === 'member') {
    return fallback;
  }

  // 2. Check if name is all-caps or all-lowercase
  const isAllUpper = clean === clean.toUpperCase() && /[A-Z]/.test(clean);
  const isAllLower = clean === clean.toLowerCase() && /[a-z]/.test(clean);

  if (isAllUpper || isAllLower) {
    clean = clean
      .split(' ')
      .map(w => titleCaseWord(w))
      .join(' ');
  } else {
    // If mixed case, ensure each space-separated word starts with uppercase if it was lowercase
    clean = clean
      .split(' ')
      .map(w => {
        // Special lower-case honorifics/prefixes common in Pakistani names (e.g. "e-Dil", "bin", "al")
        if (w.toLowerCase() === 'e-dil' || w.toLowerCase() === 'e') return w;
        if (/^[a-z]/.test(w)) return titleCaseWord(w);
        return w;
      })
      .join(' ');
  }

  return clean || fallback;
}

/**
 * Standardizes marriage timeline badges into clean, respectful matrimonial phrases
 */
export function formatTimeline(timeline?: string | null): string {
  if (!timeline || typeof timeline !== 'string') return '';
  const normalized = timeline.toLowerCase().trim().replace(/_+/g, ' ');

  if (normalized === 'right person' || normalized.includes('right person')) {
    return 'When Right Person Found';
  }
  if (normalized.includes('6 month') || normalized === 'within 6 months') {
    return 'Within 6 Months';
  }
  if (normalized.includes('1 year') || normalized === 'within 1 year') {
    return 'Within 1 Year';
  }
  if (normalized.includes('2 year') || normalized === 'within 2 years') {
    return 'Within 2 Years';
  }
  if (normalized === 'immediate' || normalized === 'asap' || normalized.includes('ready')) {
    return 'Ready to Marry';
  }

  // General fallback: title case words
  return normalized
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
