import { UserRepo } from '../../../domain/repositories/UserRepo';
import { SignInUseCase } from './SignInUseCase';

export class SignInFactory {
  static create(userRepo: UserRepo): SignInUseCase {
    return new SignInUseCase(userRepo);
  }
} 