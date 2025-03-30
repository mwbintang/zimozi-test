import { Router } from "express";
import { createComment, getCommentsByTask, updateComment, deleteComment } from "../controllers/task_comment.controller";
import { authAllRole } from "../middlewares/auth";
import { limiter } from "../middlewares/rate_limiter";

const router = Router();

router.use(limiter);
router.use(authAllRole);
router.post("/", createComment);
router.get("/:taskId", getCommentsByTask);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;

