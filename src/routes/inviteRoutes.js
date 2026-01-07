const express = require('express');
const { inviteController } = require('../utils/diContainer');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Create Invite (Super Admin Only)
router.post('/create', protect, authorize('super_admin'), inviteController.createInvite);

// 2. Get Invites (Super Admin Only)
router.get('/', protect, authorize('super_admin'), inviteController.getInvites);

// 3. Verify Invite (Public - used by Register page)
router.get('/verify', inviteController.verifyInvite);

module.exports = router;
