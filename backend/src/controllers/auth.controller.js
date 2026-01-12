const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateSecureToken } = require('../utils/tokenGenerator');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Set auth cookie
// Set auth cookie
const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction, // Must be true for SameSite=None
    sameSite: isProduction ? 'none' : 'lax', // Allow cross-site in production
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Register user
const register = async (req, res) => {
  try {
    // Generate a secure token
    const rawToken = generateSecureToken(64); // 64 bytes = 128 hex chars

    // Create user with hashed token
    const user = new User({
      hashedToken: rawToken // Will be hashed by pre-save middleware
    });

    await user.save();

    // Generate JWT for immediate login
    const jwtToken = generateToken(user._id);
    setAuthCookie(res, jwtToken);

    // Return raw token ONCE for user to save
    res.status(201).json({
      message: 'Account created successfully!',
      token: rawToken, // Show this once - never store in DB
      userId: user._id,
      warning: 'Save this token securely! You will need it to log in.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Token conflict. Please try again.'
      });
    }
    res.status(500).json({
      error: 'Registration failed. Please try again.'
    });
  }
};

// Login with token
const login = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || token.length !== 128) {
      return res.status(400).json({
        error: 'Invalid token format. Token must be 128 characters.'
      });
    }

    // Find user by comparing hashed tokens
    const users = await User.find({});
    let user = null;

    // Need to check all users since token is hashed
    for (const u of users) {
      const isMatch = await u.compareToken(token);
      if (isMatch) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({
        error: 'Invalid token. Please check and try again.'
      });
    }

    // Update streak
    user.updateStreak();
    await user.save();

    // Generate JWT
    const jwtToken = generateToken(user._id);
    setAuthCookie(res, jwtToken);

    res.json({
      message: 'Login successful!',
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        streak: user.streak.current,
        hasProfile: !!user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed. Please try again.'
    });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

// Check auth status
const checkAuth = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      authenticated: false
    });
  }

  res.json({
    authenticated: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
      streak: req.user.streak.current,
      stats: req.user.stats
    }
  });
};

module.exports = {
  register,
  login,
  logout,
  checkAuth
};