import { Request, Response, NextFunction } from "express";
import { GetPendingUsersFactory } from "../../application/useCases/getPendingUsers/GetPendingUsersFactory";
import { UpdateUserFactory } from "../../application/useCases/updateUser/UpdateUserFactory";
import { DeleteUserFactory } from "../../application/useCases/deleteUser/DeleteUserFactory";
import { AdminModuleFactory } from "../../../../shared/factories/AdminModuleFactory";
import { AuthModuleFactory } from "../../../../shared/factories/AuthModuleFactory";
import { AppError } from "../../../../shared/errors/AppError";
import {
  AdminError,
  NotAdminError,
  UnauthorizedRoleError,
} from "../../domain/exceptions/AdminExceptions";
import {
  AuthError,
  UserNotFoundError,
  UnauthorizedActionError,
} from "../../../auth/domain/exceptions/AuthExceptions";
import { SearchUsersFactory } from "../../application/useCases/searchUsers/SearchUsersFactory";
import { ApprovalStatus } from "../../../auth/domain/entities/UserTypes";

export class AdminController {
  async getPendingUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUserRole = req.user?.role;

      if (currentUserRole === undefined) {
        throw new AppError("Authentication required", 401);
      }

      const requestDto = {
        limit: req.query.limit
          ? parseInt(req.query.limit as string, 10)
          : undefined,
        offset: req.query.offset
          ? parseInt(req.query.offset as string, 10)
          : undefined,
      };

      const useCase = GetPendingUsersFactory.create(
        AdminModuleFactory.getUserRepo()
      );
      const result = await useCase.execute(requestDto, currentUserRole);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (
        error instanceof NotAdminError ||
        error instanceof UnauthorizedRoleError
      ) {
        next(new AppError(error.message, 403));
      } else if (error instanceof AdminError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUserId = req.user?.userId;
      const currentUserRole = req.user?.role;
      const targetUserId = req.params.userId;

      if (!currentUserId || currentUserRole === undefined) {
        throw new AppError("Authentication required", 401);
      }

      const useCase = UpdateUserFactory.create(AuthModuleFactory.getUserRepo());

      // Combine the userId from the route params with the data from the request body
      const requestDto = {
        userId: targetUserId,
        ...req.body,
      };

      const result = await useCase.execute(
        requestDto,
        currentUserId,
        currentUserRole
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        next(new AppError(error.message, 404));
      } else if (error instanceof UnauthorizedActionError) {
        next(new AppError(error.message, 403));
      } else if (error instanceof AuthError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUserId = req.user?.userId;
      const currentUserRole = req.user?.role;
      const targetUserId = req.params.userId;

      if (!currentUserId || currentUserRole === undefined) {
        throw new AppError("Authentication required", 401);
      }

      const useCase = DeleteUserFactory.create(AuthModuleFactory.getUserRepo());

      const requestDto = {
        userId: targetUserId,
      };

      const result = await useCase.execute(
        requestDto,
        currentUserId,
        currentUserRole
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        next(new AppError(error.message, 404));
      } else if (error instanceof UnauthorizedActionError) {
        next(new AppError(error.message, 403));
      } else if (error instanceof AuthError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  async searchUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUserRole = req.user?.role;

      if (currentUserRole === undefined) {
        throw new AppError("Authentication required", 401);
      }

      // Prepare the request DTO from query parameters
      const requestDto = {
        query: req.query.query as string | undefined,
        role: req.query.role
          ? parseInt(req.query.role as string, 10)
          : undefined,
        approvalStatus: req.query.approvalStatus as ApprovalStatus | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
      };

      const useCase = SearchUsersFactory.create(
        AdminModuleFactory.getUserRepo()
      );
      const result = await useCase.execute(requestDto, currentUserRole);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (
        error instanceof NotAdminError ||
        error instanceof UnauthorizedRoleError
      ) {
        next(new AppError(error.message, 403));
      } else if (error instanceof AdminError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }
}
