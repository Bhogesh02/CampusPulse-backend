const BaseRepository = require('./BaseRepository');
const MessSchedule = require('../models/MessSchedule');

class MessScheduleRepository extends BaseRepository {
    constructor() {
        super(MessSchedule);
    }

    async findLatestByCollege(collegeId) {
        return await this.model.findOne({ collegeId }).sort({ weekStartDate: -1 });
    }

    async findByWeek(collegeId, weekStartDate) {
        return await this.model.findOne({ collegeId, weekStartDate });
    }
}

module.exports = MessScheduleRepository;
