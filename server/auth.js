import crypto from 'node:crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'spotdrop_admin_2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'spotdrop_default_secret_hyd_2026';
const COOKIE_NAME = 'spotdrop_admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Constant-time password verification to prevent timing attacks
 */
export function verifyAdminPassword(candidate) {
  if (!candidate || typeof candidate !== 'string') return false;

  const candidateBuf = Buffer.from(candidate);
  const targetBuf = Buffer.from(ADMIN_PASSWORD);

  if (candidateBuf.length !== targetBuf.length) {
    // Run dummy timing comparison to prevent length leakage
    crypto.timingSafeEqual(candidateBuf, candidateBuf);
    return false;
  }

  return crypto.timingSafeEqual(candidateBuf, targetBuf);
}

/**
 * Create a cryptographically signed session token
 */
export function createSessionToken() {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(timestamp)
    .digest('hex');

  return `${timestamp}.${signature}`;
}

/**
 * Verify a session token's cryptographic signature and freshness
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return false;

  // Check expiration
  if (Date.now() - timestamp > SESSION_DURATION_MS || timestamp > Date.now() + 60000) {
    return false;
  }

  // Compute expected signature
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(timestampStr)
    .digest('hex');

  const providedBuf = Buffer.from(providedSignature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (providedBuf.length !== expectedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuf, expectedBuf);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: SESSION_DURATION_MS,
  path: '/',
};

export { COOKIE_NAME };

/**
 * Express middleware to protect admin routes
 */
export function requireAdminAuth(req, res, next) {
  const cookieToken = req.cookies?.[COOKIE_NAME];
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  const token = cookieToken || headerToken;

  if (!token || !verifySessionToken(token)) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Admin access required.',
    });
  }

  next();
}
