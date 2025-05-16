import { UserRepo } from '../../modules/auth/domain/repositories/UserRepo';
import { UserRepoFactory } from '../../modules/auth/infrastructure/repositories/UserRepoFactory';

export class AuthModuleFactory {
  private static userRepo: UserRepo | null = null;

  static getUserRepo(): UserRepo {
    if (!this.userRepo) {
      this.userRepo = UserRepoFactory.createUserRepo();
    }
    return this.userRepo;
  }

  // For testing purposes
  static reset(): void {
    this.userRepo = null;
  }
} 