import { Request, Response, NextFunction } from "express";
import { KudosCardUseCaseFactory } from "../../application/useCases/kudosCard/KudosCardUseCaseFactory";
import { AppError } from "../../../../shared/errors/AppError";
import {
  KudosCardNotFoundError,
  TeamNotFoundError,
  CategoryNotFoundError,
  KudosCardValidationError,
  InsufficientPermissionsError,
  UnauthorizedKudosCardAccessError,
} from "../../domain/exceptions/KudosCardExceptions";
import { RequestWithUser } from "../../../../shared/types/express";

/**
 * Controller for handling kudos card-related API requests
 */
export class KudosCardController {
  /**
   * Get all kudos cards with filtering
   */
  async getKudosCards(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const useCase = KudosCardUseCaseFactory.createGetKudosCardsUseCase();
      const kudosCards = await useCase.execute(req.query);

      res.status(200).json({
        status: "success",
        results: kudosCards.length,
        data: kudosCards,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a kudos card by ID
   */
  async getKudosCardById(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const useCase = KudosCardUseCaseFactory.createGetKudosCardByIdUseCase();
      const kudosCard = await useCase.execute(id);

      res.status(200).json({
        status: "success",
        data: kudosCard,
      });
    } catch (error) {
      if (error instanceof KudosCardNotFoundError) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  }

  /**
   * Create a new kudos card
   */
  async createKudosCard(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        return next(
          new AppError("You must be logged in to create a kudos card", 401)
        );
      }

      const useCase = KudosCardUseCaseFactory.createCreateKudosCardUseCase();
      const kudosCard = await useCase.execute(req.body, req.user.userId);

      res.status(201).json({
        status: "success",
        data: kudosCard,
      });
    } catch (error) {
      if (
        error instanceof TeamNotFoundError ||
        error instanceof CategoryNotFoundError
      ) {
        next(new AppError(error.message, 404));
      } else if (error instanceof InsufficientPermissionsError) {
        next(new AppError(error.message, 403));
      } else if (error instanceof KudosCardValidationError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  /**
   * Update an existing kudos card
   */
  async updateKudosCard(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        return next(
          new AppError("You must be logged in to update a kudos card", 401)
        );
      }

      const { id } = req.params;
      const useCase = KudosCardUseCaseFactory.createUpdateKudosCardUseCase();
      const kudosCard = await useCase.execute(id, req.body, req.user.userId);

      res.status(200).json({
        status: "success",
        data: kudosCard,
      });
    } catch (error) {
      if (
        error instanceof KudosCardNotFoundError ||
        error instanceof TeamNotFoundError ||
        error instanceof CategoryNotFoundError
      ) {
        next(new AppError(error.message, 404));
      } else if (
        error instanceof UnauthorizedKudosCardAccessError ||
        error instanceof InsufficientPermissionsError
      ) {
        next(new AppError(error.message, 403));
      } else if (error instanceof KudosCardValidationError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  /**
   * Delete a kudos card (soft delete)
   */
  async deleteKudosCard(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        return next(
          new AppError("You must be logged in to delete a kudos card", 401)
        );
      }

      const { id } = req.params;
      const useCase = KudosCardUseCaseFactory.createDeleteKudosCardUseCase();
      await useCase.execute(id, req.user.userId);

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      if (error instanceof KudosCardNotFoundError) {
        next(new AppError(error.message, 404));
      } else if (
        error instanceof UnauthorizedKudosCardAccessError ||
        error instanceof InsufficientPermissionsError
      ) {
        next(new AppError(error.message, 403));
      } else {
        next(error);
      }
    }
  }

  /**
   * Get top recipients
   */
  async getTopRecipients(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const period = req.query.period as string;

      const useCase = KudosCardUseCaseFactory.createGetTopRecipientsUseCase();
      const result = await useCase.execute(limit, period);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get top teams
   */
  async getTopTeams(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const period = req.query.period as string;

      const useCase = KudosCardUseCaseFactory.createGetTopTeamsUseCase();
      const result = await useCase.execute(limit, period);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get trending categories
   */
  async getTrendingCategories(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const period = req.query.period as string;

      const useCase =
        KudosCardUseCaseFactory.createGetTrendingCategoriesUseCase();
      const result = await useCase.execute(limit, period);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get trending keywords
   */
  async getTrendingKeywords(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const period = req.query.period as string;

      const useCase =
        KudosCardUseCaseFactory.createGetTrendingKeywordsUseCase();
      const result = await useCase.execute(limit, period);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
