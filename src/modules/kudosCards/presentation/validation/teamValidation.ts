import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../../../../shared/errors/AppError";

/**
 * Validation schema for creating a team
 */
const createTeamSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.min": "Team name must be at least 2 characters",
    "string.max": "Team name cannot exceed 100 characters",
    "any.required": "Team name is required",
  }),
});

/**
 * Validation schema for updating a team
 */
const updateTeamSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Team name must be at least 2 characters",
    "string.max": "Team name cannot exceed 100 characters",
  }),
});

/**
 * Middleware to validate team ID parameter
 */
export const validateTeamId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return next(new AppError("Invalid team ID", 400));
  }

  req.params.id = id.toString();
  next();
};

/**
 * Middleware to validate team creation data
 */
export const validateCreateTeam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createTeamSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(errorMessage, 400));
  }

  next();
};

/**
 * Middleware to validate team update data
 */
export const validateUpdateTeam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("No update data provided", 400));
  }

  const { error } = updateTeamSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(errorMessage, 400));
  }

  next();
};
