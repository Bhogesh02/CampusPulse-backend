const express = require('express');
const { feedbackController } = require('../utils/diContainer');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Student submits feedback
router.post('/', protect, authorize('student'), feedbackController.submit);

// Admin views daily feedback
router.get('/daily', protect, authorize('super_admin', 'mess_admin'), feedbackController.getDaily);

// Admin views analytics
router.get('/analytics', protect, authorize('super_admin', 'mess_admin'), feedbackController.getAnalytics);

module.exports = router;
