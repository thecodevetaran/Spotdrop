import { Router } from 'express';
import {
  findByEmail,
  findByReferralCode,
  createSignup,
  getStats,
  getSignups,
  updateStatus,
  updateNotes,
  getAllForExport,
} from './db.js';
import {
  verifyAdminPassword,
  createSessionToken,
  cookieOptions,
  COOKIE_NAME,
  requireAdminAuth,
} from './auth.js';
import { createRateLimiter } from './rateLimit.js';

const api = Router();

// Rate limiters
const waitlistLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 12,
  message: 'Too many signup attempts. Please wait a minute before trying again.',
});

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6,
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

/**
 * Basic email format validator
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 100) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email);
}

/* ===================================================================
   PUBLIC WAITLIST ENDPOINTS
   =================================================================== */

/**
 * POST /api/waitlist
 * Submit email to the Spotdrop waitlist
 */
api.post('/waitlist', waitlistLimiter, (req, res) => {
  try {
    const { email, source, referredBy, honeypot } = req.body || {};

    // Bot protection: silently succeed if honeypot was populated
    if (honeypot) {
      return res.status(200).json({
        status: 'success',
        message: "YOU'RE IN ✓",
        subtext: "Don't make plans.",
        referralCode: 'SPOT-VIP',
      });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide an email address.',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        error: 'Invalid format',
        message: 'Please enter a valid email address.',
      });
    }

    // Check for existing signup
    const existing = findByEmail(trimmedEmail);
    if (existing) {
      return res.status(200).json({
        status: 'duplicate',
        message: "you're already in 👀",
        subtext: "We saved your spot. You're good.",
        referralCode: existing.referral_code,
      });
    }

    // Verify referral if provided
    let validReferredBy = null;
    if (referredBy && typeof referredBy === 'string') {
      const cleanRef = referredBy.trim().toUpperCase();
      if (cleanRef.startsWith('SPOT-')) {
        // Can be linked to an existing code or registered code
        validReferredBy = cleanRef;
      }
    }

    // Create new waitlist signup
    const newSignup = createSignup({
      email: trimmedEmail,
      source: source || 'direct',
      referredBy: validReferredBy,
    });

    return res.status(201).json({
      status: 'success',
      message: "YOU'RE IN ✓",
      subtext: "Don't make plans.",
      referralCode: newSignup.referral_code,
    });
  } catch (err) {
    console.error('Waitlist submission error:', err);
    return res.status(500).json({
      error: 'Server error',
      message: 'something went wrong. Try again in a second.',
    });
  }
});

/* ===================================================================
   ADMIN AUTHENTICATION ENDPOINTS
   =================================================================== */

/**
 * POST /api/admin/login
 */
api.post('/admin/login', loginLimiter, (req, res) => {
  try {
    const { password } = req.body || {};

    if (!verifyAdminPassword(password)) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Incorrect admin password.',
      });
    }

    const token = createSessionToken();
    res.cookie(COOKIE_NAME, token, cookieOptions);

    return res.json({
      success: true,
      message: 'Authenticated successfully',
      token, // Also returned in body for clients preferring headers
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to authenticate.',
    });
  }
});

/**
 * POST /api/admin/logout
 */
api.post('/admin/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * GET /api/admin/me
 * Check session status
 */
api.get('/admin/me', requireAdminAuth, (req, res) => {
  return res.json({ authenticated: true });
});

/* ===================================================================
   PROTECTED ADMIN DASHBOARD ENDPOINTS
   =================================================================== */

/**
 * GET /api/admin/stats
 */
api.get('/admin/stats', requireAdminAuth, (req, res) => {
  try {
    const stats = getStats();
    return res.json(stats);
  } catch (err) {
    console.error('Fetch stats error:', err);
    return res.status(500).json({ error: 'Server error', message: 'Could not fetch stats' });
  }
});

/**
 * GET /api/admin/signups
 */
api.get('/admin/signups', requireAdminAuth, (req, res) => {
  try {
    const { search, source, status, sort, page, limit } = req.query;
    const result = getSignups({ search, source, status, sort, page, limit });
    return res.json(result);
  } catch (err) {
    console.error('Fetch signups error:', err);
    return res.status(500).json({ error: 'Server error', message: 'Could not fetch signups' });
  }
});

/**
 * PATCH /api/admin/signups/:id
 */
api.patch('/admin/signups/:id', requireAdminAuth, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, notes } = req.body || {};

    let updated = null;
    if (status) {
      updated = updateStatus(id, status);
    }
    if (typeof notes === 'string') {
      updated = updateNotes(id, notes);
    }

    if (!updated) {
      return res.status(404).json({ error: 'Not found', message: 'Signup not found.' });
    }

    return res.json({ success: true, signup: updated });
  } catch (err) {
    console.error('Update signup error:', err);
    return res.status(400).json({ error: 'Bad request', message: err.message });
  }
});

/**
 * GET /api/admin/export
 * Download CSV export of all signups
 */
api.get('/admin/export', requireAdminAuth, (req, res) => {
  try {
    const signups = getAllForExport();

    // RFC 4180 CSV generation
    const headers = ['Email', 'Joined (UTC)', 'Source', 'Referral Code', 'Referred By', 'Status', 'Notes'];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvLines = [headers.join(',')];

    for (const row of signups) {
      csvLines.push([
        escapeCsv(row.email),
        escapeCsv(row.created_at),
        escapeCsv(row.source),
        escapeCsv(row.referral_code),
        escapeCsv(row.referred_by || ''),
        escapeCsv(row.status),
        escapeCsv(row.notes || ''),
      ].join(','));
    }

    const csvContent = csvLines.join('\r\n');
    const dateStr = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="spotdrop-waitlist-${dateStr}.csv"`);
    return res.send(csvContent);
  } catch (err) {
    console.error('Export CSV error:', err);
    return res.status(500).json({ error: 'Export error', message: 'Could not export CSV' });
  }
});

export default api;
