import { Router } from "express";
import { KudosCardController } from "../controllers/KudosCardController";
import {
  validateCreateKudosCard,
  validateUpdateKudosCard,
  validateKudosCardFilters,
} from "../validation/kudosCardValidation";
import { authMiddleware } from "../../../../shared/middlewares/authMiddleware";
import { leadMiddleware } from "../../../../shared/middlewares/leadMiddleware";

const router = Router();
const kudosCardController = new KudosCardController();

// Routes available to all authenticated users (including Team Members)
router.get(
  "/",
  authMiddleware,
  validateKudosCardFilters,
  kudosCardController.getKudosCards
);
router.get("/:id", authMiddleware, kudosCardController.getById);

// Routes only available to Tech Leads and Admins
router.post(
  "/",
  authMiddleware,
  leadMiddleware,
  validateCreateKudosCard,
  kudosCardController.createKudosCard
);
router.put(
  "/:id",
  authMiddleware,
  leadMiddleware,
  validateUpdateKudosCard,
  kudosCardController.updateKudosCard
);
router.delete(
  "/:id",
  authMiddleware,
  leadMiddleware,
  kudosCardController.deleteKudosCard
);

// Analytics routes
router.get(
  "/analytics/top-recipients",
  authMiddleware,
  kudosCardController.getTopRecipients
);
router.get(
  "/analytics/top-teams",
  authMiddleware,
  kudosCardController.getTopTeams
);
router.get(
  "/analytics/trending-categories",
  authMiddleware,
  kudosCardController.getTrendingCategories
);
router.get(
  "/analytics/trending-keywords",
  authMiddleware,
  kudosCardController.getTrendingKeywords
);

export default router;
