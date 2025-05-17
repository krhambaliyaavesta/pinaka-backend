import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../../../../shared/errors/AppError";
import { validate as uuidValidate } from "uuid";

/**
 * Validation schema for creating a kudos card
 */
const createKudosCardSchema = Joi.object({
  recipientName: Joi.string().trim().min(2).max(255).required().messages({
    "string.min": "Recipient name must be at least 2 characters",
    "string.max": "Recipient name cannot exceed 255 characters",
    "any.required": "Recipient name is required",
  }),
  teamId: Joi.number().integer().positive().required().messages({
    "number.base": "Team ID must be a number",
    "number.integer": "Team ID must be an integer",
    "number.positive": "Team ID must be positive",
    "any.required": "Team ID is required",
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    "number.base": "Category ID must be a number",
    "number.integer": "Category ID must be an integer",
    "number.positive": "Category ID must be positive",
    "any.required": "Category ID is required",
  }),
  message: Joi.string().trim().min(5).required().messages({
    "string.min": "Message must be at least 5 characters",
    "any.required": "Message is required",
  }),
});

/**
 * Validation schema for updating a kudos card
 */
const updateKudosCardSchema = Joi.object({
  recipientName: Joi.string().trim().min(2).max(255).messages({
    "string.min": "Recipient name must be at least 2 characters",
    "string.max": "Recipient name cannot exceed 255 characters",
  }),
  teamId: Joi.number().integer().positive().messages({
    "number.base": "Team ID must be a number",
    "number.integer": "Team ID must be an integer",
    "number.positive": "Team ID must be positive",
  }),
  categoryId: Joi.number().integer().positive().messages({
    "number.base": "Category ID must be a number",
    "number.integer": "Category ID must be an integer",
    "number.positive": "Category ID must be positive",
  }),
  message: Joi.string().trim().min(5).messages({
    "string.min": "Message must be at least 5 characters",
  }),
});

/**
 * Validation schema for filtering kudos cards
 */
const filterKudosCardSchema = Joi.object({
  recipientName: Joi.string().trim(),
  teamId: Joi.number().integer().positive(),
  categoryId: Joi.number().integer().positive(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")),
  createdBy: Joi.string().uuid(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  sortBy: Joi.string().valid("createdAt", "updatedAt", "recipientName"),
  sortDirection: Joi.string().valid("asc", "desc"),
});

/**
 * Middleware to validate kudos card ID parameter
 */

/**
 * Middleware to validate kudos card creation data
 */
export const validateCreateKudosCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createKudosCardSchema.validate(req.body, {
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
 * Middleware to validate kudos card update data
 */
export const validateUpdateKudosCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("No update data provided", 400));
  }

  const { error } = updateKudosCardSchema.validate(req.body, {
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
 * Middleware to validate kudos card filter parameters
 */
export const validateKudosCardFilters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = filterKudosCardSchema.validate(req.query, {
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
