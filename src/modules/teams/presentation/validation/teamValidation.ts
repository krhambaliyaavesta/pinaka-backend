import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../../../../shared/errors/AppError";
import { TEAM_VALIDATION, TEAM_ERROR_MESSAGES } from "../../application/constants/constants";

/**
 * Validation schema for creating a team
 */
const createTeamSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(TEAM_VALIDATION.NAME_MIN_LENGTH)
    .max(TEAM_VALIDATION.NAME_MAX_LENGTH)
    .required()
    .messages({
      "string.min": TEAM_ERROR_MESSAGES.NAME_TOO_SHORT,
      "string.max": TEAM_ERROR_MESSAGES.NAME_TOO_LONG,
      "any.required": TEAM_ERROR_MESSAGES.NAME_REQUIRED,
    }),
});

/**
 * Validation schema for updating a team
 */
const updateTeamSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(TEAM_VALIDATION.NAME_MIN_LENGTH)
    .max(TEAM_VALIDATION.NAME_MAX_LENGTH)
    .messages({
      "string.min": TEAM_ERROR_MESSAGES.NAME_TOO_SHORT,
      "string.max": TEAM_ERROR_MESSAGES.NAME_TOO_LONG,
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
    return next(new AppError(TEAM_ERROR_MESSAGES.INVALID_ID, 400));
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
  const { error } = createTeamSchema.validate(req.body, {
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
 * Middleware to validate team update data
 */
export const validateUpdateTeam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError(TEAM_ERROR_MESSAGES.NO_UPDATE_DATA, 400));
  }

  const { error } = updateTeamSchema.validate(req.body, {
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