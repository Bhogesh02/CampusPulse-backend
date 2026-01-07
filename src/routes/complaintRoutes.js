const express = require('express');
const { complaintController } = require('../utils/diContainer');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Raise complaint
router.post('/', protect, authorize('student'), complaintController.create);

// Get student's own complaints
router.get('/student', protect, authorize('student'), complaintController.getStudentComplaints);

// Get admin's assigned complaints
router.get('/admin', protect, authorize('super_admin', 'hostel_admin', 'mess_admin'), complaintController.getAdminComplaints);

// Update status
router.put('/:id/status', protect, authorize('super_admin', 'hostel_admin', 'mess_admin'), complaintController.updateStatus);

module.exports = router;
