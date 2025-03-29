import { TaskHistory } from "../models";
import mongoose from "mongoose";

/**
 * Creates a task history entry
 * @param {any} taskId - The ID of the task
 * @param {any} updatedBy - The ID of the user who made the update
 * @param {string} status - The status of the task
 */
export const createTaskHistory = async (
    taskId: any,
    updatedBy: any,
    status: string
) => {
    try {
        await TaskHistory.create({
            taskId,
            updatedBy,
            status,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error("Error creating task history:", error);
    }
};
