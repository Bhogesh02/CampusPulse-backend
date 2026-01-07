const express = require('express');
const router = express.Router();
const { diContainer } = require('../utils/diContainer');
const authMiddleware = require('../middleware/authMiddleware');

const mealAttendanceController = diContainer.resolve('mealAttendanceController');

router.use(authMiddleware.protect);

router.post('/choose', mealAttendanceController.submitChoice);
router.get('/my-choices', mealAttendanceController.getMyChoices);
router.get('/stats/today', mealAttendanceController.getTodayStats);

module.exports = router;
