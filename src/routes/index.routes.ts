import { Router } from 'express';
import taskRoute from "./task.routes"
import authRouter from "./auth.routes"
import taskHistoryRoute from "./task_history.routes"
import taskCommentRoute from "./task_comment.routes"

const router = Router();

router.use("/", authRouter)
router.use("/task", taskRoute)
router.use("/task-history", taskHistoryRoute)
router.use("/task-comment", taskCommentRoute)

export default router; 