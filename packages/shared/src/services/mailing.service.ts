import nodemailer, { Transporter } from "nodemailer";

// ==================== TYPES ====================

// Arguments passed into emailService()
export interface AppointmentEmailPayload {
  to: string;
  patientName: string;
  meetingLink: string;
  startTime: string | Date;
  endTime: string | Date;
}

// Arguments passed to createICS()
interface ICSOptions {
  title: string;
  description: string;
  meetingLink: string;
  startTime: string | Date;
  endTime: string | Date;
}

// ==================== HELPERS ====================

// Convert JS date → ICS date string
const formatICSDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

// Create ICS event data
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

// ==================== EMAIL SERVICE ====================

export const emailService = async ({
  to,
  patientName,
  meetingLink,
  startTime,
  endTime,
}: AppointmentEmailPayload): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_SERVICE_EMAIL,
        pass: process.env.MAIL_SERVICE_EMAIL_PASS,
      },
    });

    // 2. Build ICS file
    const appointmentICS = createICS({
      title: `Dentora Appointment`,
      description: `Hello ${patientName}, your appointment is scheduled.`,
      meetingLink,
      startTime,
      endTime,
    });

    // 3. Email message
    const message = {
      from: `"Dentora"`,
      to,
      subject: "Your Appointment Details",
      text: "Your appointment is confirmed. Please open this email to add it to your calendar.",
      icalEvent: {
        filename: "appointment.ics",
        method: "REQUEST",
        content: appointmentICS,
      },
    };

    // 4. Send email
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
