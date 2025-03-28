import mongoose, { Schema, Document } from 'mongoose';

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

TaskSchema.set("toObject", { virtuals: true });
TaskSchema.set("toJSON", { virtuals: true });

export const Task = mongoose.model<ITask>('task', TaskSchema);