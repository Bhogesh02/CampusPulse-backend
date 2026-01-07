class FeedbackService {
    constructor(feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    async submitFeedback(feedbackData) {
        return await this.feedbackRepository.create(feedbackData);
    }

    async getDailyFeedback(collegeId, date) {
        return await this.feedbackRepository.findDailyFeedback(collegeId, date);
    }

    async getAnalytics(collegeId) {
        const avg = await this.feedbackRepository.getAverageRating(collegeId);
        return {
            averageRating: avg.length > 0 ? avg[0].avgRating : 0
        };
    }
}

module.exports = FeedbackService;
