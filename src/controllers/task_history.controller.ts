import { NextFunction, Request, Response } from "express";
import { taskHistoryService } from "../services/index.service";
import { success } from "../helpers/response_json";

export const getTaskHistoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.params;
        const { page = "1", limit = "10" } = req.query;
        const taskHistory = await taskHistoryService.getTaskHistoryById(taskId, page as string, limit as string);

        success(res, 200, "Success get task history", taskHistory);
    } catch (error) {
        next(error);
    }
}
