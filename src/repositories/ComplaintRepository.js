const BaseRepository = require('./BaseRepository');
const Complaint = require('../models/Complaint');

class ComplaintRepository extends BaseRepository {
    constructor() {
        super(Complaint);
    }

    async findByStudentId(studentId) {
        return await this.model.find({ studentId }).sort({ createdAt: -1 });
    }

    async findByCollege(collegeId) {
        return await this.model.find({ collegeId })
            .populate('studentId', 'name email mobile')
            .sort({ createdAt: -1 });
    }

    async findByAdminType(collegeId, type) {
        // type: 'Hostel' or 'Mess'
        return await this.model.find({ collegeId, type })
            .populate('studentId', 'name email mobile')
            .sort({ createdAt: -1 });
    }

    async updateStatus(complaintId, status, updatedBy, remark) {
        return await this.model.findByIdAndUpdate(
            complaintId,
            {
                status,
                $push: { history: { status, updatedBy, remark } }
            },
            { new: true }
        );
    }
}

module.exports = ComplaintRepository;
