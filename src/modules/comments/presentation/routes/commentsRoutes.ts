import { Router } from "express";
import { CommentController } from "../controllers/CommentController";
import { authMiddleware } from "../../../../shared/middlewares/authMiddleware";
import { KudosCardRepoFactory } from "../../../kudosCards/infrastructure/repositories/KudosCardRepoFactory";
import { PostgresService } from "../../../../shared/services/PostgresService";

const router = Router();

// Get the database service
const dbService = PostgresService.getInstance();
// Use the KudosCardRepoFactory to create a proper repository instance
const kudosCardRepo = KudosCardRepoFactory.getRepo(dbService);
const commentController = new CommentController(kudosCardRepo);

// Public routes - no auth required
router.get(
  "/kudos-cards/:kudosCardId",
  commentController.getComments.bind(commentController)
);

// Protected routes - auth required
router.post(
  "/",
  authMiddleware,
  commentController.addComment.bind(commentController)
);
router.put(
  "/:commentId",
  authMiddleware,
  commentController.updateComment.bind(commentController)
);
router.delete(
  "/:commentId",
  authMiddleware,
  commentController.deleteComment.bind(commentController)
);

export default router;
