import { Request } from "express";

/**
 * Extends the Express Request type to include user information
 * from authentication middleware
 */
export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    email: string;
    role: number;
  };
}
