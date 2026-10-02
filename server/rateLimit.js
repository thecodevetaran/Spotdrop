/**
 * Lightweight in-memory sliding window rate limiter
 * Protects waitlist signup and admin login from spam & brute force.
 */

export function createRateLimiter({ windowMs = 10 * 60 * 1000, max = 15, message = 'Too many requests. Please wait a moment.' }) {
  const ipMap = new Map();

  // Periodic cleanup every 5 minutes to prevent memory leak
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of ipMap.entries()) {
      const valid = timestamps.filter((t) => now - t < windowMs);
      if (valid.length === 0) {
        ipMap.delete(ip);
      } else {
        ipMap.set(ip, valid);
      }
    }
  }, 5 * 60 * 1000).unref();

  return function rateLimiter(req, res, next) {
    // Determine client IP address (supporting reverse proxies)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) ||
      req.socket?.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    const timestamps = ipMap.get(ip) || [];

    // Filter to requests within current window
    const recent = timestamps.filter((t) => now - t < windowMs);

    if (recent.length >= max) {
      const oldest = recent[0];
      const retryAfterSec = Math.ceil((windowMs - (now - oldest)) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message,
        retryAfter: retryAfterSec,
      });
    }

    recent.push(now);
    ipMap.set(ip, recent);
    next();
  };
}
