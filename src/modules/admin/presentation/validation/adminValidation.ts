import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../../../../shared/errors/AppError";
import { ApprovalStatus } from "../../../auth/domain/entities/UserTypes";

const updateUserSchema = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),
  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email address",
  }),
  firstName: Joi.string(),
  lastName: Joi.string(),
  jobTitle: Joi.string(),
  role: Joi.number().integer().min(1).max(3).messages({
    "number.min": "Role must be between 1 and 3",
    "number.max": "Role must be between 1 and 3",
  }),
  approvalStatus: Joi.string()
    .valid(...Object.values(ApprovalStatus))
    .messages({
      "any.only": `Approval status must be one of: ${Object.values(
        ApprovalStatus
      ).join(", ")}`,
    }),
}).min(2); // At least userId and one other field

// Schema for validating search user parameters
const searchUsersSchema = Joi.object({
  query: Joi.string().allow(""),
  role: Joi.number().integer().min(1).max(3).messages({
    "number.min": "Role must be between 1 and 3",
    "number.max": "Role must be between 1 and 3",
  }),
  approvalStatus: Joi.string()
    .valid(...Object.values(ApprovalStatus))
    .messages({
      "any.only": `Approval status must be one of: ${Object.values(
        ApprovalStatus
      ).join(", ")}`,
    }),
  limit: Joi.number().integer().min(1).max(100).messages({
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
  offset: Joi.number().integer().min(0).messages({
    "number.min": "Offset must be at least 0",
  }),
});

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add userId from params to the validation data
  const validationData = {
    ...req.body,
    userId: req.params.userId,
  };

  const { error } = updateUserSchema.validate(validationData, {
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

export const validateSearchUsers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Type cast query parameters to appropriate types
  const validationData = {
    query: req.query.query,
    role: req.query.role ? parseInt(req.query.role as string, 10) : undefined,
    approvalStatus: req.query.approvalStatus,
    limit: req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : undefined,
    offset: req.query.offset
      ? parseInt(req.query.offset as string, 10)
      : undefined,
  };

  const { error } = searchUsersSchema.validate(validationData, {
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
