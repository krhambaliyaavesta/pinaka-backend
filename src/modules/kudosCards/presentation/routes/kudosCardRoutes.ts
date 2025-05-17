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

export default router;
