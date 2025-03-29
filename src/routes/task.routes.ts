import { Router } from 'express';
import { taskController } from '../controllers/index.controller';
import { authAllRole, authAdminManager, authAdmin } from '../middlewares/auth'; 
import { limiter } from '../middlewares/rate_limiter';

const router = Router();

router.use(limiter);

router.use(authAllRole);
router.get("/user/:userId", taskController.getUserTasks);
router.get('/:id', taskController.getTaskById);

router.use(authAdminManager);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);

router.use(authAdmin);
router.delete('/:id', taskController.deleteTask);

export default router; 