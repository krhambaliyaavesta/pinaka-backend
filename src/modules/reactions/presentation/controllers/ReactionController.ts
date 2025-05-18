import { Request, Response } from "express";
import { AddReactionFactory } from "../../application/useCases/addReaction/AddReactionFactory";
import { GetReactionsFactory } from "../../application/useCases/getReactions/GetReactionsFactory";
import { RemoveReactionFactory } from "../../application/useCases/removeReaction/RemoveReactionFactory";
import { ReactionRepoFactory } from "../../infrastructure/repositories/ReactionRepoFactory";
import { validateRequest } from "../../../../shared/utils/validateRequest";
import {
  addReactionSchema,
  getReactionsSchema,
  removeReactionSchema,
} from "../validation/reactionValidation";

// Import KudosCardRepo directly instead of factory
import { KudosCardRepo } from "../../../kudosCards/domain/repositories/KudosCardRepo";

// Don't create a custom interface since the declaration in authMiddleware.ts
// already extends the Express.Request interface
// We'll just use the standard Request type

export class ReactionController {
  constructor(private kudosCardRepo: KudosCardRepo) {}

  async addReaction(req: Request, res: Response) {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      // Validate request
      const validationResult = validateRequest(req.body, addReactionSchema);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: validationResult.error.message,
        });
      }

      const reactionRepo = ReactionRepoFactory.createReactionRepo();
      const { useCase } = AddReactionFactory.create(
        reactionRepo,
        this.kudosCardRepo
      );

      const result = await useCase.execute(
        {
          kudosCardId: req.body.kudosCardId,
          type: req.body.type,
        },
        req.user.userId
      );

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error adding reaction:", error);

      if (
        error.name === "KudosCardNotFoundError" ||
        error.name === "DuplicateReactionError"
      ) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to add reaction",
      });
    }
  }

  async getReactions(req: Request, res: Response) {
    try {
      // Validate request
      const validationResult = validateRequest(req.params, getReactionsSchema);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: validationResult.error.message,
        });
      }

      const reactionRepo = ReactionRepoFactory.createReactionRepo();
      const { useCase } = GetReactionsFactory.create(
        reactionRepo,
        this.kudosCardRepo
      );

      const result = await useCase.execute({
        kudosCardId: req.params.kudosCardId,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error getting reactions:", error);

      if (error.name === "KudosCardNotFoundError") {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to get reactions",
      });
    }
  }

  async removeReaction(req: Request, res: Response) {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      // Validate request
      const validationResult = validateRequest(
        req.params,
        removeReactionSchema
      );
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: validationResult.error.message,
        });
      }

      const reactionRepo = ReactionRepoFactory.createReactionRepo();
      const { useCase } = RemoveReactionFactory.create(reactionRepo);

      const result = await useCase.execute(
        {
          reactionId: req.params.reactionId,
        },
        req.user.userId
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error removing reaction:", error);

      if (
        error.name === "ReactionNotFoundError" ||
        error.name === "UnauthorizedReactionError"
      ) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to remove reaction",
      });
    }
  }
}
