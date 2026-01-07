const express = require('express');
const { authController } = require('../utils/diContainer');

const router = express.Router();

// Role-based Registration Routes
router.post('/register/super-admin', authController.registerSuperAdmin);
router.post('/register/student', authController.registerStudent);
router.post('/register/hostel-admin', authController.registerHostelAdmin);
router.post('/register/mess-admin', authController.registerMessAdmin);

// Common Login Route
router.post('/login', authController.login);

module.exports = router;
