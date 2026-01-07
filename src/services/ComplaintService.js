class ComplaintService {
    constructor(complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    async createComplaint(complaintData) {
        // ---------------------------------------------------------
        // AI LOGIC PLACEHOLDER
        // In valid implementation: 
        // 1. Call Google Natural Language API for Sentiment
        // 2. Classify Severity based on keywords (e.g. "fire", "poison")
        // ---------------------------------------------------------

        // Simple mock logic for now
        const criticalKeywords = ['poison', 'fire', 'electric', 'leak', 'danger'];
        const isCritical = criticalKeywords.some(word =>
            complaintData.description.toLowerCase().includes(word) ||
            complaintData.title.toLowerCase().includes(word)
        );

        complaintData.severity = isCritical ? 'Critical' : 'Normal';

        // Default sentiment mock
        complaintData.sentiment = 'Neutral';

        return await this.complaintRepository.create(complaintData);
    }

    async getAllComplaints(filters = {}) {
        return await this.complaintRepository.findAll(filters);
    }

    async getComplaintsByType(type) {
        return await this.complaintRepository.findByType(type);
    }

    async updateComplaintStatus(id, status, remark) {
        const data = { status };
        if (remark) data.adminRemark = remark;
        if (status === 'Solved') data.solvedAt = new Date();

        return await this.complaintRepository.update(id, data);
    }
}

module.exports = ComplaintService;
