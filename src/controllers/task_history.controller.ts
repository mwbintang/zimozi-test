import { NextFunction, Request, Response } from "express";
import { taskHistoryService } from "../services/index.service";
import { success } from "../helpers/response_json";
import { taskHistoryValidation } from "../validations/index.validations";

export const getTaskHistoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate request params and query
        const validatedData = taskHistoryValidation.getTaskHistorySchema.parse({ 
            params: req.params, 
            query: req.query 
        });

        const { taskId } = validatedData.params;
        const { page, limit } = validatedData.query;const taskHistory = await taskHistoryService.getTaskHistoryById(taskId, page as string, limit as string);

        success(res, 200, "Success get task history", taskHistory);
    } catch (error) {
        next(error);
    }
}
