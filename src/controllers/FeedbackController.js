class FeedbackController {
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }

    submit = async (req, res) => {
        try {
            const { mealType, rating, comment, menuSnapshot } = req.body;
            const user = req.user;

            const feedback = await this.feedbackService.submitFeedback({
                collegeId: user.collegeId._id || user.collegeId,
                studentId: user._id,
                mealType,
                rating,
                comment,
                menuSnapshot
            });
            res.status(201).json(feedback);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    getDaily = async (req, res) => {
        try {
            const { date } = req.query;
            const collegeId = req.user.collegeId._id || req.user.collegeId;
            const feedback = await this.feedbackService.getDailyFeedback(collegeId, date || new Date());
            res.json(feedback);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    getAnalytics = async (req, res) => {
        try {
            const collegeId = req.user.collegeId._id || req.user.collegeId;
            const analytics = await this.feedbackService.getAnalytics(collegeId);
            res.json(analytics);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = FeedbackController;
