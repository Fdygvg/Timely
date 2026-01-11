const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validate, registerValidation, shortcutValidation } = require('../middleware/validation');
const {
  updateProfile,
  getStats,
  getShortcuts,
  addShortcut,
  deleteShortcut
} = require('../controllers/user.controller');

// All routes require authentication
router.use(auth);

// Profile routes
router.get('/profile/stats', getStats);
router.patch('/profile', validate(registerValidation), updateProfile);

// Shortcuts routes
router.get('/shortcuts', getShortcuts);
router.post('/shortcuts', validate(shortcutValidation), addShortcut);
router.delete('/shortcuts/:key', deleteShortcut);

module.exports = router;