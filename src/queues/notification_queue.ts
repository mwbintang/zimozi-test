import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const notificationQueue = new Queue("notificationQueue", {
  connection: redis,
});

export const addNotificationJob = async (userId: string, message: string) => {
  await notificationQueue.add("sendNotification", { userId, message });
  console.log(`📩 Job added: Notify ${userId}`);
};
