import { Router } from 'express';
import userRoute from "./user.routes"
import taskRoute from "./task.routes"
import authRouter from "./auth.routes"

const router = Router();

router.use("/user", userRoute)
router.use("/task", taskRoute)
router.use("/", authRouter)
// router.get('/health', indexController.healthCheck);
// router.get('/api-info', indexController.getApiInfo);

export default router; 