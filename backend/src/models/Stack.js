const mongoose = require('mongoose');

const stackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100
  },
  
  note: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Default timer duration in seconds
  defaultDuration: {
    type: Number,
    default: 60, // 1 minute
    min: 5,
    max: 3600 // 1 hour
  },
  
  // Player preferences
  preferences: {
    vibrations: {
      type: Number,
      default: 1,
      min: 0,
      max: 5
    },
    sound: {
      type: String,
      enum: ['none', 'ding', 'bell', 'chime'],
      default: 'ding'
    }
  },
  
  items: [{
    order: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      trim: true,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  isArchived: {
    type: Boolean,
    default: false
  },
  
  lastPlayed: Date,
  
  playCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure items are sorted by order
stackSchema.index({ user: 1, createdAt: -1 });

const Stack = mongoose.model('Stack', stackSchema);

module.exports = Stack;