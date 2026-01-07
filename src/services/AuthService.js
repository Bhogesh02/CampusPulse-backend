const crypto = require('crypto');
const generateToken = require('../utils/generateToken');

class AuthService {
    constructor(userRepository, collegeRepository, mailService, inviteRepository) {
        this.userRepository = userRepository;
        this.collegeRepository = collegeRepository;
        this.mailService = mailService;
        this.inviteRepository = inviteRepository;
    }

    // --- Helper to finalize auth response ---
    async _finalizeAuth(user) {
        const token = generateToken(user._id, user.role);

        let collegeName = '';
        if (user.collegeId) {
            const college = await this.collegeRepository.findById(user.collegeId);
            collegeName = college?.name || '';
        }

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            collegeId: user.collegeId,
            collegeName,
            token,
        };
    }

    // --- 1. Super Admin Registration ---
    async registerSuperAdmin(data) {
        const { collegeName, universityName, email, mobile, location, password } = data;

        // Check if college already exists? (Optional: unique college names)
        let college = await this.collegeRepository.findByName(collegeName);
        if (college) {
            throw new Error('College already registered');
        }

        // Create College
        college = await this.collegeRepository.create({
            name: collegeName,
            university: universityName,
            email,
            mobile,
            location,
        });

        // Create User (Super Admin)
        const user = await this.userRepository.create({
            name: `${collegeName} Admin`,
            email,
            password, // Pre-save hook will hash this
            role: 'super_admin',
            collegeId: college._id,
            mobile
        });

        await this.mailService.sendWelcomeEmail(email, user.name, 'Super Admin');

        return this._finalizeAuth(user);
    }

    // --- 2. Student Registration ---
    async registerStudent(data) {
        const { collegeName, email, mobile, studentId, firstName, lastName, password, token } = data;

        // Simple validation: College must exist
        const college = await this.collegeRepository.findByName(collegeName);
        if (!college) {
            throw new Error('College not found. Please ask your admin to register the college first.');
        }

        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) throw new Error('Student email already exists');

        const user = await this.userRepository.create({
            name: `${firstName} ${lastName}`,
            email,
            password,
            role: 'student',
            studentId,
            mobile,
            collegeId: college._id
        });

        if (token) {
            await this.inviteRepository.model.updateOne({ token }, { status: 'accepted' });
        }

        await this.mailService.sendWelcomeEmail(email, user.name, 'Student');

        return this._finalizeAuth(user);
    }

    // --- 3. Hostel Admin Registration ---
    async registerHostelAdmin(data) {
        const { firstName, lastName, email, mobile, staffId, password, collegeName, token } = data;

        // Simple validation: College must exist
        const college = await this.collegeRepository.findByName(collegeName);
        if (!college) {
            throw new Error('College not found. Please ask your admin to register the college first.');
        }

        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) throw new Error('Email already registered');

        const user = await this.userRepository.create({
            name: `${firstName} ${lastName}`,
            email,
            password,
            role: 'hostel_admin',
            staffId,
            mobile,
            collegeId: college._id
        });

        if (token) {
            await this.inviteRepository.model.updateOne({ token }, { status: 'accepted' });
        }

        await this.mailService.sendWelcomeEmail(email, user.name, 'Hostel Admin');

        return this._finalizeAuth(user);
    }

    // --- 4. Mess Admin Registration ---
    async registerMessAdmin(data) {
        const { firstName, lastName, email, mobile, staffId, password, collegeName, token } = data;

        // Simple validation: College must exist
        const college = await this.collegeRepository.findByName(collegeName);
        if (!college) {
            throw new Error('College not found. Please ask your admin to register the college first.');
        }

        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) throw new Error('Email already registered');

        const user = await this.userRepository.create({
            name: `${firstName} ${lastName}`,
            email,
            password,
            role: 'mess_admin',
            staffId,
            mobile,
            collegeId: college._id
        });

        if (token) {
            await this.inviteRepository.model.updateOne({ token }, { status: 'accepted' });
        }

        await this.mailService.sendWelcomeEmail(email, user.name, 'Mess Admin');

        return this._finalizeAuth(user);
    }

    // --- 5. Forgot Password ---
    async forgotPassword(email) {
        if (!email) throw new Error('Please provide an email address');

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('No user found with this email');
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and save to DB
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Expire in 5 minutes
        user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // Create Reset URL
        // Ensure FRONTEND_URL is set in .env without trailing slash
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        try {
            await this.mailService.sendPasswordResetEmail(user.email, user.name, resetUrl);
            return { message: 'Password reset email sent' };
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            throw new Error('Email could not be sent');
        }
    }

    // --- 6. Reset Password ---
    async resetPassword(token, newPassword) {
        // Hash token to verify
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await this.userRepository.model.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error('Invalid token or token has expired');
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save(); // Pre-save hook will hash the new password

        return this._finalizeAuth(user);
    }

    // --- Login (Unified with Role Verification) ---
    async loginUser(email, password, role) {
        const user = await this.userRepository.findByEmail(email);

        if (user && (await user.matchPassword(password))) {
            // STRICT ROLE CHECK
            const backendRoleMap = {
                'student': 'student',
                'super-admin': 'super_admin',
                'hostel-admin': 'hostel_admin',
                'mess-admin': 'mess_admin'
            };

            const expectedRole = backendRoleMap[role] || role;

            if (user.role !== expectedRole) {
                throw new Error(`Unauthorized: This account is not a ${role.replace('-', ' ')} account.`);
            }

            // Send Login Alert
            try {
                await this.mailService.sendLoginAlert(user.email, user.name);
            } catch (mailError) {
                console.error("Failed to send login alert:", mailError.message);
            }

            return this._finalizeAuth(user);
        } else {
            throw new Error('Invalid email or password');
        }
    }

    async getProfile(userId) {
        const user = await this.userRepository.model.findById(userId).populate('collegeId').select('-password');
        if (!user) throw new Error('User not found');
        return user;
    }
}

module.exports = AuthService;
