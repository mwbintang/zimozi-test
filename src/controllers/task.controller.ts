import { NextFunction, Request, Response } from 'express';
import { taskService } from '../services/index.service';
import { success } from '../helpers/response_json';
import { AuthenticatedRequest } from "../types/express"
// import { z } from 'zod';

export const getAllTasks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await taskService.getAllTasks();

        success(res, 200, "Success get all task", tasks);
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = _req.params
        const { user } = _req
        const tasks = await taskService.getTaskById(parseInt(id), user);

        success(res, 200, "Success get all task", tasks);
    } catch (error) {
        next(error);
    }
};

export const createTask = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, status, dueDate, assignedTo } = _req.body
        const { user } = _req
        const tasks = await taskService.createTask(title, description, status, dueDate, assignedTo, user);

        success(res, 201, "Success create task", tasks);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, status, dueDate, assignedTo } = _req.body
        const tasks = await taskService.updateTask(title, description, status, dueDate, assignedTo);

        success(res, 203, "Success update task", tasks);
    } catch (error) {
        next(error);
    }
}

export const deleteTask = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = _req.params
        const tasks = await taskService.deleteTask(parseInt(id));

        success(res, 204, "Success delete task", tasks);
    } catch (error) {
        next(error);
    }
}