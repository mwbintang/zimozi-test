import { Router } from 'express';
import { userController } from '../controllers/index.controller'
// import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
// const userController = new UserController();

// Public routes
// router.post('/register', userController.register);
// router.post('/login', userController.login);

// Protected routes
// router.use(authMiddleware);
router.get('/', userController.getUsers);
// router.put('/profile', userController.updateProfile);
// router.get('/', userController.getAllUsers);
// router.get('/:id', userController.getUserById);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

export default router; 