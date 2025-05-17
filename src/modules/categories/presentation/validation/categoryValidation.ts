import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../../../../shared/errors/AppError";
import { CATEGORY_VALIDATION, CATEGORY_ERROR_MESSAGES } from "../../application/constants/constants";

/**
 * Validation schema for creating a category
 */
const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(CATEGORY_VALIDATION.NAME_MIN_LENGTH)
    .max(CATEGORY_VALIDATION.NAME_MAX_LENGTH)
    .required()
    .messages({
      "string.min": CATEGORY_ERROR_MESSAGES.NAME_TOO_SHORT,
      "string.max": CATEGORY_ERROR_MESSAGES.NAME_TOO_LONG,
      "any.required": CATEGORY_ERROR_MESSAGES.NAME_REQUIRED,
    }),
});

/**
 * Validation schema for updating a category
 */
const updateCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(CATEGORY_VALIDATION.NAME_MIN_LENGTH)
    .max(CATEGORY_VALIDATION.NAME_MAX_LENGTH)
    .messages({
      "string.min": CATEGORY_ERROR_MESSAGES.NAME_TOO_SHORT,
      "string.max": CATEGORY_ERROR_MESSAGES.NAME_TOO_LONG,
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
    return next(new AppError(CATEGORY_ERROR_MESSAGES.INVALID_ID, 400));
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
    return next(new AppError(CATEGORY_ERROR_MESSAGES.NO_UPDATE_DATA, 400));
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