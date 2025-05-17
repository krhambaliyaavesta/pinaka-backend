import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateSignUp, validateSignIn, validateUpdateUser } from '../validation/authValidation';
import { authMiddleware, authorize } from '../../../../shared/middlewares/authMiddleware';

const router = Router();
const authController = new AuthController();

// Public routes

router.post('/signup', validateSignUp, authController.signUp);

router.post('/signin', validateSignIn, authController.signIn);

// Protected routes
router.get('/me', authMiddleware, authController.getUserInfo);
router.post('/logout', authMiddleware, authController.logout);

// Admin routes (role 1 = admin) or self-update
router.put('/users/:userId', authMiddleware, validateUpdateUser, authController.updateUser);

// Admin-only routes
router.delete('/users/:userId', authMiddleware, authController.deleteUser);

export default router; 