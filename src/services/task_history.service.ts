import { TaskHistory } from "../models";
import { offset, paginationData } from "../helpers/pagination";

export const getTaskHistoryById = async (taskId: string, page: string, limit: string) => {
    try {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = offset(pageNumber, limitNumber);

        const taskHistory = await TaskHistory.find({ taskId })
            .populate('taskId')
            .populate('updatedBy')
            .skip(skip)
            .limit(limitNumber);

        const total = await TaskHistory.countDocuments({ taskId });

        return paginationData(taskHistory, total, pageNumber, limitNumber);
    } catch (error) {
        throw new Error("Failed to get task history");
    }
}
