class ComplaintController {
    constructor(complaintService) {
        this.complaintService = complaintService;
    }

    create = async (req, res) => {
        try {
            const { title, description, category, type, isAnonymous, image } = req.body;
            const user = req.user;

            const complaintData = {
                title,
                description,
                category,
                type,
                isAnonymous,
                imageUrl: image,
                collegeId: user.collegeId._id || user.collegeId,
                hostelId: user.hostelId || req.body.hostelId,
                studentId: user._id // Always store, masking happens in Service for admins
            };

            const complaint = await this.complaintService.createComplaint(complaintData);
            res.status(201).json(complaint);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    getStudentComplaints = async (req, res) => {
        try {
            const complaints = await this.complaintService.getStudentComplaints(req.user._id);
            res.json(complaints);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    getAdminComplaints = async (req, res) => {
        try {
            const user = req.user;
            const collegeId = user.collegeId._id || user.collegeId;
            const complaints = await this.complaintService.getAdminComplaints(collegeId, user.role);
            res.json(complaints);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    updateStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const { status, remark } = req.body;
            const updated = await this.complaintService.updateStatus(
                id,
                status,
                req.user._id,
                req.user.role,
                remark
            );
            res.json(updated);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
}

module.exports = ComplaintController;
