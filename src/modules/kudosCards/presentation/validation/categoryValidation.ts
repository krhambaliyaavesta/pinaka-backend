import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../../../../shared/errors/AppError";

/**
 * Validation schema for creating a category
 */
const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name cannot exceed 100 characters",
    "any.required": "Category name is required",
  }),
});

/**
 * Validation schema for updating a category
 */
const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name cannot exceed 100 characters",
  }),
});

/**
 * Middleware to validate category ID parameter
 */
export const validateCategoryId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return next(new AppError("Invalid category ID", 400));
  }

  req.params.id = id.toString();
  next();
};

/**
 * Middleware to validate category creation data
 */
export const validateCreateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createCategorySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(errorMessage, 400));
  }

  next();
};

/**
 * Middleware to validate category update data
 */
export const validateUpdateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("No update data provided", 400));
  }

  const { error } = updateCategorySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(errorMessage, 400));
  }

  next();
};
