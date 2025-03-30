import { TaskComment } from "../models";
import { redis } from "../config/redis";

export const createComment = async (taskId: string, comment: string, userId: any) => {
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const newComment = await TaskComment.create({ taskId, comment, userId });
    await redis.del(`comments:${taskId}`);

    return newComment;
}

export const getCommentsByTask = async (taskId: string) => {
    const cachedComments = await redis.get(`comments:${taskId}`);
    if (cachedComments) {
        return JSON.parse(cachedComments);
    }

    const comments = await TaskComment.find({ taskId });
    await redis.set(`comments:${taskId}`, JSON.stringify(comments));
    
    return comments;
}

export const updateComment = async (commentId: string, comment: string) => {
    const updatedComment = await TaskComment.findByIdAndUpdate(commentId, { comment }, { new: true });
    await redis.del(`comments:${updatedComment?.taskId}`);

    return updatedComment;
}

export const deleteComment = async (commentId: string) => {
    const deletedComment = await TaskComment.findByIdAndDelete(commentId);
    return deletedComment;
}
