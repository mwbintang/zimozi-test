import { TaskComment } from "../models";
import { invalidateCache, getRedisCache, setRedisCache } from '../helpers/redis';

export const createComment = async (taskId: string, comment: string, userId: any) => {
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const newComment = await TaskComment.create({ taskId, comment, userId });
    await invalidateCache(`comments:${taskId}`);

    return newComment;
}

export const getCommentsByTask = async (taskId: string) => {
    const cachedComments = await getRedisCache(`comments:${taskId}`);
    if (cachedComments) {
        return cachedComments;
    }

    const comments = await TaskComment.find({ taskId });
    await setRedisCache(`comments:${taskId}`, comments);
    
    return comments;
}

export const updateComment = async (commentId: string, comment: string) => {
    const updatedComment = await TaskComment.findByIdAndUpdate(commentId, { comment }, { new: true });
    await invalidateCache(`comments:${updatedComment?.taskId}`);

    return updatedComment;
}

export const deleteComment = async (commentId: string) => {
    await invalidateCache(`comments:${commentId}`);
    const deletedComment = await TaskComment.findByIdAndDelete(commentId);
    
    return deletedComment;
}
