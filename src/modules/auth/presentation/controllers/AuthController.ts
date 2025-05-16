import { Request, Response, NextFunction } from 'express';
import { SignUpFactory } from '../../application/useCases/signUp/SignUpFactory';
import { SignInFactory } from '../../application/useCases/signIn/SignInFactory';
import { GetUserInfoFactory } from '../../application/useCases/getUserInfo/GetUserInfoFactory';
import { LogoutFactory } from '../../application/useCases/logout/LogoutFactory';
import { AuthModuleFactory } from '../../../../shared/factories/AuthModuleFactory';
import { AppError } from '../../../../shared/errors/AppError';
import { 
  AuthError, 
  EmailAlreadyExistsError, 
  InvalidCredentialsError, 
  UserNotFoundError 
} from '../../domain/exceptions/AuthExceptions';

export class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {

  
    try {
      const useCase = SignUpFactory.create(AuthModuleFactory.getUserRepo());
      const result = await useCase.execute(req.body);
      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        next(new AppError(error.message, 409));
      } else if (error instanceof AuthError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = SignInFactory.create(AuthModuleFactory.getUserRepo());
      const result = await useCase.execute(req.body);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        next(new AppError(error.message, 401));
      } else {
        next(error);
      }
    }
  }

  async getUserInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // userId comes from the authenticated user in req.user
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const useCase = GetUserInfoFactory.create(AuthModuleFactory.getUserRepo());
      const result = await useCase.execute({ userId });
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!userId || !token) {
        throw new AppError('Authentication required', 401);
      }
      
      const useCase = LogoutFactory.create();
      const result = await useCase.execute({
        userId,
        token
      });
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
} 