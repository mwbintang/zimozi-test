import mongoose, { Schema, Document } from "mongoose";

export interface IUserTask extends Document {
  userId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
}

const UserTaskSchema = new Schema<IUserTask>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
});

export const UserTask = mongoose.model<IUserTask>("user_task", UserTaskSchema);
