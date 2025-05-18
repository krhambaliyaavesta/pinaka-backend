import { Router } from "express";
import { ReactionController } from "../controllers/ReactionController";
import { authMiddleware } from "../../../../shared/middlewares/authMiddleware";
import { KudosCardRepoFactory } from "../../../kudosCards/infrastructure/repositories/KudosCardRepoFactory";
import { PostgresService } from "../../../../shared/services/PostgresService";

const router = Router();

// Get the database service
const dbService = PostgresService.getInstance();
// Use the KudosCardRepoFactory to create a proper repository instance
const kudosCardRepo = KudosCardRepoFactory.getRepo(dbService);
const reactionController = new ReactionController(kudosCardRepo);

// Public routes - no auth required
router.get(
  "/kudos-cards/:kudosCardId",
  reactionController.getReactions.bind(reactionController)
);

// Protected routes - auth required
router.post(
  "/",
  authMiddleware,
  reactionController.addReaction.bind(reactionController)
);
router.delete(
  "/:reactionId",
  authMiddleware,
  reactionController.removeReaction.bind(reactionController)
);

export default router;
