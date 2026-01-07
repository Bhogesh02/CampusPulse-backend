class ComplaintController {
    constructor(complaintService) {
        this.complaintService = complaintService;
    }

    create = async (req, res) => {
        try {
            const { title, description, category, type, isAnonymous, image } = req.body;

            const complaintData = {
                title,
                description,
                category,
                type,
                isAnonymous,
                imageUrl: image
            };

            // If not anonymous, attach student ID from the authenticated user
            // Note: middleware should attach user to req.user if logged in
            if (!isAnonymous && req.user) {
                complaintData.studentId = req.user.id;
                complaintData.hostelId = req.user.hostelId; // Assuming user has hostelId
            } else if (isAnonymous) {
                // Even anonymous might need a hostelId if passed from frontend context
                // But for strict anonymity we might not track it, or track it loosely
                if (req.body.hostelId) complaintData.hostelId = req.body.hostelId;
            }

            const complaint = await this.complaintService.createComplaint(complaintData);
            res.status(201).json(complaint);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    getAll = async (req, res) => {
        try {
            // Admin might want to filter
            const filters = {};

            // Role based filtering logic could arguably be in Service, but Controller prepares the request
            if (req.user.role === 'hostel_admin') {
                // This logic could be improved with more strict service methods, but keeping simple for now
                filters.type = 'Hostel';
            }
            if (req.user.role === 'mess_admin') {
                filters.type = 'Mess';
            }
            if (req.user.role === 'student') {
                filters.studentId = req.user.id;
            }

            const complaints = await this.complaintService.getAllComplaints(filters);
            res.json(complaints);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    updateStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const { status, remark } = req.body;
            const updated = await this.complaintService.updateComplaintStatus(id, status, remark);
            res.json(updated);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
}

module.exports = ComplaintController;
