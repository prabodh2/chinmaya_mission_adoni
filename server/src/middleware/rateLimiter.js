// In-memory sliding window rate limiter middleware for production stability
const ipRequestMap = new Map();

// Cleanup expired IP entries every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestMap.entries()) {
    if (now > data.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

/**
 * Custom Rate Limiter Middleware
 * @param {Object} options - { windowMs, maxRequests, message }
 */
export const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
  const maxRequests = options.maxRequests || 100;       // Max requests per window
  const message = options.message || 'Too many requests from this IP, please try again later.';

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    let record = ipRequestMap.get(ip);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      ipRequestMap.set(ip, record);
      return next();
    }

    record.count += 1;
    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message,
        errorCode: 'RATE_LIMIT_EXCEEDED',
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
};

// Specialized limiters for production
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  maxRequests: 10,           // Max 10 login attempts per 15 min
  message: 'Too many login attempts. Please try again after 15 minutes.',
});

export const registrationLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,  // 5 mins
  maxRequests: 15,           // Max 15 registrations per IP per 5 min
  message: 'Registration rate limit reached. Please wait a few minutes before submitting again.',
});
