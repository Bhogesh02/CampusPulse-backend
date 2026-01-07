const express = require('express');
const { authController } = require('../utils/diContainer');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Role-based Registration Routes
router.post('/register/super-admin', authController.registerSuperAdmin);
router.post('/register/student', authController.registerStudent);
router.post('/register/hostel-admin', authController.registerHostelAdmin);
router.post('/register/mess-admin', authController.registerMessAdmin);

// Common Login Route
router.post('/login', authController.login);

// Profile Route
router.get('/profile', protect, authController.getProfile);

// Password Reset Routes
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);

module.exports = router;
