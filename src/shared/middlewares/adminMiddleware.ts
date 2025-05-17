import { Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { RequestWithUser } from "../types/express";

/**
 * Middleware to check if the user is an admin (role = 1)
 * Must be used after authMiddleware
 */
export const adminMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  // Check if the user object exists (it should if authMiddleware ran)
  if (!req.user) {
    return next(
      new AppError("You must be logged in to access this resource", 401)
    );
  }

  // Check if the user has admin role (role = 1)
  if (req.user.role !== 1) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  next();
};
