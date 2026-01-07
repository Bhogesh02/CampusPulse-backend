class InviteController {
    constructor(inviteService) {
        this.inviteService = inviteService;
    }

    createInvite = async (req, res) => {
        try {
            const { email, role, collegeName } = req.body;

            // Validate inputs
            if (!email || !role || !collegeName) {
                return res.status(400).json({ message: 'Email, Role, and College Name are required' });
            }

            const invite = await this.inviteService.createInvite({
                email,
                role: role.replace('-', '_'), // Logic uses underscores (hostel_admin)
                collegeName
            }, req.user.id);

            res.status(201).json({
                success: true,
                message: 'Invitation sent successfully',
                data: {
                    email: invite.email,
                    role: invite.role
                }
            });
        } catch (error) {
            console.error('Create Invite Error:', error.message);
            res.status(400).json({ message: error.message });
        }
    };

    verifyInvite = async (req, res) => {
        try {
            const { token } = req.query;
            if (!token) {
                return res.status(400).json({ message: 'Token is missing' });
            }

            const invite = await this.inviteService.verifyInvite(token);

            res.status(200).json({
                success: true,
                email: invite.email,
                role: invite.role,
                collegeName: invite.collegeName
            });
        } catch (error) {
            console.error('Verify Invite Error:', error.message);
            res.status(400).json({ message: error.message });
        }
    };

    getInvites = async (req, res) => {
        try {
            const { role } = req.query;

            // req.user is populated with collegeId in authMiddleware
            const targetCollege = req.user.collegeId?.name || req.user.collegeName;

            if (!role) {
                return res.status(400).json({ message: 'Role is required' });
            }

            if (!targetCollege) {
                return res.status(400).json({ message: 'College information not found' });
            }

            const invites = await this.inviteService.getInvites(role.replace('-', '_'), targetCollege);
            res.status(200).json({ success: true, invites });
        } catch (error) {
            console.error('Get Invites Error:', error.message);
            res.status(400).json({ message: error.message });
        }
    };
}

module.exports = InviteController;
