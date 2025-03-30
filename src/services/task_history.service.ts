import { TaskHistory } from "../models";
import { offset, paginationData } from "../helpers/pagination";
import { setRedisCache, getRedisCache } from '../helpers/redis';

export const getTaskHistoryById = async (taskId: string, page: string, limit: string) => {
    try {
        const cachedTaskHistory = await getRedisCache(`task_history:${taskId},${page},${limit}`);
        if (cachedTaskHistory) {
            return cachedTaskHistory;
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
        await setRedisCache(`task_history:${taskId},${page},${limit}`, taskHistoryData);
        
        return taskHistoryData;
    } catch (error) {
        throw new Error("Failed to get task history");
    }
}
