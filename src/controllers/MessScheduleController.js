class MessScheduleController {
    constructor(messScheduleService) {
        this.messScheduleService = messScheduleService;
    }

    upload = async (req, res) => {
        try {
            const { weekStartDate, menu } = req.body;
            const collegeId = req.user.collegeId._id || req.user.collegeId;

            const schedule = await this.messScheduleService.uploadSchedule(
                collegeId,
                weekStartDate,
                menu,
                req.user._id
            );
            res.status(201).json(schedule);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    getLatest = async (req, res) => {
        try {
            const collegeId = req.user.collegeId._id || req.user.collegeId;
            const schedule = await this.messScheduleService.getLatestSchedule(collegeId);
            res.json(schedule);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = MessScheduleController;
