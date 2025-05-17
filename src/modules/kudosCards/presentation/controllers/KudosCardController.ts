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
import { PostgresService } from "../../../../shared/services/PostgresService";
import { KudosCardRepoFactory } from "../../infrastructure/repositories/KudosCardRepoFactory";
import { TeamRepoFactory } from "../../infrastructure/repositories/TeamRepoFactory";
import { CategoryRepoFactory } from "../../infrastructure/repositories/CategoryRepoFactory";
import { UserRepoFactory } from "../../../auth/infrastructure/repositories/UserRepoFactory";
import { CreateKudosCardFactory } from "../../application/useCases/createKudosCard/CreateKudosCardFactory";
import { GetKudosCardByIdFactory } from "../../application/useCases/getKudosCardById/GetKudosCardByIdFactory";
import { DatabaseServiceFactory } from "../../../../shared/services/DatabaseServiceFactory";

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
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // Get database service
      const dbService = DatabaseServiceFactory.getDatabase();
      
      // Get repositories
      const kudosCardRepo = KudosCardRepoFactory.getRepo(dbService);
      const teamRepo = TeamRepoFactory.getRepo(dbService);
      const categoryRepo = CategoryRepoFactory.getRepo(dbService);
      const userRepo = UserRepoFactory.createUserRepo();
      
      // Create use case
      const getKudosCardByIdUseCase = GetKudosCardByIdFactory.create(
        kudosCardRepo,
        teamRepo,
        categoryRepo,
        userRepo
      );
      
      // Execute use case
      const result = await getKudosCardByIdUseCase.execute({ id });
      
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof KudosCardNotFoundError) {
        next(new AppError(`Kudos card not found: ${error.message}`, 404));
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
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Authentication required", 401);
      }

      // Get database service
      const dbService = DatabaseServiceFactory.getDatabase();
      
      // Get repositories
      const kudosCardRepo = KudosCardRepoFactory.getRepo(dbService);
      const teamRepo = TeamRepoFactory.getRepo(dbService);
      const categoryRepo = CategoryRepoFactory.getRepo(dbService);
      const userRepo = UserRepoFactory.createUserRepo();
      
      // Create use case
      const createKudosCardUseCase = CreateKudosCardFactory.create(
        kudosCardRepo,
        teamRepo,
        categoryRepo,
        userRepo
      );
      
      // Execute use case
      const result = await createKudosCardUseCase.execute(req.body, userId);
      
      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof TeamNotFoundError) {
        next(new AppError(`Team not found: ${error.message}`, 404));
      } else if (error instanceof CategoryNotFoundError) {
        next(new AppError(`Category not found: ${error.message}`, 404));
      } else if (error instanceof InsufficientPermissionsError) {
        next(new AppError(`Insufficient permissions: ${error.message}`, 403));
      } else if (error instanceof KudosCardValidationError) {
        next(new AppError(`Validation error: ${error.message}`, 400));
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
