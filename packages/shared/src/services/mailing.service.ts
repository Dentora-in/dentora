import nodemailer from "nodemailer";
import { isDevelopmentMode } from "@dentora/shared/globals";

export interface AppointmentEmailPayload {
  to: string;
  patientName: string;
  meetingLink: string;
  startTime: string | Date;
  endTime: string | Date;
}

interface ICSOptions {
  title: string;
  description: string;
  meetingLink: string;
  startTime: string | Date;
  endTime: string | Date;
}

const formatICSDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

const createICS = ({
  title,
  description,
  meetingLink,
  startTime,
  endTime,
}: ICSOptions): string => {
  return `
    BEGIN:VCALENDAR
    PRODID:-//Dentora App//EN
    VERSION:2.0
    CALSCALE:GREGORIAN
    METHOD:REQUEST
    BEGIN:VEVENT
    UID:${Date.now()}@dentora.com
    DTSTAMP:${formatICSDate(new Date())}
    DTSTART:${formatICSDate(new Date(startTime))}
    DTEND:${formatICSDate(new Date(endTime))}
    SUMMARY:${title}
    DESCRIPTION:${description}\\nMeeting Link: ${meetingLink}
    LOCATION:Online
    STATUS:CONFIRMED
    END:VEVENT
    END:VCALENDAR
`.trim();
};

export const emailService = async ({
  to,
  patientName,
  meetingLink,
  startTime,
  endTime,
}: AppointmentEmailPayload): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_SERVICE_EMAIL,
        pass: process.env.MAIL_SERVICE_EMAIL_PASS,
      },
    });

    const appointmentICS = createICS({
      title: `Dentora Appointment`,
      description: `Hello ${patientName}, your appointment is scheduled.`,
      meetingLink,
      startTime,
      endTime,
    });

    const message = {
      from: `"Dentora" <${process.env.MAIL_SERVICE_EMAIL}>`,
      to,
      subject: `Dentora Appointment Confirmation – ${patientName}`,

      text: `
        Hello ${patientName},

        Your appointment has been successfully scheduled on Dentora.

        📅 Appointment Details  
        • Start Time: ${new Date(startTime).toLocaleString()}  
        • End Time: ${new Date(endTime).toLocaleString()}  
        • Meeting Link: ${meetingLink}

        We have also attached a calendar invite (.ics file). Please open the attachment to add the appointment to your calendar.

        If you have any questions or need to reschedule, please reply to this email.

        Warm regards,  
        Dentora Team
          `.trim(),

      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
          <h2 style="margin-bottom: 8px; color: #0A7AFF;">Dentora Appointment Confirmation</h2>

          <p>Hi <strong>${patientName}</strong>,</p>

          <p>Your appointment has been successfully scheduled. Below are your appointment details:</p>

          <div style="background: #f4f7ff; border-left: 4px solid #0A7AFF; padding: 12px 16px; margin: 16px 0;">
            <p style="margin: 0;"><strong>📅 Start:</strong> ${new Date(startTime).toLocaleString()}</p>
            <p style="margin: 4px 0;"><strong>📅 End:</strong> ${new Date(endTime).toLocaleString()}</p>
            <p style="margin: 4px 0;"><strong>🔗 Meeting Link:</strong> <a href="${meetingLink}" style="color: #0A7AFF;">Join Meeting</a></p>
          </div>

          <p>We’ve attached a calendar invite so you can easily save this appointment.</p>

          <p>If you have any questions or need to reschedule, just reply to this email — we’re here to help.</p>

          <p style="margin-top: 24px;">Warm regards,<br><strong>Dentora Team</strong></p>
        </div>
      `.trim(),

      icalEvent: {
        filename: "appointment.ics",
        method: "REQUEST",
        content: appointmentICS,
      },
    };

    if (isDevelopmentMode) {
      console.log(
        "📧 [DEV MODE] Email payload:",
        JSON.stringify(message, null, 2),
      );

      return {
        success: true,
        message: "Email logged in development mode. No email sent.",
      };
    }

    await transporter.sendMail(message);

    return {
      success: true,
      message: "Email sent with calendar invite",
    };
  } catch (err: any) {
    console.error("❌ Email Send Error:", err);

    return {
      success: false,
      message: "Failed to send appointment email",
      error: err?.message || "Unknown error",
    };
  }
};
