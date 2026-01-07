const express = require('express');
const { complaintController } = require('../utils/diContainer');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public / Anonymous (or at least no auth required for anonymous submit)
router.post('/anonymous', complaintController.create);

// Protected Routes
router.post('/', protect, complaintController.create);
router.get('/', protect, complaintController.getAll);
router.put('/:id/status', protect, authorize('super_admin', 'hostel_admin', 'mess_admin'), complaintController.updateStatus);

module.exports = router;
