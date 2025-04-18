import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/express";
import { taskCommentService } from "../services/index.service";
import { success } from "../helpers/response_json";
import { 
    taskCommentValidation
} from "../validations/index.validations";

// Create a new comment
export const createComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Validate request body
        const validatedData = taskCommentValidation.createCommentSchema.parse({ body: req.body });

        const { taskId, comment } = validatedData.body;
        const userId = req.user?.id;
        const newComment = await taskCommentService.createComment(taskId, comment, userId);

        success(res, 201, "Comment created successfully", newComment);
    } catch (error) {
        next(error);
    }
};

// Get comments by task ID
export const getCommentsByTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate request params
        const validatedData = taskCommentValidation.getCommentsByTaskSchema.parse({ params: req.params });

        const { taskId } = validatedData.params;
        const comments = await taskCommentService.getCommentsByTask(taskId);

        success(res, 200, "Comments fetched successfully", comments);
    } catch (error) {
        next(error);
    }
};

// Update a comment
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate request params and body
        const validatedData = taskCommentValidation.updateCommentSchema.parse({ params: req.params, body: req.body });

        const { id } = validatedData.params;
        const { comment } = validatedData.body;
        const updatedComment = await taskCommentService.updateComment(id, comment);

        success(res, 203, "Comment updated successfully", updatedComment);
    } catch (error) {
        next(error);
    }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate request params
        const validatedData = taskCommentValidation.deleteCommentSchema.parse({ params: req.params });

        const { id } = validatedData.params;
        const deletedComment = await taskCommentService.deleteComment(id);

        success(res, 204, "Comment deleted successfully", deletedComment);
    } catch (error) {
        next(error);
    }
};
