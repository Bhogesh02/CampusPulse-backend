class MealAttendanceService {
    constructor(mealAttendanceRepository) {
        this.mealAttendanceRepository = mealAttendanceRepository;
    }

    async submitChoice(studentId, collegeId, { date, mealType, preference }) {
        // Normalize date to start of day
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        // Check if already exists
        const existing = await this.mealAttendanceRepository.findByStudentAndDate(studentId, normalizedDate, mealType);

        if (existing) {
            existing.preference = preference;
            return await existing.save();
        }

        return await this.mealAttendanceRepository.create({
            studentId,
            collegeId,
            date: normalizedDate,
            mealType,
            preference
        });
    }

    async getTodayStats(collegeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return await this.mealAttendanceRepository.getDailyStats(collegeId, today);
    }

    async getMyChoices(studentId) {
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        // Simplified: get choices for next 7 days or current week
        const endOfWeek = new Date();
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        endOfWeek.setHours(23, 59, 59, 999);

        return await this.mealAttendanceRepository.getStudentChoices(studentId, startOfWeek, endOfWeek);
    }
}

module.exports = MealAttendanceService;
