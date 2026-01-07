const generateToken = require('../utils/generateToken');

class AuthService {
    constructor(userRepository, collegeRepository, mailService) {
        this.userRepository = userRepository;
        this.collegeRepository = collegeRepository;
        this.mailService = mailService;
    }

    // --- Helper to finalize auth response ---
    async _finalizeAuth(user) {
        const token = generateToken(user._id, user.role);
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
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
        const { collegeName, email, mobile, studentId, firstName, lastName, password } = data;

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

        await this.mailService.sendWelcomeEmail(email, user.name, 'Student');

        return this._finalizeAuth(user);
    }

    // --- 3. Hostel Admin Registration ---
    async registerHostelAdmin(data) {
        const { firstName, lastName, email, mobile, staffId, password } = data;

        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) throw new Error('Email already registered');

        const user = await this.userRepository.create({
            name: `${firstName} ${lastName}`,
            email,
            password,
            role: 'hostel_admin',
            staffId,
            mobile
        });

        await this.mailService.sendWelcomeEmail(email, user.name, 'Hostel Admin');

        return this._finalizeAuth(user);
    }

    // --- 4. Mess Admin Registration ---
    async registerMessAdmin(data) {
        const { firstName, lastName, email, mobile, staffId, password } = data;

        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) throw new Error('Email already registered');

        const user = await this.userRepository.create({
            name: `${firstName} ${lastName}`,
            email,
            password,
            role: 'mess_admin',
            staffId,
            mobile
        });

        await this.mailService.sendWelcomeEmail(email, user.name, 'Mess Admin');

        return this._finalizeAuth(user);
    }

    // --- Login (Unified with Role Verification) ---
    async loginUser(email, password, role) {
        const user = await this.userRepository.findByEmail(email);

        if (user && (await user.matchPassword(password))) {
            // STRICT ROLE CHECK: Ensure user is logging into the dashboard meant for their role
            // Map frontend URL roles to backend DB roles if they differ
            const backendRoleMap = {
                'student': 'student',
                'super-admin': 'super_admin',
                'hostel-admin': 'hostel_admin',
                'mess-admin': 'mess_admin'
            };

            const expectedRole = backendRoleMap[role] || role;

            if (user.role !== expectedRole) {
                // If checking for 'admin' generic access or specific
                throw new Error(`Unauthorized: This account is not a ${role.replace('-', ' ')} account.`);
            }

            return this._finalizeAuth(user);
        } else {
            throw new Error('Invalid email or password');
        }
    }
}

module.exports = AuthService;
