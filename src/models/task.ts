import mongoose, { Schema, Document } from 'mongoose';
import { UserTask, TaskComment } from './index';

export interface ITask extends Document {
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    dueDate: Date;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    dueDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
}, { timestamps: true });

TaskSchema.virtual("assignedUsers", {
    ref: "user_task", // Reference to UserTask model
    localField: "_id", // Task _id
    foreignField: "taskId", // UserTask taskId field
});

TaskSchema.virtual("comments", {
    ref: "task_comment", // Reference to TaskComment model
    localField: "_id", // Task _id
    foreignField: "taskId", // TaskComment taskId field
});

TaskSchema.virtual("history", {
    ref: "task_history", // Reference to TaskHistory model
    localField: "_id", // Task _id
    foreignField: "taskId", // TaskHistory taskId field
});

TaskSchema.pre("findOneAndDelete", async function (next) {
    const task = this.getQuery(); // Get the task being deleted

    // Delete related UserTask records
    await UserTask.deleteMany({ taskId: task._id });
    await TaskComment.deleteMany({ taskId: task._id });

    next();
});

TaskSchema.set("toObject", { virtuals: true });
TaskSchema.set("toJSON", { virtuals: true });

export const Task = mongoose.model<ITask>('task', TaskSchema);