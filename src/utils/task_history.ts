import { TaskHistory } from "../models";
import { redis } from "../config/redis";

export const createTaskHistory = async (
    taskId: any,
    updatedBy: any,
    status: string
) => {
    try {
        await TaskHistory.create({
            taskId,
            updatedBy,
            status,
            timestamp: new Date(),
        });

        const keys = await redis.keys("task_history:*");
        if (keys.length > 0) {
            await Promise.all(keys.map((key: string) => redis.del(key)));
        }
    } catch (error) {
        console.error("Error creating task history:", error);
    }
};
