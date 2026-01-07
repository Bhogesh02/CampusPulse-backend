const mongoose = require('mongoose');
const BaseRepository = require('./BaseRepository');
const Feedback = require('../models/Feedback');

class FeedbackRepository extends BaseRepository {
    constructor() {
        super(Feedback);
    }

    async findDailyFeedback(collegeId, date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        return await this.model.find({
            collegeId,
            date: { $gte: start, $lte: end }
        }).populate('studentId', 'name');
    }

    async getAverageRating(collegeId) {
        return await this.model.aggregate([
            { $match: { collegeId: new mongoose.Types.ObjectId(collegeId) } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
    }
}

module.exports = FeedbackRepository;
