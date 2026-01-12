const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Hashed token (acts as password)
  hashedToken: {
    type: String,
    required: true
  },

  // First 16 chars of raw token for fast lookup (not sensitive)
  tokenPrefix: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  username: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 30
  },

  avatar: {
    type: String,
    default: 'avatar1' // avatar1, avatar2, etc.
  },

  streak: {
    current: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: null
    },
    longest: {
      type: Number,
      default: 0
    }
  },

  stats: {
    totalSessions: {
      type: Number,
      default: 0
    },
    totalTime: { // in seconds
      type: Number,
      default: 0
    },
    totalItems: {
      type: Number,
      default: 0
    }
  },

  shortcuts: [{
    key: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 3
    },
    text: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function () {
  // Only hash if it's a new user or token was modified
  if (this.isNew || this.isModified('hashedToken')) {
    try {
      const salt = await bcrypt.genSalt(10); // Reduced from 12 for speed
      this.hashedToken = await bcrypt.hash(this.hashedToken, salt);
    } catch (error) {
      throw error; // Let Mongoose handle the error
    }
  }
});


// Compare token
userSchema.methods.compareToken = async function (candidateToken) {
  return await bcrypt.compare(candidateToken, this.hashedToken);
};

// Update streak
userSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = this.streak.lastActive
    ? new Date(this.streak.lastActive).setHours(0, 0, 0, 0)
    : null;

  if (!lastActive || lastActive < today.getTime() - 86400000) {
    // Broken streak
    this.streak.current = 1;
  } else if (lastActive === today.getTime()) {
    // Already updated today
    return;
  } else {
    // Consecutive day
    this.streak.current += 1;
  }

  this.streak.lastActive = new Date();
  this.streak.longest = Math.max(this.streak.longest, this.streak.current);
};

const User = mongoose.model('User', userSchema);

module.exports = User;