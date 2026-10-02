/**
 * Spotdrop Referral & Source Attribution Helper
 * Captures ?ref= from the URL on initial visit and preserves it in sessionStorage.
 * Never overwrites the original source within the same session.
 */

const STORAGE_KEY = 'spotdrop_initial_ref';

/**
 * Capture referral/source parameter from current URL
 * Call this on application startup.
 */
export function initReferralTracking() {
  if (typeof window === 'undefined') return;

  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return; // Do not overwrite existing session source

    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref') || urlParams.get('source') || urlParams.get('utm_source');

    if (refParam && refParam.trim()) {
      sessionStorage.setItem(STORAGE_KEY, refParam.trim());
    } else {
      sessionStorage.setItem(STORAGE_KEY, 'direct');
    }
  } catch (e) {
    // Graceful fallback if sessionStorage is blocked
  }
}

/**
 * Get the initial attribution source (e.g. 'instagram', 'story', 'direct')
 */
export function getAttributionSource() {
  if (typeof window === 'undefined') return 'direct';
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored || stored === 'direct') return 'direct';

    // If the ref was a user referral code like SPOT-A8K4X, categorize source as 'referral'
    if (stored.toUpperCase().startsWith('SPOT-')) {
      return 'referral';
    }

    return stored.toLowerCase().slice(0, 50);
  } catch (e) {
    return 'direct';
  }
}

/**
 * Get the referral code if the user arrived via a friend's referral link (e.g. SPOT-A8K4X)
 */
export function getReferredByCode() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored && stored.toUpperCase().startsWith('SPOT-')) {
      return stored.toUpperCase().slice(0, 30);
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Format a full referral share URL for a given referral code
 */
export function formatReferralUrl(referralCode) {
  if (!referralCode) return '';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://spotdrop.app';
  return `${origin}/?ref=${referralCode}`;
}
