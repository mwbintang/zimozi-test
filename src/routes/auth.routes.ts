import { Router } from 'express';
import { authController } from '../controllers/index.controller';
// // import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// // Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);

// // Protected routes
// // router.use(authMiddleware);
// router.post('/logout', authController.logout);
// router.get('/me', authController.getCurrentUser);
// router.put('/change-password', authController.changePassword);

export default router; 