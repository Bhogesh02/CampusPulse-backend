const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        // Debug config to help user troubleshoot
        const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
        const port = Number(process.env.EMAIL_PORT) || 587;
        const user = process.env.EMAIL_USER;
        console.log(`User=${user ? '***' : 'MISSING'}`);

        console.log(`📧 MailService Initializing: Host=${host}, Port=${port}, User=${user ? '***' : 'MISSING'}`);

        this.transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: port === 465, // true for 465, false for 587
            auth: {
                user: user,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false // Helps avoid some self-signed cert issues during dev
            }
        });

        // Verify connection immediately
        this.transporter.verify((error, success) => {
            if (error) {
                console.error("❌ Mail Server Connection Failed:", error.message);
            } else {
                console.log("✅ Mail Server Ready to send emails.");
            }
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
        const text = `Hello ${name}, \n\nWelcome to the platform! You have successfully registered as a ${role}.\n\nBest Regards,\nCampusPulse Team`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h1 style="color: #0f4c3a;">Welcome, ${name}!</h1>
                <p>You have successfully registered as a <b>${role}</b>.</p>
                <p>We are excited to have you on board.</p>
                <br>
                <p>Best Regards,<br><b>CampusPulse Team</b></p>
            </div>
        `;
        return this.sendMail(to, subject, text, html);
    }

    async sendLoginAlert(to, name) {
        const subject = 'New Login Detected - CampusPulse';
        const timestamp = new Date().toLocaleString();
        const text = `Hello ${name}, \n\nA new login was detected on your account at ${timestamp}.\nIf this wasn't you, please contact support immediately.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #eab308;">Login Alert</h2>
                <p>Hello ${name},</p>
                <p>A new login was detected on your account.</p>
                <p><b>Time:</b> ${timestamp}</p>
                <p style="color: #666; font-size: 0.9em;">If this wasn't you, please contact support immediately.</p>
            </div>
        `;
        return this.sendMail(to, subject, text, html);
    }

    async sendPasswordResetEmail(to, name, resetUrl) {
        const subject = 'Password Reset Request - CampusPulse';
        const text = `Hello ${name},\n\nYou requested a password reset. Please go to this link to reset your password: \n${resetUrl}\n\nThis link is valid for ONE-TIME use only and will expire in 5 MINUTES.\n\nIf you did not request this, please ignore this email.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #0f4c3a; text-align: center;">Reset Your Password</h2>
                <p>Hello ${name},</p>
                <p>We received a request to reset your password for your CampusPulse account.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #0f4c3a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="background-color: #f5f5f5; padding: 10px; word-break: break-all; font-size: 0.9em;">
                    <a href="${resetUrl}">${resetUrl}</a>
                </p>
                <div style="background-color: #fff3cd; color: #856404; padding: 10px; border-radius: 4px; margin-top: 20px; font-size: 0.9em; text-align: center;">
                    ⚠️ This link is valid for <b>ONE-TIME use only</b> and will expire in <b>5 MINUTES</b>.
                </div>
                <p style="color: #666; font-size: 0.9em; border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px;">
                    If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
            </div>
        `;
        return this.sendMail(to, subject, text, html);
    }
}

module.exports = MailService;
