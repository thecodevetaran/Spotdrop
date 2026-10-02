/**
 * Waitlist submission service for Spotdrop.
 * Separates UI logic from backend delivery so integrating Supabase,
 * Resend, Airtable, or a custom API endpoint takes only 2 lines of configuration.
 */

export async function submitToWaitlist(email) {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const endpoint = import.meta.env.VITE_WAITLIST_API_URL;

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          city: 'Hyderabad',
          timestamp: new Date().toISOString(),
          source: window.location.href,
        }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      return await res.json();
    } catch (err) {
      console.warn('Backend endpoint unavailable, falling back to local storage:', err);
    }
  }

  // Fallback: Local simulation & persistence in localStorage for local testing
  await new Promise((resolve) => setTimeout(resolve, 600));

  try {
    const existing = JSON.parse(localStorage.getItem('spotdrop_waitlist') || '[]');
    if (!existing.includes(email)) {
      existing.push({ email, joinedAt: new Date().toISOString() });
      localStorage.setItem('spotdrop_waitlist', JSON.stringify(existing));
    }
  } catch (e) {
    // ignore local storage restrictions
  }

  return { success: true, email };
}
