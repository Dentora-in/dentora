import { google } from "googleapis";

export const getGoogleClient: any = () => {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN,
  } = process.env;

  if (
    !GOOGLE_CLIENT_ID ||
    !GOOGLE_CLIENT_SECRET ||
    !GOOGLE_REDIRECT_URI ||
    !GOOGLE_REFRESH_TOKEN
  ) {
    throw new Error("Missing Google OAuth environment variables");
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
  );

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
};

export const createMeetEvent = async (
  email: string,
  startTime: string,
  endTime: string,
) => {
  try {
    const auth = getGoogleClient();
    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary: `Appointment with ${email}`,
      description: "Your scheduled appointment",
      start: {
        dateTime: startTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime,
        timeZone: "Asia/Kolkata",
      },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: Date.now().toString(),
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });

    const meetLink =
      response.data?.hangoutLink ||
      response.data?.conferenceData?.entryPoints?.[0]?.uri;

    return meetLink;
  } catch (err) {
    console.error("❌ Error creating meet link:", err);
    return null;
  }
};
