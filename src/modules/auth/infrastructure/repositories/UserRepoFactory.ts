import { UserRepo } from '../../domain/repositories/UserRepo';
import { UserRepoPgImpl } from './UserRepoPgImpl';
import { DatabaseServiceFactory } from '../../../../shared/services/DatabaseServiceFactory';

/**
 * Factory for creating UserRepo instances.
 * Currently configured to use PostgreSQL implementation.
 */
export class UserRepoFactory {
  /**
   * Creates and returns a new UserRepo implementation
   * based on PostgreSQL database.
   */
  public static createUserRepo(): UserRepo {
    const dbService = DatabaseServiceFactory.getDatabase();
    return new UserRepoPgImpl(dbService);
  }
}