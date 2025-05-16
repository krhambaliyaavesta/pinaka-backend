import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { config } from '../../config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      isOperational: err.isOperational
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      isOperational: true
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      isOperational: true
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    status: 'error',
    message: config.server.env === 'production' 
      ? 'Internal server error' 
      : err.message,
    isOperational: false
  });
}; 