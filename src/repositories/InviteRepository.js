const BaseRepository = require('./BaseRepository');
const Invite = require('../models/Invite');

class InviteRepository extends BaseRepository {
    constructor() {
        super(Invite);
    }

    async findByToken(token) {
        return await this.model.findOne({ token, status: 'pending' });
    }

    async findByEmailAndRole(email, role) {
        return await this.model.findOne({ email, role, status: 'pending' });
    }

    async getInvitesByRole(role, collegeName) {
        return await this.model.find({ role, collegeName }).sort({ createdAt: -1 });
    }
}

module.exports = InviteRepository;
