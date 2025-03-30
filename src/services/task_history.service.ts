import { TaskHistory } from "../models";
import { offset, paginationData } from "../helpers/pagination";
import { redis } from "../config/redis";
export const getTaskHistoryById = async (taskId: string, page: string, limit: string) => {
    try {
        const cachedTaskHistory = await redis.get(`task_history:${taskId},${page},${limit}`);
        if (cachedTaskHistory) {
            return JSON.parse(cachedTaskHistory);
        }

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = offset(pageNumber, limitNumber);

        const taskHistory = await TaskHistory.find({ taskId })
            .populate('taskId')
            .populate('updatedBy')
            .skip(skip)
            .limit(limitNumber);

        const total = await TaskHistory.countDocuments({ taskId });

        const taskHistoryData = paginationData(taskHistory, total, pageNumber, limitNumber);
        await redis.set(`task_history:${taskId},${page},${limit}`, JSON.stringify(taskHistoryData));
        return taskHistoryData;
    } catch (error) {
        throw new Error("Failed to get task history");
    }
}
