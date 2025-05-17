import { UserRepo } from '../../../../auth/domain/repositories/UserRepo';
import { UpdateUserUseCase } from './UpdateUserUseCase';
 
export class UpdateUserFactory {
  static create(userRepo: UserRepo): UpdateUserUseCase {
    return new UpdateUserUseCase(userRepo);
  }
} 