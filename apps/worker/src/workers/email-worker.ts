import { Worker } from "bullmq";
import { redisConnection } from "@dentora/shared/queue";
import { emailService } from "@dentora/shared/general-mailing";

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { to, subject, html, text } = job.data;

    await emailService.sendEmail({
      to,
      subject,
      html,
      text,
    });

    return true;
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`📧 Email sent successfully (Job ${job.id})`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Email job failed (Job ${job?.id}):`, err);
});
