const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendMail(to, subject, text, html) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"Hostel Management System" <no-reply@hostel.com>',
                to,
                subject,
                text,
                html,
            });
            console.log('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            // Don't throw to avoid breaking the registration flow if mail fails
        }
    }

    async sendWelcomeEmail(to, name, role) {
        const subject = 'Welcome to Hostel Management System';
        const text = `Hello ${name}, Welcome to the platform as a ${role}.`;
        const html = `<h1>Welcome ${name}!</h1><p>You have successfully registered as a <b>${role}</b>.</p>`;
        return this.sendMail(to, subject, text, html);
    }
}

module.exports = MailService;
