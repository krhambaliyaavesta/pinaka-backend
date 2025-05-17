import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../../../../shared/errors/AppError';
import { ApprovalStatus } from '../../../auth/domain/entities/UserTypes';

const updateUserSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required'
  }),
  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address'
  }),
  firstName: Joi.string(),
  lastName: Joi.string(),
  jobTitle: Joi.string(),
  role: Joi.number().integer().min(1).max(3).messages({
    'number.min': 'Role must be between 1 and 3',
    'number.max': 'Role must be between 1 and 3'
  }),
  approvalStatus: Joi.string().valid(...Object.values(ApprovalStatus)).messages({
    'any.only': `Approval status must be one of: ${Object.values(ApprovalStatus).join(', ')}`
  })
}).min(2); // At least userId and one other field

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  // Add userId from params to the validation data
  const validationData = {
    ...req.body,
    userId: req.params.userId
  };
  
  const { error } = updateUserSchema.validate(validationData, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  next();
}; 