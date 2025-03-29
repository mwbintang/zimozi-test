import { Router } from 'express';
import { taskHistoryController } from '../controllers/index.controller';
import { authAllRole } from '../middlewares/auth';
import { limiter } from '../middlewares/rate_limiter';

const router = Router();

router.use(limiter);

router.use(authAllRole);
router.get("/:taskId", taskHistoryController.getTaskHistoryById);

export default router; 