const crypto = require('crypto');

class InviteService {
    constructor(inviteRepository, userRepository, mailService) {
        this.inviteRepository = inviteRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    async createInvite(data, inviterId) {
        const { email, role, collegeName } = data;

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('A user with this email already exists');
        }

        // Check if there's an existing pending invite for this role
        const existingInvite = await this.inviteRepository.findByEmailAndRole(email, role);
        if (existingInvite) {
            // Check if expired
            if (existingInvite.expiresAt > Date.now()) {
                throw new Error('An active invitation has already been sent to this email for this role');
            } else {
                // Remove expired invite
                await this.inviteRepository.delete(existingInvite._id);
            }
        }

        // Generate secure token
        const token = crypto.randomBytes(32).toString('hex');

        // Expiry (48 hours)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);

        // Save invite
        const invite = await this.inviteRepository.create({
            email,
            role,
            collegeName,
            token,
            invitedBy: inviterId,
            expiresAt
        });

        // Send Email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        // Map backend role (underscore) back to frontend role (hyphen) for registration routes
        const frontendRoleMap = {
            'student': 'student',
            'hostel_admin': 'hostel-admin',
            'mess_admin': 'mess-admin',
            'warden': 'hostel-admin'
        };
        const frontendRole = frontendRoleMap[role] || role;
        const inviteUrl = `${frontendUrl}/register/${frontendRole}?token=${token}`;

        await this.mailService.sendInvitationEmail(email, collegeName, role, inviteUrl);

        return invite;
    }

    async verifyInvite(token) {
        const invite = await this.inviteRepository.findByToken(token);

        if (!invite) {
            throw new Error('Invalid or expired invitation token');
        }

        if (invite.expiresAt < Date.now()) {
            invite.status = 'expired';
            await invite.save();
            throw new Error('Invitation has expired');
        }

        return invite;
    }

    async getInvites(role, collegeName) {
        return await this.inviteRepository.getInvitesByRole(role, collegeName);
    }

    async markAsAccepted(token) {
        const invite = await this.inviteRepository.findByToken(token);
        if (invite) {
            invite.status = 'accepted';
            await invite.save();
        }
    }
}

module.exports = InviteService;
