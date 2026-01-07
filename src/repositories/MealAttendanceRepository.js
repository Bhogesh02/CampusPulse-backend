const BaseRepository = require('./BaseRepository');
const MealAttendance = require('../models/MealAttendance');
const mongoose = require('mongoose');

class MealAttendanceRepository extends BaseRepository {
    constructor() {
        super(MealAttendance);
    }

    async findByStudentAndDate(studentId, date, mealType) {
        return await this.model.findOne({ studentId, date, mealType });
    }

    async getDailyStats(collegeId, date) {
        return await this.model.aggregate([
            {
                $match: {
                    collegeId: new mongoose.Types.ObjectId(collegeId),
                    date: date
                }
            },
            {
                $group: {
                    _id: "$mealType",
                    veg: { $sum: { $cond: [{ $eq: ["$preference", "veg"] }, 1, 0] } },
                    nonVeg: { $sum: { $cond: [{ $eq: ["$preference", "non_veg"] }, 1, 0] } }
                }
            }
        ]);
    }

    async getStudentChoices(studentId, startDate, endDate) {
        return await this.model.find({
            studentId,
            date: { $gte: startDate, $lte: endDate }
        });
    }
}

module.exports = MealAttendanceRepository;
