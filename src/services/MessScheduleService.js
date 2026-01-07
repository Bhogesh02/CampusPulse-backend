class MessScheduleService {
    constructor(messScheduleRepository, mailService, userRepository) {
        this.messScheduleRepository = messScheduleRepository;
        this.mailService = mailService;
        this.userRepository = userRepository;
    }

    async uploadSchedule(collegeId, weekStartDate, menu, uploadedBy) {
        // Check if schedule for this week already exists
        let schedule = await this.messScheduleRepository.findByWeek(collegeId, weekStartDate);

        if (schedule) {
            schedule.menu = menu;
            schedule.uploadedBy = uploadedBy;
            await schedule.save();
        } else {
            schedule = await this.messScheduleRepository.create({
                collegeId,
                weekStartDate,
                menu,
                uploadedBy
            });
        }

        // Notify all students in this college
        this.notifyStudents(collegeId, weekStartDate);

        return schedule;
    }

    async getLatestSchedule(collegeId) {
        return await this.messScheduleRepository.findLatestByCollege(collegeId);
    }

    async notifyStudents(collegeId, weekStartDate) {
        try {
            const students = await this.userRepository.model.find({ collegeId, role: 'student' });
            const emails = students.map(s => s.email);

            if (emails.length > 0) {
                // In a real app, use a queue or BCC for bulk emails
                await this.mailService.sendScheduleNotification(
                    emails[0], // Demo: send to first student
                    "Your College",
                    weekStartDate
                );
            }
        } catch (err) {
            console.error('Failed to notify students about schedule:', err.message);
        }
    }
}

module.exports = MessScheduleService;
