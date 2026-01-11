const User = require('../models/User');

// Update profile (username & avatar)
const updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const userId = req.userId;
    
    const updates = {};
    if (username !== undefined) {
      updates.username = username.trim();
    }
    if (avatar !== undefined) {
      updates.avatar = avatar;
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-hashedToken');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get user stats
const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('streak stats username avatar');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      streak: user.streak,
      stats: user.stats,
      username: user.username,
      avatar: user.avatar
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

// Shortcuts management
const getShortcuts = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('shortcuts');
    
    res.json({ shortcuts: user?.shortcuts || [] });
    
  } catch (error) {
    console.error('Get shortcuts error:', error);
    res.status(500).json({ error: 'Failed to get shortcuts' });
  }
};

const addShortcut = async (req, res) => {
  try {
    const { key, text } = req.body;
    const userId = req.userId;
    
    // Check if shortcut key already exists
    const user = await User.findById(userId);
    const exists = user.shortcuts.some(s => s.key === key.toUpperCase());
    
    if (exists) {
      return res.status(409).json({ 
        error: `Shortcut '${key}' already exists` 
      });
    }
    
    user.shortcuts.push({
      key: key.toUpperCase(),
      text: text.trim()
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'Shortcut added successfully',
      shortcut: { key: key.toUpperCase(), text: text.trim() }
    });
    
  } catch (error) {
    console.error('Add shortcut error:', error);
    res.status(500).json({ error: 'Failed to add shortcut' });
  }
};

const deleteShortcut = async (req, res) => {
  try {
    const { key } = req.params;
    const userId = req.userId;
    
    const user = await User.findById(userId);
    const initialLength = user.shortcuts.length;
    
    user.shortcuts = user.shortcuts.filter(s => s.key !== key.toUpperCase());
    
    if (user.shortcuts.length === initialLength) {
      return res.status(404).json({ 
        error: `Shortcut '${key}' not found` 
      });
    }
    
    await user.save();
    
    res.json({ 
      message: 'Shortcut deleted successfully' 
    });
    
  } catch (error) {
    console.error('Delete shortcut error:', error);
    res.status(500).json({ error: 'Failed to delete shortcut' });
  }
};

module.exports = {
  updateProfile,
  getStats,
  getShortcuts,
  addShortcut,
  deleteShortcut
};