import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../../../../shared/errors/AppError';
import { ApprovalStatus } from '../../domain/entities/UserTypes';

const signUpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required'
  }),
  jobTitle: Joi.string().required().messages({
    'any.required': 'Job title is required'
  })
});

const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

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

export const validateSignUp = (req: Request, res: Response, next: NextFunction) => {
  const { error } = signUpSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  next();
};

export const validateSignIn = (req: Request, res: Response, next: NextFunction) => {
  const { error } = signInSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  next();
};

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