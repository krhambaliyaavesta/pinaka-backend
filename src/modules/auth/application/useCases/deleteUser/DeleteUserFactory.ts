import { UserRepo } from '../../../domain/repositories/UserRepo';
import { DeleteUserUseCase } from './DeleteUserUseCase';

export class DeleteUserFactory {
  static create(userRepo: UserRepo): DeleteUserUseCase {
    return new DeleteUserUseCase(userRepo);
  }
} 