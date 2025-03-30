import { z } from "zod";

export const getTaskHistorySchema = z.object({
    params: z.object({
        taskId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid task ID format"),
    }),
    query: z.object({
        page: z
            .string()
            .regex(/^\d+$/, "Page must be a number")
            .default("1"),
        limit: z
            .string()
            .regex(/^\d+$/, "Limit must be a number")
            .default("10"),
    }),
});
