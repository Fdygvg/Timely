const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  stack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stack',
    required: true
  },
  
  completedItems: [{
    text: String,
    duration: Number // Time spent on this item in seconds
  }],
  
  totalDuration: {
    type: Number, // in seconds
    required: true
  },
  
  // Settings used in this session
  settings: {
    vibrations: Number,
    sound: String,
    duration: Number
  },
  
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for quick user session lookups
sessionSchema.index({ user: 1, date: -1 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;