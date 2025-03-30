import mongoose, { Schema, Document } from "mongoose";

export interface ITaskComment extends Document {
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    comment: string;
    timestamp: Date;
}

const TaskCommentSchema = new Schema<ITaskComment>({
    taskId: { type: Schema.Types.ObjectId, ref: 'task', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const TaskComment = mongoose.model<ITaskComment>('task_comment', TaskCommentSchema);