import { Queue } from "bullmq";
import * as dotenv from "dotenv";
dotenv.config();

export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

console.log("Redis connection", redisConnection);

export const queue = new Queue("appointment-queue", {
    connection: redisConnection,
});