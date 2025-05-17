import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../../../../shared/middlewares/authMiddleware';
import { authorizeRoles } from '../../../../shared/middlewares/roleMiddleware';

const router = Router();
const adminController = new AdminController();

// Constants for role IDs
const ADMIN_ROLE = 1;
const LEAD_ROLE = 2;

// Routes for both admin and lead
router.get(
  '/users/pending', 
  authMiddleware, 
  authorizeRoles([ADMIN_ROLE, LEAD_ROLE]), 
  adminController.getPendingUsers
);

export default router; 