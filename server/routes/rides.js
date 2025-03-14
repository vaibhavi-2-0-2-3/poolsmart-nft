
const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const authMiddleware = require('../middleware/auth');

// Get all rides (public)
router.get('/', rideController.getRides);

// Get a specific ride (public)
router.get('/:id', rideController.getRide);

// Create a ride (requires auth)
router.post('/', authMiddleware, rideController.createRide);

// Book a ride (requires auth)
router.post('/:id/book', authMiddleware, rideController.bookRide);

module.exports = router;
