import { Request, Response, NextFunction } from "express";
import { TeamUseCaseFactory } from "../../application/useCases/TeamUseCaseFactory";
import { AppError } from "../../../../shared/errors/AppError";
import {
  TeamNotFoundError,
  TeamValidationError
} from "../../domain/exceptions/TeamExceptions";

/**
 * Controller for handling team-related API requests
 */
export class TeamController {
  /**
   * Get all teams
   */
  async getAllTeams(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const useCase = TeamUseCaseFactory.createGetAllTeamsUseCase();
      const teams = await useCase.execute();

      res.status(200).json({
        status: "success",
        data: teams,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a team by ID
   */
  async getTeamById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const useCase = TeamUseCaseFactory.createGetTeamByIdUseCase();
      const team = await useCase.execute(id);

      res.status(200).json({
        status: "success",
        data: team,
      });
    } catch (error) {
      if (error instanceof TeamNotFoundError) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  }

  /**
   * Create a new team
   */
  async createTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const useCase = TeamUseCaseFactory.createCreateTeamUseCase();
      const team = await useCase.execute(req.body);

      res.status(201).json({
        status: "success",
        data: team,
      });
    } catch (error) {
      if (error instanceof TeamValidationError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  /**
   * Update an existing team
   */
  async updateTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const useCase = TeamUseCaseFactory.createUpdateTeamUseCase();
      const team = await useCase.execute(id, req.body);

      res.status(200).json({
        status: "success",
        data: team,
      });
    } catch (error) {
      if (error instanceof TeamNotFoundError) {
        next(new AppError(error.message, 404));
      } else if (error instanceof TeamValidationError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  /**
   * Delete a team
   */
  async deleteTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const useCase = TeamUseCaseFactory.createDeleteTeamUseCase();
      await useCase.execute(id);

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      if (error instanceof TeamNotFoundError) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  }
} 