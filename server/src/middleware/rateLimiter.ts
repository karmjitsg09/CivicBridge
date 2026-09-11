import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter for Gemini Multimodal Analysis
 * Prevents rapid abuse / quota exhaustion while allowing natural hackathon demo usage.
 */
export const analyzeRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: Number(process.env.RATE_LIMIT_ANALYZE_MAX) || 25, // default 25 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Too many analysis requests. Please wait a moment before analyzing another issue.',
    });
  },
});

/**
 * Rate Limiter for Civic Reports CRUD
 * Protects persistence layer from flood requests.
 */
export const reportsRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: Number(process.env.RATE_LIMIT_REPORTS_MAX) || 60, // default 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Too many ledger requests. Please slow down and try again shortly.',
    });
  },
});
