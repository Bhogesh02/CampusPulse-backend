class ComplaintService {
    constructor(complaintRepository, mailService) {
        this.complaintRepository = complaintRepository;
        this.mailService = mailService;
    }

    async createComplaint(complaintData) {
        // Keyword-based severity detection
        const criticalKeywords = ['poison', 'fire', 'electric', 'leak', 'danger', 'emergency'];
        const isCritical = criticalKeywords.some(word =>
            complaintData.description.toLowerCase().includes(word) ||
            complaintData.title.toLowerCase().includes(word)
        );

        complaintData.severity = isCritical ? 'Critical' : 'Normal';
        complaintData.status = 'Pending';

        const complaint = await this.complaintRepository.create(complaintData);

        // Notify respective admin if not anonymous (or even if anonymous, notify admin of new complaint)
        // For hackathon, we can skip complex routing and just save it.

        return complaint;
    }

    async getStudentComplaints(studentId) {
        return await this.complaintRepository.findByStudentId(studentId);
    }

    async getAdminComplaints(collegeId, role) {
        let results;
        if (role === 'super_admin') {
            results = await this.complaintRepository.findByCollege(collegeId);
        } else {
            const type = role === 'mess_admin' ? 'Mess' : 'Hostel';
            results = await this.complaintRepository.findByAdminType(collegeId, type);
        }

        // Handle anonymity logic
        return results.map(complaint => {
            const doc = complaint.toObject();
            if (doc.isAnonymous) {
                // Remove identifying info from studentId object
                doc.studentId = {
                    name: 'Anonymous',
                    email: 'hidden@identity.com',
                    roomNumber: 'N/A'
                };
            } else if (!doc.studentId) {
                doc.studentId = { name: 'Unknown' };
            }
            return doc;
        });
    }

    async updateStatus(complaintId, status, updatedBy, userRole, remark) {
        const complaint = await this.complaintRepository.findById(complaintId);
        if (!complaint) throw new Error('Complaint not found');

        // Logic check: only hostel_admin can solve hostel complaints, etc.
        // Super admin can solve anything.
        if (userRole !== 'super_admin') {
            const expectedType = userRole === 'mess_admin' ? 'Mess' : 'Hostel';
            if (complaint.type !== expectedType) {
                throw new Error('Unauthorized to update this complaint type');
            }
        }

        const updated = await this.complaintRepository.updateStatus(complaintId, status, updatedBy, remark);

        // Send email notification to student if not anonymous
        if (updated.studentId && !updated.isAnonymous) {
            try {
                // Here we would populate student email
                const populated = await updated.populate('studentId', 'email name');
                await this.mailService.sendComplaintStatusUpdate(
                    populated.studentId.email,
                    updated.title,
                    status,
                    remark
                );
            } catch (err) {
                console.error('Failed to send status update email:', err.message);
            }
        }

        return updated;
    }
}

module.exports = ComplaintService;
