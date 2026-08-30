import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyCzAYF56kTmTOl39guDhF9raYkR1MUxqso",
  authDomain: "marriage-app-1ca27.firebaseapp.com",
  projectId: "marriage-app-1ca27",
  storageBucket: "marriage-app-1ca27.firebasestorage.app",
  messagingSenderId: "865198689748",
  appId: "1:865198689748:web:ca15b3fe8900546b54da41",
  measurementId: "G-DB5QCW7F6W"
};

export const VAPID_KEY = "BGHcrtyFtJaBUbmCWaE7VMxekE2ucC8q_rnFlN7jAU7GuxEScNxK8B8LiqLTeu5KkwjLZqpjdcO_mpTU7Pbdt5c";

// Initialize Firebase singleton
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(firebaseApp);

/**
 * Format any user input into strict E.164 standard (+923001234567)
 */
export function formatE164Phone(countryCode: string, inputNumber: string): string {
  // 1. Remove all spaces, dashes, brackets, pluses
  let raw = inputNumber.replace(/[\s\-\(\)\+]/g, '');

  // 2. If user already typed the country code without plus (e.g. 923001234567)
  const ccDigits = countryCode.replace('+', '');
  if (raw.startsWith(ccDigits)) {
    raw = raw.substring(ccDigits.length);
  }

  // 3. Remove leading zeros (e.g. 03001234567 -> 3001234567)
  raw = raw.replace(/^0+/, '');

  return `${countryCode}${raw}`;
}

/**
 * Setup Invisible reCAPTCHA for Phone Authentication
 */
export const setupRecaptcha = (containerId: string = 'recaptcha-verifier-div') => {
  if (typeof window === 'undefined') return null;

  try {
    // Clear existing if any
    const existing = (window as any).recaptchaVerifier;
    if (existing) {
      try { existing.clear(); } catch {}
    }

    const verifier = new RecaptchaVerifier(firebaseAuth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired, please try again.');
      }
    });

    (window as any).recaptchaVerifier = verifier;
    return verifier;
  } catch (error) {
    console.error('reCAPTCHA initialization error:', error);
    return null;
  }
};

/**
 * Send SMS OTP using Firebase Phone Auth
 */
export const sendPhoneOtp = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(firebaseAuth, phoneNumber, appVerifier);
};
