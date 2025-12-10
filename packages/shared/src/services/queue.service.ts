import { Queue } from "bullmq";
import * as dotenv from "dotenv";
dotenv.config();

console.log('Redis Host:', process.env.REDIS_HOST);
console.log('Redis Port:', process.env.REDIS_PORT);

export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

console.log("Redis connection", redisConnection);

// -------------------------------
// Appointment Queue
// -------------------------------
export const appointmentQueue = new Queue("appointment-queue", {
  connection: redisConnection,
});

// -------------------------------
// Email Queue (rate-limited)
// -------------------------------
export const emailQueue = new Queue("email-queue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
