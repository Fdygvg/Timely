const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');


// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP. Please try again later.'
  },
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Only 20 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts. Please try again later.'
  },
  skipSuccessfulRequests: true // Don't count successful logins
});

// Token generation limiter (prevent token spam)
const tokenGenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 token generations per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many token generation requests. Please wait an hour.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  tokenGenLimiter
};