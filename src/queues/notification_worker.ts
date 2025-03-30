import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import { Notification } from "../models";
import { redis } from "../config/redis";
import { connectDB } from "../config/database";

const worker = new Worker(
  "notificationQueue",
  async (job) => {
    console.log(`📨 Processing job: Notify ${job.data.userId}`);
    await connectDB();

    await Notification.create({
      userId: job.data.userId,
      message: job.data.message,
      isRead: false,
      timestamp: new Date(),
    });

    console.log(`✅ Notification sent: ${job.data.message}`);
  },
  { connection: redis }
);

worker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job?.id}, Error: ${err.message}`);
});
