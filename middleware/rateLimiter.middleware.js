import rateLimit from 'express-rate-limit';

// ─── Generic API limiter (all routes) ───────────────────────
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,                    // 100 requests per IP per window
  standardHeaders: true,       // Return rate limit info in headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes',
  },
});

// ─── Auth limiter (login + register) ────────────────────────
// Tighter — prevent brute force on login
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,                     // only 10 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes',
  },
  // Only count failed requests (status >= 400)
  skipSuccessfulRequests: true,
});

// ─── Public live endpoint limiter ───────────────────────────
// Students hit this frequently — allow more but still protect
export const publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,    // 1 minute window
  max: 60,                     // 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please slow down',
  },
});

// ─── Upload limiter ──────────────────────────────────────────
// Teachers shouldn't upload hundreds of files per hour
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 20,                     // 20 uploads per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Upload limit reached, please try again after 1 hour',
  },
});

// ─── Approval limiter ───────────────────────────────────────
export const approvalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 50,                     // 50 approvals per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many approval actions, please slow down',
  },
});