import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

/**
 * Middleware to authorize based on user roles
 * @param allowedRoles Array of roles that are allowed to access the route
 */
export const authorizeRoles = (allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated and has a role
    if (!req.user || req.user.role === undefined) {
      return next(new AppError('Authentication required', 401));
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      const roleNames = allowedRoles.map(role => 
        role === 1 ? 'admin' : role === 2 ? 'lead' : role === 3 ? 'user' : `role ${role}`
      ).join(' or ');
      
      return next(
        new AppError(`Access denied. Only ${roleNames} can access this resource`, 403)
      );
    }

    next();
  };
}; 