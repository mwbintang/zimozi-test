import { NextFunction, Request, Response } from 'express';
import { taskService } from '../services/index.service';
import { success } from '../helpers/response_json';
import { AuthenticatedRequest } from "../types/express"
import { taskValidation } from '../validations/index.validations';

export const getUserTasks = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = taskValidation.userIdParamSchema.parse(_req.params);
        const { user } = _req
        const { page, limit } = taskValidation.paginationSchema.parse(_req.query);
        const tasks = await taskService.getUserTasks(userId, user, page as string, limit as string);

        success(res, 200, "Success get all task by user ID", tasks);
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = taskValidation.idParamSchema.parse(_req.params);
        const { user } = _req
        const tasks = await taskService.getTaskById(id, user);

        success(res, 200, "Success get all task", tasks);
    } catch (error) {
        next(error);
    }
};

export const createTask = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, status, dueDate, assignedTo } = taskValidation.taskSchema.parse(_req.body);
        const { user } = _req
        const tasks = await taskService.createTask(title, description, status, dueDate, assignedTo, user);

        success(res, 201, "Success create task", tasks);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = _req.params
        const { title, description, status, dueDate, assignedTo } = _req.body
        const { user } = _req
        const tasks = await taskService.updateTask(id, title, description, status as string, dueDate, assignedTo, user);

        success(res, 203, "Success update task", tasks);
    } catch (error) {
        next(error);
    }
}

export const deleteTask = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = _req.params
        const tasks = await taskService.deleteTask(id);

        success(res, 204, "Success delete task", tasks);
    } catch (error) {
        next(error);
    }
}