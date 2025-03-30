import { z } from "zod";

// Schema for pagination (query params)
export const paginationSchema = z.object({
    page: z
        .string()
        .regex(/^\d+$/, "Page must be a number")
        .default("1"),
    limit: z
        .string()
        .regex(/^\d+$/, "Limit must be a number")
        .default("10"),
});

// Schema for ID params
export const idParamSchema = z.object({
    id: z.string().length(24, "Invalid MongoDB ObjectId"),
});

// Schema for user ID in params
export const userIdParamSchema = z.object({
    userId: z.string().length(24, "Invalid MongoDB ObjectId"),
});

// Schema for creating/updating a task
export const taskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    status: z.enum(["Pending", "In Progress", "Completed"]),
    dueDate: z.preprocess((arg) => new Date(arg as string), z.date()),
    assignedTo: z.array(z.string().length(24, "Invalid MongoDB ObjectId")).nullable(),
});

// Schema for updating a task (all fields optional)
export const updateTaskSchema = taskSchema.partial();
