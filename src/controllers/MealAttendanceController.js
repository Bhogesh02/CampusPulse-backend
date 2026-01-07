class MealAttendanceController {
    constructor(mealAttendanceService) {
        this.mealAttendanceService = mealAttendanceService;
    }

    submitChoice = async (req, res) => {
        try {
            const { date, mealType, preference } = req.body;
            const collegeId = req.user.collegeId._id || req.user.collegeId;
            const result = await this.mealAttendanceService.submitChoice(
                req.user.id,
                collegeId,
                { date, mealType, preference }
            );
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    getTodayStats = async (req, res) => {
        try {
            const collegeId = req.user.collegeId._id || req.user.collegeId;
            const stats = await this.mealAttendanceService.getTodayStats(collegeId);
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    getMyChoices = async (req, res) => {
        try {
            const choices = await this.mealAttendanceService.getMyChoices(req.user.id);
            res.status(200).json(choices);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = MealAttendanceController;
