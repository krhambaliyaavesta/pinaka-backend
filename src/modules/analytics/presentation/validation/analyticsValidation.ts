import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../../shared/errors/AppError";

/**
 * Validates analytics request parameters
 */
export const validateAnalyticsRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Validate limit if provided
  if (req.query.limit) {
    const limit = parseInt(req.query.limit as string, 10);
    if (isNaN(limit) || limit <= 0) {
      return next(new AppError("Limit must be a positive number", 400));
    }
  }

  // Validate period if provided
  if (req.query.period) {
    const period = (req.query.period as string).toLowerCase();
    const validPeriods = ["daily", "weekly", "monthly", "quarterly", "yearly"];
    
    if (!validPeriods.includes(period)) {
      return next(
        new AppError(
          `Invalid period. Valid options are: ${validPeriods.join(", ")}`,
          400
        )
      );
    }
  }

  next();
}; 