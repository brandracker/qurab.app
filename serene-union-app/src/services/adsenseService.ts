/**
 * Google AdSense Service for Qurb Web / Browser
 * Client/Publisher ID: ca-pub-5486823026870276
 */

export const ADSENSE_CONFIG = {
  publisherId: 'ca-pub-5486823026870276',
  scriptUrl: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5486823026870276'
} as const;

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const pushAdSense = (): void => {
  try {
    if (typeof window !== 'undefined') {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  } catch (err) {
    // Suppress ad-blocker or duplicate push warnings gracefully
    console.debug('AdSense push notice:', err);
  }
};
