const BaseRepository = require('./BaseRepository');
const Complaint = require('../models/Complaint');

class ComplaintRepository extends BaseRepository {
    constructor() {
        super(Complaint);
    }

    // Custom queries can go here, e.g., finding by hostal, category
    async findByStudentId(studentId) {
        return await this.model.find({ studentId });
    }

    async findByType(type) {
        return await this.model.find({ type });
    }
}

module.exports = ComplaintRepository;
