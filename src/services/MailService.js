const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    // Detect environment
    this.isProduction = process.env.NODE_ENV === "production";

    // 🚫 Disable SMTP completely in production (Render blocks SMTP)
    if (this.isProduction) {
      console.log(
        "📧 MailService disabled in production (SMTP blocked on Render)"
      );
      return;
    }

    // Local / development SMTP config
    const host = process.env.EMAIL_HOST || "smtp.gmail.com";
    const port = Number(process.env.EMAIL_PORT) || 587;
    const user = process.env.EMAIL_USER;

    console.log(
      `📧 MailService Initializing: Host=${host}, Port=${port}, User=${
        user ? "***" : "MISSING"
      }`
    );

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587
      auth: {
        user,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * 🔒 NON-BLOCKING EMAIL SENDER
   * - Never await
   * - Never throws
   * - Never blocks API response
   */
  sendMail(to, subject, text, html) {
    if (this.isProduction) {
      console.log(`📧 [SKIPPED - PROD] ${subject} → ${to}`);
      return;
    }

    try {
      this.transporter
        .sendMail({
          from:
            process.env.EMAIL_FROM ||
            '"Hostel Management System" <no-reply@hostel.com>',
          to,
          subject,
          text,
          html,
        })
        .then((info) => {
          console.log("📨 Email sent:", info.messageId);
        })
        .catch((err) => {
          console.error("❌ Email send failed:", err.message);
        });
    } catch (err) {
      console.error("❌ Unexpected email error:", err.message);
    }
  }

  // -------------------------
  // EMAIL HELPERS (SAFE)
  // -------------------------

  sendWelcomeEmail(to, name, role) {
    const subject = "Welcome to Hostel Management System";
    const text = `Hello ${name},\n\nWelcome to the platform! You have successfully registered as a ${role}.`;
    const html = `
      <h2>Welcome, ${name}!</h2>
      <p>You have successfully registered as <b>${role}</b>.</p>
    `;
    this.sendMail(to, subject, text, html);
  }

  sendLoginAlert(to, name) {
    const subject = "New Login Detected - CampusPulse";
    const timestamp = new Date().toLocaleString();
    const text = `Hello ${name},\nA new login was detected at ${timestamp}.`;
    const html = `
      <h3>Login Alert</h3>
      <p>Hello ${name},</p>
      <p>New login detected at <b>${timestamp}</b>.</p>
    `;
    this.sendMail(to, subject, text, html);
  }

  sendPasswordResetEmail(to, name, resetUrl) {
    const subject = "Password Reset Request - CampusPulse";
    const text = `Hello ${name},\nReset your password using this link:\n${resetUrl}`;
    const html = `
      <h3>Reset Your Password</h3>
      <a href="${resetUrl}">Reset Password</a>
    `;
    this.sendMail(to, subject, text, html);
  }

  sendInvitationEmail(to, collegeName, role, inviteUrl) {
    const subject = `Invitation to join ${collegeName}`;
    const text = `You are invited to join ${collegeName} as ${role}.\n${inviteUrl}`;
    const html = `
      <h3>You're Invited!</h3>
      <p>Join <b>${collegeName}</b> as <b>${role}</b>.</p>
      <a href="${inviteUrl}">Complete Registration</a>
    `;
    this.sendMail(to, subject, text, html);
  }

  sendScheduleNotification(to, collegeName, weekStartDate) {
    const subject = `New Mess Menu: Week of ${new Date(
      weekStartDate
    ).toLocaleDateString()}`;
    const text = `New mess schedule uploaded for ${collegeName}.`;
    const html = `
      <h3>New Mess Menu Published</h3>
      <p>Mess menu for ${collegeName} is now available.</p>
    `;
    this.sendMail(to, subject, text, html);
  }

  sendComplaintStatusUpdate(to, complaintTitle, status, remark) {
    const subject = `Complaint Status Update`;
    const text = `Your complaint "${complaintTitle}" is now ${status}.`;
    const html = `
      <h3>Complaint Update</h3>
      <p><b>${complaintTitle}</b> is now <b>${status}</b>.</p>
      <p>${remark || ""}</p>
    `;
    this.sendMail(to, subject, text, html);
  }
}

module.exports = MailService;
