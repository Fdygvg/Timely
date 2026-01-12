const Stack = require('../models/Stack');
const Session = require('../models/Session');
const User = require('../models/User');

// Get all stacks for user
const getStacks = async (req, res) => {
  try {
    const stacks = await Stack.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .select('name note defaultDuration preferences items playCount lastPlayed createdAt');

    res.json({ stacks });

  } catch (error) {
    console.error('Get stacks error:', error);
    res.status(500).json({ error: 'Failed to get stacks' });
  }
};

// Get single stack
const getStack = async (req, res) => {
  try {
    const { id } = req.params;

    const stack = await Stack.findOne({
      _id: id,
      user: req.userId
    });

    if (!stack) {
      return res.status(404).json({ error: 'Stack not found' });
    }

    // Sort items by order
    stack.items.sort((a, b) => a.order - b.order);

    res.json({ stack });

  } catch (error) {
    console.error('Get stack error:', error);
    res.status(500).json({ error: 'Failed to get stack' });
  }
};

// Create new stack
const createStack = async (req, res) => {
  try {
    const { name, note, defaultDuration, preferences, items } = req.body;

    const stack = new Stack({
      user: req.userId,
      name: name ? name.trim() : 'New Stack', // Use safe default if somehow bypassed
      note: note ? note.trim() : '',
      defaultDuration: defaultDuration || 60,
      preferences: preferences || { vibrations: 1, sound: 'ding' },
      items: Array.isArray(items)
        ? items.map((item, index) => ({
          order: index,
          text: item && item.text ? item.text.trim() : '' // Safe access
        }))
        : []
    });

    await stack.save();

    res.status(201).json({
      message: 'Stack created successfully',
      stack: {
        id: stack._id,
        name: stack.name,
        note: stack.note,
        items: stack.items
      }
    });

  } catch (error) {
    console.error('Create stack error details:', error);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ error: 'Failed to create stack', details: error.message });
  }
};

// Update stack
const updateStack = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow changing user ID
    if (updates.user) delete updates.user;

    // Sanitize items if present
    if (updates.items && Array.isArray(updates.items)) {
      updates.items = updates.items.map((item, index) => ({
        order: index,
        text: item && item.text ? item.text.trim() : ''
      }));
    }

    const stack = await Stack.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!stack) {
      return res.status(404).json({ error: 'Stack not found' });
    }

    res.json({
      message: 'Stack updated successfully',
      stack
    });

  } catch (error) {
    console.error('Update stack error details:', error);
    console.log('Update Request body:', JSON.stringify(req.body, null, 2));

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ error: 'Failed to update stack', details: error.message });
  }
};

// Delete stack
const deleteStack = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Stack.findOneAndDelete({
      _id: id,
      user: req.userId
    });

    if (!result) {
      return res.status(404).json({ error: 'Stack not found' });
    }

    // Also delete associated sessions
    await Session.deleteMany({ stack: id, user: req.userId });

    res.json({
      message: 'Stack deleted successfully'
    });

  } catch (error) {
    console.error('Delete stack error:', error);
    res.status(500).json({ error: 'Failed to delete stack' });
  }
};

// Update stack items order (swap positions)
const updateItemOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { item1Index, item2Index } = req.body;

    const stack = await Stack.findOne({
      _id: id,
      user: req.userId
    });

    if (!stack) {
      return res.status(404).json({ error: 'Stack not found' });
    }

    // Validate indices
    if (item1Index == null || item2Index == null ||
      item1Index < 0 || item2Index < 0 ||
      item1Index >= stack.items.length || item2Index >= stack.items.length) {
      return res.status(400).json({ error: 'Invalid item indices' });
    }

    // Additional safety check for undefined items
    const item1 = stack.items[item1Index];
    const item2 = stack.items[item2Index];

    if (!item1 || !item2) {
      return res.status(400).json({ error: 'One or both items not found' });
    }

    // Swap order values (ensure order property exists)
    const tempOrder = item1.order ?? item1Index;
    item1.order = item2.order ?? item2Index;
    item2.order = tempOrder;

    await stack.save();

    res.json({
      message: 'Items reordered successfully',
      items: stack.items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    });

  } catch (error) {
    console.error('Update item order error:', error);
    res.status(500).json({ error: 'Failed to reorder items' });
  }
};

// Save session after completion
const saveSession = async (req, res) => {
  try {
    const { stackId, completedItems, totalDuration, settings } = req.body;

    // Verify stack belongs to user
    const stack = await Stack.findOne({
      _id: stackId,
      user: req.userId
    });

    if (!stack) {
      return res.status(404).json({ error: 'Stack not found' });
    }

    // Update stack play count
    stack.playCount += 1;
    stack.lastPlayed = new Date();
    await stack.save();

    // Update user stats
    const user = await User.findById(req.userId);
    user.stats.totalSessions += 1;
    user.stats.totalTime += totalDuration;
    user.stats.totalItems += completedItems.length;
    user.updateStreak();
    await user.save();

    // Create session record
    const session = new Session({
      user: req.userId,
      stack: stackId,
      completedItems,
      totalDuration,
      settings,
      date: new Date()
    });

    await session.save();

    res.status(201).json({
      message: 'Session saved successfully',
      sessionId: session._id
    });

  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({ error: 'Failed to save session' });
  }
};

// Get session history
const getSessions = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;

    const sessions = await Session.find({ user: req.userId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('stack', 'name');

    const total = await Session.countDocuments({ user: req.userId });

    res.json({
      sessions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
};

module.exports = {
  getStacks,
  getStack,
  createStack,
  updateStack,
  deleteStack,
  updateItemOrder,
  saveSession,
  getSessions
};