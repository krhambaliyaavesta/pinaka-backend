import { Request, Response, NextFunction } from 'express';
import { GetPendingUsersFactory } from '../../application/useCases/getPendingUsers/GetPendingUsersFactory';
import { AdminModuleFactory } from '../../../../shared/factories/AdminModuleFactory';
import { AppError } from '../../../../shared/errors/AppError';
import { AdminError, NotAdminError } from '../../domain/exceptions/AdminExceptions';

export class AdminController {
  async getPendingUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserRole = req.user?.role;
      
      if (currentUserRole === undefined) {
        throw new AppError('Authentication required', 401);
      }

      const requestDto = {
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined
      };

      const useCase = GetPendingUsersFactory.create(AdminModuleFactory.getUserRepo());
      const result = await useCase.execute(requestDto, currentUserRole);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      if (error instanceof NotAdminError) {
        next(new AppError(error.message, 403));
      } else if (error instanceof AdminError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }
} 