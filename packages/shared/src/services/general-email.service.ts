import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_SERVICE_EMAIL,
        pass: process.env.MAIL_SERVICE_EMAIL_PASS,
      },
    });
  }

  async sendEmail(options: SendEmailOptions) {
    const mailOptions = {
      from: options.from || process.env.MAIL_SERVICE_EMAIL,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("📨 Email sent:", info.messageId);
      return { success: true, info };
    } catch (error: any) {
      console.error("❌ Email sending failed:", error.message);
      return { success: false, error: error.message };
    }
  }
}

export const emailService = new EmailService();
