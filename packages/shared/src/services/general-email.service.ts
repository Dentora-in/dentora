import nodemailer from "nodemailer";
import { isDevelopmentMode } from "@dentora/shared/globals";

console.log("|||| is this development mode? ", isDevelopmentMode, "||||");

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
    if (!isDevelopmentMode) {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_SERVICE_EMAIL,
          pass: process.env.MAIL_SERVICE_EMAIL_PASS,
        },
      });
    }
  }

  async sendEmail(options: SendEmailOptions) {
    if (isDevelopmentMode) {
      console.log("========================================================================");
      console.log("📨 DEV MODE: Email would be sent with the following details:");
      console.log(options.from);
      console.log(options.text);
      console.log("========================================================================");
      return { success: true, info: "DEV MODE - email not sent" };
    }

    try {
      const info = await this.transporter?.sendMail({
        from: options.from || process.env.MAIL_SERVICE_EMAIL,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log("📨 Email sent:", info?.messageId);
      return { success: true, info };
    } catch (error: any) {
      console.error("❌ Email sending failed:", error.message);
      return { success: false, error: error.message };
    }
  }
}

export const emailService = new EmailService();
