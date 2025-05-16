import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { config } from '../../config';
import { TokenBlacklistService } from '../services/TokenBlacklistService';

// Define the payload type for the JWT token
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("authHeader",authHeader);
    
    
    if (!authHeader) {
      throw new AppError('Authentication required', 401);
    }
    
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      throw new AppError('Invalid authentication format', 401);
    }
    
    // Check if token is blacklisted
    const tokenBlacklistService = TokenBlacklistService.getInstance();
    if (tokenBlacklistService.isBlacklisted(token)) {
      throw new AppError('Token has been invalidated', 401);
    }
    
    // Use any type to bypass strict type checking
    const decoded = jwt.verify(token, config.jwt.secret as any) as JwtPayload;
    
    // Add decoded user info to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    
    next();
  };
}; 