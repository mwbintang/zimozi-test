import { Router } from 'express';
import { taskController } from '../controllers/index.controller';
// import { authMiddleware } from '../middleware/auth.middleware';
import { authAllRole, authAdminManager, authAdmin } from '../middlewares/auth';

const router = Router();
// const taskController = new TaskController();

// All task routes require authentication

// Task CRUD operations
router.get('/', taskController.getAllTasks);

router.use(authAllRole);
router.get('/:id', taskController.getTaskById);

router.use(authAdminManager);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);

router.use(authAdmin);
router.delete('/:id', taskController.deleteTask);

// // Task assignment operations
// router.post('/:id/assign', taskController.assignTask);
// router.post('/:id/unassign', taskController.unassignTask);

// // Task status operations
// router.put('/:id/status', taskController.updateTaskStatus);

export default router; 