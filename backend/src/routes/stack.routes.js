const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validate, stackValidation } = require('../middleware/validation');
const {
  getStacks,
  getStack,
  createStack,
  updateStack,
  deleteStack,
  updateItemOrder,
  saveSession,
  getSessions
} = require('../controllers/stack.controller');

// All routes require authentication
router.use(auth);

// Stack CRUD
router.get('/', getStacks);
router.get('/:id', getStack);
router.post('/', validate(stackValidation), createStack);
router.patch('/:id', validate(stackValidation), updateStack);
router.delete('/:id', deleteStack);

// Stack items
router.patch('/:id/items/order', updateItemOrder);

// Session management
router.post('/sessions', saveSession);
router.get('/sessions/history', getSessions);

module.exports = router;