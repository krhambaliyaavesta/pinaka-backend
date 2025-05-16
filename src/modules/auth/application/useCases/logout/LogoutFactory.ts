import { LogoutUseCase } from './LogoutUseCase';

export class LogoutFactory {
  static create(): LogoutUseCase {
    return new LogoutUseCase();
  }
} 