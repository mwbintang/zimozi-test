import mongoose, { Schema, Document } from "mongoose";

export interface ITaskHistory extends Document {
    taskId: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    status: string;
    timestamp: Date;
}

const TaskHistorySchema = new Schema<ITaskHistory>({
    taskId: { type: Schema.Types.ObjectId, ref: 'task', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const TaskHistory = mongoose.model<ITaskHistory>('task_history', TaskHistorySchema);