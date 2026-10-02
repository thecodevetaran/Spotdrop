import { getAttributionSource, getReferredByCode } from '../utils/referral';

/**
 * Fetch live count of spots claimed from the backend
 */
export async function getLiveWaitlistCount() {
  try {
    const res = await fetch('/api/waitlist/count');
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.count === 'number' ? data.count : null;
  } catch {
    return null;
  }
}

/**
 * Submit an email to the Spotdrop server-side waitlist API
 */
export async function submitToWaitlist(email, honeypot = '') {
  if (!email || typeof email !== 'string') {
    throw new Error('Please enter your email address.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const source = getAttributionSource();
  const referredBy = getReferredByCode();

  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: cleanEmail,
        source,
        referredBy,
        honeypot,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 429) {
      throw new Error(data.message || 'Too many attempts. Please wait a moment.');
    }

    if (!res.ok && res.status !== 200 && res.status !== 201) {
      const err = new Error(data.message || 'something went wrong.');
      err.subtext = data.subtext || 'Try again in a second.';
      throw err;
    }

    // Handles both 'success' and 'duplicate' responses cleanly
    return {
      status: data.status || 'success', // 'success' | 'duplicate'
      message: data.message || "YOU'RE IN ✓",
      subtext: data.subtext || "Don't make plans.",
      referralCode: data.referralCode || null,
      email: cleanEmail,
    };
  } catch (err) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('NetworkError') && !err.message.includes('Unexpected token')) {
      throw err;
    }
    const cleanErr = new Error('something went wrong.');
    cleanErr.subtext = 'Try again in a second.';
    throw cleanErr;
  }
}
