import { getAttributionSource, getReferredByCode } from '../utils/referral';

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
      throw new Error(data.message || 'something went wrong. Try again in a second.');
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
    // Return friendly error if network fails or threw
    if (err.message && !err.message.includes('fetch') && !err.message.includes('NetworkError')) {
      throw err;
    }
    throw new Error('something went wrong. Try again in a second.');
  }
}
