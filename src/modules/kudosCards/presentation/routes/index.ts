import { Router } from "express";
import teamRoutes from "./teamRoutes";
import categoryRoutes from "./categoryRoutes";
import kudosCardRoutes from "./kudosCardRoutes";

const router = Router();

// Register all routes
router.use("/teams", teamRoutes);
router.use("/categories", categoryRoutes);
router.use("/kudos-cards", kudosCardRoutes);

export default router;
