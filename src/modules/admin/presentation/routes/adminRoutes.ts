import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../../../../shared/middlewares/authMiddleware';

const router = Router();
const adminController = new AdminController();

// Admin-only routes - all these routes require authentication
router.get('/users/pending', authMiddleware, adminController.getPendingUsers);

export default router; 