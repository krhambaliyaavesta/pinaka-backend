import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import {
  validateCategoryId,
  validateCreateCategory,
  validateUpdateCategory,
} from "../validation/categoryValidation";
import { authMiddleware } from "../../../../shared/middlewares/authMiddleware";
import { adminMiddleware } from "../../../../shared/middlewares/adminMiddleware";

const router = Router();
const categoryController = new CategoryController();

// Public routes (available to all authenticated users)
router.get("/", authMiddleware, categoryController.getAllCategories);
router.get(
  "/:id",
  authMiddleware,
  validateCategoryId,
  categoryController.getCategoryById
);

// Admin-only routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateCategory,
  categoryController.createCategory
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateCategoryId,
  validateUpdateCategory,
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateCategoryId,
  categoryController.deleteCategory
);

export default router;
