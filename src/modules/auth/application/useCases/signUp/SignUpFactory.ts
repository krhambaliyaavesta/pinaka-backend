import { UserRepo } from '../../../domain/repositories/UserRepo';
import { SignUpUseCase } from './SignUpUseCase';

export class SignUpFactory {
  static create(userRepo: UserRepo): SignUpUseCase {
    return new SignUpUseCase(userRepo);
  }
} 