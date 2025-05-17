import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "../../../../shared/types/express";
import { AppError } from "../../../../shared/errors/AppError";
import { GetTopRecipientsFactory } from "../../application/useCases/getTopRecipients/GetTopRecipientsFactory";
import { GetTopTeamsFactory } from "../../application/useCases/getTopTeams/GetTopTeamsFactory";
import { GetTrendingCategoriesFactory } from "../../application/useCases/getTrendingCategories/GetTrendingCategoriesFactory";
import { GetTrendingKeywordsFactory } from "../../application/useCases/getTrendingKeywords/GetTrendingKeywordsFactory";
import {
  AnalyticsValidationError,
  InvalidPeriodError,
} from "../../domain/exceptions/AnalyticsExceptions";

/**
 * Controller for handling analytics-related API requests
 */
export class AnalyticsController {
  /**
   * Get top recipients of kudos cards
   */
  async getTopRecipients(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const period = req.query.period as string;

      const useCase = GetTopRecipientsFactory.create();
      const result = await useCase.execute({ limit, period });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof InvalidPeriodError) {
        next(new AppError(error.message, 400));
      } else if (error instanceof AnalyticsValidationError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  /**
   * Get top teams receiving kudos cards
   */
  async getTopTeams(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const period = req.query.period as string;

      const useCase = GetTopTeamsFactory.create();
      const result = await useCase.execute({ limit, period });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof InvalidPeriodError) {
        next(new AppError(error.message, 400));
      } else if (error instanceof AnalyticsValidationError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  /**
   * Get trending categories for kudos cards
   */
  async getTrendingCategories(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const period = req.query.period as string;

      const useCase = GetTrendingCategoriesFactory.create();
      const result = await useCase.execute({ limit, period });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof InvalidPeriodError) {
        next(new AppError(error.message, 400));
      } else if (error instanceof AnalyticsValidationError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  /**
   * Get trending keywords from kudos card messages
   */
  async getTrendingKeywords(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const period = req.query.period as string;

      const useCase = GetTrendingKeywordsFactory.create();
      const result = await useCase.execute({ limit, period });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof InvalidPeriodError) {
        next(new AppError(error.message, 400));
      } else if (error instanceof AnalyticsValidationError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }
} 