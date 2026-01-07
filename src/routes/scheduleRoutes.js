const express = require('express');
const { messScheduleController } = require('../utils/diContainer');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Upload schedule (Hostel Warden, Mess Warden, or Super Admin)
router.post('/upload', protect, authorize('super_admin', 'hostel_admin', 'mess_admin'), messScheduleController.upload);

// Get latest schedule (Shared by all roles)
router.get('/latest', protect, messScheduleController.getLatest);

module.exports = router;
