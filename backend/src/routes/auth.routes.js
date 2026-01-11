const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const { authLimiter, tokenGenLimiter } = require('../middleware/rateLimit');
const { validate, registerValidation } = require('../middleware/validation');
const {
  register,
  login,
  logout,
  checkAuth
} = require('../controllers/auth.controller');

// Public routes
router.post('/register', tokenGenLimiter, register);
router.post('/login', authLimiter, login);
router.get('/check', optionalAuth, checkAuth);

// Protected routes
router.post('/logout', auth, logout);

module.exports = router;