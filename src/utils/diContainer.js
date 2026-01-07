const UserRepository = require('../repositories/UserRepository');
const CollegeRepository = require('../repositories/CollegeRepository');
const ComplaintRepository = require('../repositories/ComplaintRepository');

const AuthService = require('../services/AuthService');
const ComplaintService = require('../services/ComplaintService');
const MailService = require('../services/MailService');

const AuthController = require('../controllers/AuthController');
const ComplaintController = require('../controllers/ComplaintController');

// 1. Instantiate Repositories
const userRepository = new UserRepository();
const collegeRepository = new CollegeRepository();
const complaintRepository = new ComplaintRepository();

// 2. Instantiate Services (Inject Repositories and other Services)
const mailService = new MailService();
const authService = new AuthService(userRepository, collegeRepository, mailService);
const complaintService = new ComplaintService(complaintRepository);

// 3. Instantiate Controllers (Inject Services)
const authController = new AuthController(authService);
const complaintController = new ComplaintController(complaintService);

module.exports = {
    authController,
    complaintController,
};
