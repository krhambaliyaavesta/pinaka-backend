import { PostgresService } from './PostgresService';

/**
 * Factory class that provides database service instances.
 * Currently configured to use PostgreSQL exclusively.
 */
export class DatabaseServiceFactory {
  /**
   * Returns a singleton instance of the PostgreSQL database service.
   */
  public static getDatabase(): PostgresService {
    return PostgresService.getInstance();
  }
} 