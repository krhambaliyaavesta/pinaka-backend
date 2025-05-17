import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../../shared/errors/AppError";
import {
  KudosCardNotFoundError,
  KudosCardValidationError,
  InsufficientPermissionsError,
  UnauthorizedKudosCardAccessError,
} from "../../domain/exceptions/KudosCardExceptions";
import { RequestWithUser } from "../../../../shared/types/express";
import { CreateKudosCardFactory } from "../../application/useCases/createKudosCard/CreateKudosCardFactory";
import { GetKudosCardByIdFactory } from "../../application/useCases/getKudosCardById/GetKudosCardByIdFactory";
import { GetKudosCardsFactory } from "../../application/useCases/getKudosCards/GetKudosCardsFactory";
import { UpdateKudosCardFactory } from "../../application/useCases/updateKudosCard/UpdateKudosCardFactory";
import { DeleteKudosCardFactory } from "../../application/useCases/deleteKudosCard/DeleteKudosCardFactory";
import { TeamNotFoundError } from "../../../teams/domain/exceptions/TeamExceptions";
import { CategoryNotFoundError } from "../../../categories/domain/exceptions/CategoryExceptions";

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
      const { useCase } = GetKudosCardsFactory.create();
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
      
      // Create use case through factory
      const {useCase} = GetKudosCardByIdFactory.create();
      
      // Execute use case with string ID
      const result = await useCase.execute(id);
      
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
      
      // Create use case through factory
      const { useCase } = CreateKudosCardFactory.create();
      
      // Execute use case
      const result = await useCase.execute(req.body, userId);
      
      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof KudosCardValidationError) {
        next(new AppError(`Validation error: ${error.message}`, 400));
      } else if (error instanceof TeamNotFoundError) {
        next(new AppError(`Team not found: ${error.message}`, 404));
      } else if (error instanceof CategoryNotFoundError) {
        next(new AppError(`Category not found: ${error.message}`, 404));
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
      const { useCase } = UpdateKudosCardFactory.create();
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
      const { useCase } = DeleteKudosCardFactory.create();
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
}