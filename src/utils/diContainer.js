const UserRepository = require('../repositories/UserRepository');
const CollegeRepository = require('../repositories/CollegeRepository');
const ComplaintRepository = require('../repositories/ComplaintRepository');
const InviteRepository = require('../repositories/InviteRepository');
const MessScheduleRepository = require('../repositories/MessScheduleRepository');
const FeedbackRepository = require('../repositories/FeedbackRepository');
const MealAttendanceRepository = require('../repositories/MealAttendanceRepository');

const AuthService = require('../services/AuthService');
const ComplaintService = require('../services/ComplaintService');
const MailService = require('../services/MailService');
const InviteService = require('../services/InviteService');
const MessScheduleService = require('../services/MessScheduleService');
const FeedbackService = require('../services/FeedbackService');
const MealAttendanceService = require('../services/MealAttendanceService');

const AuthController = require('../controllers/AuthController');
const ComplaintController = require('../controllers/ComplaintController');
const InviteController = require('../controllers/InviteController');
const MessScheduleController = require('../controllers/MessScheduleController');
const FeedbackController = require('../controllers/FeedbackController');
const MealAttendanceController = require('../controllers/MealAttendanceController');

// 1. Instantiate Repositories
const userRepository = new UserRepository();
const collegeRepository = new CollegeRepository();
const complaintRepository = new ComplaintRepository();
const inviteRepository = new InviteRepository();
const messScheduleRepository = new MessScheduleRepository();
const feedbackRepository = new FeedbackRepository();
const mealAttendanceRepository = new MealAttendanceRepository();

// 2. Instantiate Services
const mailService = new MailService();
const authService = new AuthService(userRepository, collegeRepository, mailService, inviteRepository);
const complaintService = new ComplaintService(complaintRepository, mailService);
const inviteService = new InviteService(inviteRepository, userRepository, mailService);
const messScheduleService = new MessScheduleService(messScheduleRepository, mailService, userRepository);
const feedbackService = new FeedbackService(feedbackRepository);
const mealAttendanceService = new MealAttendanceService(mealAttendanceRepository);

// 3. Instantiate Controllers
const authController = new AuthController(authService);
const complaintController = new ComplaintController(complaintService);
const inviteController = new InviteController(inviteService);
const messScheduleController = new MessScheduleController(messScheduleService);
const feedbackController = new FeedbackController(feedbackService);
const mealAttendanceController = new MealAttendanceController(mealAttendanceService);

const diContainer = {
    resolve: (name) => {
        const map = {
            authController,
            complaintController,
            inviteController,
            messScheduleController,
            feedbackController,
            mealAttendanceController
        };
        return map[name];
    }
};

module.exports = {
    diContainer,
    authController,
    complaintController,
    inviteController,
    messScheduleController,
    feedbackController,
    mealAttendanceController
};
