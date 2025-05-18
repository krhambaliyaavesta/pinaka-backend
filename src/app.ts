import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { errorHandler } from "./shared/middlewares/errorHandler";
import { DBInitService } from "./shared/services/DBInitService";

// Import routes
import authRoutes from "./modules/auth/presentation/routes/authRoutes";
import adminRoutes from "./modules/admin/presentation/routes/adminRoutes";
import kudosCardRoutes from "./modules/kudosCards/presentation/routes/kudosCardRoutes";
import teamRoutes from "./modules/teams/presentation/routes/teamRoutes";
import categoryRoutes from "./modules/categories/presentation/routes/categoryRoutes";
import analyticsRoutes from "./modules/analytics/presentation/routes/analyticsRoutes";
import reactionRoutes from "./modules/reactions/presentation/routes/reactionRoutes";
import commentRoutes from "./modules/comments/presentation/routes/commentsRoutes";
const app: Application = express();

// Initialize database service
const dbInitService = DBInitService.getInstance();
dbInitService
  .initialize()
  .catch((err) =>
    console.error("Database service initialization failed:", err)
  );

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kudos-cards", kudosCardRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/comments", commentRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
