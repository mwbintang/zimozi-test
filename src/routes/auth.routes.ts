import { Router } from 'express';
import { authController } from '../controllers/index.controller';
import { authAllRole } from '../middlewares/auth';
import { limiter } from '../middlewares/rate_limiter';

const router = Router();

router.use(limiter);

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.use(authAllRole);
router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);
router.put('/change-password', authController.changePassword);

export default router; 