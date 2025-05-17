import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateSignUp, validateSignIn } from '../validation/authValidation';
import { authMiddleware, authorize } from '../../../../shared/middlewares/authMiddleware';

const router = Router();
const authController = new AuthController();

// Public routes

router.post('/signup', validateSignUp, authController.signUp);

router.post('/signin', validateSignIn, authController.signIn);

// Protected routes
router.get('/me', authMiddleware, authController.getUserInfo);
router.post('/logout', authMiddleware, authController.logout);

export default router; 