
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Get user by wallet address (public)
router.get('/address/:address', userController.getUserByAddress);

// Get driver profile (public)
router.get('/driver/:id', userController.getDriverById);

// Update user profile (requires auth)
router.post('/profile', authMiddleware, userController.upsertUser);

module.exports = router;
