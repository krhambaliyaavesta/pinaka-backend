import { UserRepo } from '../../../domain/repositories/UserRepo';
import { GetUserInfoUseCase } from './GetUserInfoUseCase';

export class GetUserInfoFactory {
  static create(userRepo: UserRepo): GetUserInfoUseCase {
    return new GetUserInfoUseCase(userRepo);
  }
} 