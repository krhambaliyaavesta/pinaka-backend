import { Request, Response } from "express";
import { AddCommentFactory } from "../../application/useCases/addComment/AddCommentFactory";
import { CommentRepoFactory } from "../../infrastructure/repositories/CommentRepoFactory";
import { validateRequest } from "../../../../shared/utils/validateRequest";
import {
  addCommentSchema,
  updateCommentSchema,
  getCommentsSchema,
} from "../validation/commentValidation";

// Import KudosCardRepo directly instead of factory
import { KudosCardRepo } from "../../../kudosCards/domain/repositories/KudosCardRepo";
import {
  CommentNotFoundError,
  KudosCardNotFoundError,
  UnauthorizedCommentAccessError,
} from "../../domain/exceptions/CommentExceptions";

export class CommentController {
  constructor(private kudosCardRepo: KudosCardRepo) {}

  async addComment(req: Request, res: Response) {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      // Validate request
      const validationResult = validateRequest(req.body, addCommentSchema);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: validationResult.error.message,
        });
      }

      const commentRepo = CommentRepoFactory.createCommentRepo();
      const { useCase } = AddCommentFactory.create(
        commentRepo,
        this.kudosCardRepo
      );

      const result = await useCase.execute(
        {
          kudosCardId: req.body.kudosCardId,
          content: req.body.content,
        },
        req.user.userId
      );

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error adding comment:", error);

      if (error.name === "KudosCardNotFoundError") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to add comment",
      });
    }
  }

  async getComments(req: Request, res: Response) {
    try {
      // Validate request
      const validationResult = validateRequest(req.params, getCommentsSchema);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: validationResult.error.message,
        });
      }

      const commentRepo = CommentRepoFactory.createCommentRepo();

      // Check if kudos card exists
      const kudosCard = await this.kudosCardRepo.findById(
        req.params.kudosCardId
      );
      if (!kudosCard) {
        throw new KudosCardNotFoundError(req.params.kudosCardId);
      }

      // Get comments
      const comments = await commentRepo.findByKudosCardId(
        req.params.kudosCardId,
        false // don't include deleted comments
      );

      // Get total comments count
      const totalComments = await commentRepo.getCommentCountByKudosCardId(
        req.params.kudosCardId
      );

      return res.status(200).json({
        success: true,
        data: {
          comments: comments.map((comment) => ({
            id: comment.id,
            kudosCardId: comment.kudosCardId,
            userId: comment.userId,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
          })),
          totalComments,
        },
      });
    } catch (error: any) {
      console.error("Error getting comments:", error);

      if (error.name === "KudosCardNotFoundError") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to get comments",
      });
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      // Validate request
      const validationResult = validateRequest(req.body, updateCommentSchema);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: validationResult.error.message,
        });
      }

      const commentRepo = CommentRepoFactory.createCommentRepo();

      // Check if comment exists
      const comment = await commentRepo.findById(req.params.commentId);
      if (!comment) {
        throw new CommentNotFoundError(req.params.commentId);
      }

      // Check if user is authorized to update the comment
      if (comment.userId !== req.user.userId) {
        throw new UnauthorizedCommentAccessError(
          req.user.userId,
          req.params.commentId
        );
      }

      // Update the comment
      const updatedComment = await commentRepo.update(
        req.params.commentId,
        req.body.content
      );

      // Handle case where update fails
      if (!updatedComment) {
        return res.status(404).json({
          success: false,
          error: `Comment with ID ${req.params.commentId} not found or couldn't be updated`,
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          comment: {
            id: updatedComment.id,
            kudosCardId: updatedComment.kudosCardId,
            userId: updatedComment.userId,
            content: updatedComment.content,
            createdAt: updatedComment.createdAt.toISOString(),
            updatedAt: updatedComment.updatedAt.toISOString(),
          },
        },
      });
    } catch (error: any) {
      console.error("Error updating comment:", error);

      if (error.name === "CommentNotFoundError") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.name === "UnauthorizedCommentAccessError") {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to update comment",
      });
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      const commentRepo = CommentRepoFactory.createCommentRepo();

      // Check if comment exists
      const comment = await commentRepo.findById(req.params.commentId);
      if (!comment) {
        throw new CommentNotFoundError(req.params.commentId);
      }

      // Check if user is authorized to delete the comment
      if (comment.userId !== req.user.userId) {
        throw new UnauthorizedCommentAccessError(
          req.user.userId,
          req.params.commentId
        );
      }

      // Soft delete the comment
      const deleted = await commentRepo.softDelete(req.params.commentId);

      return res.status(200).json({
        success: true,
        data: {
          deleted,
        },
      });
    } catch (error: any) {
      console.error("Error deleting comment:", error);

      if (error.name === "CommentNotFoundError") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.name === "UnauthorizedCommentAccessError") {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to delete comment",
      });
    }
  }
}
