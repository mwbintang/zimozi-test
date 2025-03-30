import { z } from "zod";

// Schema for creating a comment
export const createCommentSchema = z.object({
  body: z.object({
    taskId: z.string().min(1, "Task ID is required"),
    comment: z.string().min(1, "Comment cannot be empty"),
  }),
});

// Schema for fetching comments by task ID
export const getCommentsByTaskSchema = z.object({
  params: z.object({
    taskId: z.string().min(1, "Task ID is required"),
  }),
});

// Schema for updating a comment
export const updateCommentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Comment ID is required"),
  }),
  body: z.object({
    comment: z.string().min(1, "Comment cannot be empty"),
  }),
});

// Schema for deleting a comment
export const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Comment ID is required"),
  }),
});
