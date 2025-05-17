import { Router } from "express";
import { TeamController } from "../controllers/TeamController";
import {
  validateTeamId,
  validateCreateTeam,
  validateUpdateTeam,
} from "../validation/teamValidation";
import { authMiddleware } from "../../../../shared/middlewares/authMiddleware";
import { adminMiddleware } from "../../../../shared/middlewares/adminMiddleware";

const router = Router();
const teamController = new TeamController();

// Public routes (available to all authenticated users)
router.get("/", authMiddleware, teamController.getAllTeams);
router.get("/:id", authMiddleware, validateTeamId, teamController.getTeamById);

// Admin-only routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateTeam,
  teamController.createTeam
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateTeamId,
  validateUpdateTeam,
  teamController.updateTeam
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateTeamId,
  teamController.deleteTeam
);

export default router;