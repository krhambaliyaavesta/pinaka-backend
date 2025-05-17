import { Router } from "express";
import { AnalyticsController } from "../controllers/AnalyticsController";
import { authMiddleware } from "../../../../shared/middlewares/authMiddleware";
import { validateAnalyticsRequest } from "../validation/analyticsValidation";

const router = Router();
const analyticsController = new AnalyticsController();

// Routes for analytics endpoints - all require authentication
router.get(
  "/top-recipients",
  authMiddleware,
  validateAnalyticsRequest,
  analyticsController.getTopRecipients
);

router.get(
  "/top-teams",
  authMiddleware,
  validateAnalyticsRequest,
  analyticsController.getTopTeams
);

router.get(
  "/trending-categories",
  authMiddleware,
  validateAnalyticsRequest,
  analyticsController.getTrendingCategories
);

router.get(
  "/trending-keywords",
  authMiddleware,
  validateAnalyticsRequest,
  analyticsController.getTrendingKeywords
);

export default router; 