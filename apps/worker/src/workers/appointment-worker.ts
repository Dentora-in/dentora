// worker.ts
import { Worker } from "bullmq";
import { createMeetEvent } from "@dentora/shared/meeting";
import { emailService } from "@dentora/shared/mailing";
import { prisma } from "@dentora/database";
import { redisConnection } from "@dentora/shared/queue";

export const appointmentWorker = new Worker(
  "appointment-queue",
  async (job) => {
    const { appointmentId, email, patientName, slotStart, slotEnd } = job.data;

    const meetLink = await createMeetEvent(email, slotStart, slotEnd);

    if (!meetLink) {
      throw new Error("Failed to generate meet link. Retrying...");
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { meetLink },
    });

    await emailService({
      to: email,
      patientName,
      meetingLink: meetLink,
      startTime: slotStart,
      endTime: slotEnd,
    });

    return true;
  },
  {
    connection: redisConnection,
  },
);
