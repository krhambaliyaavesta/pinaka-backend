import { PostgresService } from './PostgresService';
import { DatabaseServiceFactory } from './DatabaseServiceFactory';

/**
 * Service responsible for database initialization and connection testing.
 * This service is a lightweight wrapper that verifies database connectivity
 * but doesn't create tables (that's handled by src/scripts/initDb.ts).
 */
export class DBInitService {
  private static instance: DBInitService;
  private databaseService: PostgresService;
  private initialized: boolean = false;

  private constructor() {
    this.databaseService = DatabaseServiceFactory.getDatabase();
  }

  /**
   * Gets the singleton instance of the DBInitService.
   */
  public static getInstance(): DBInitService {
    if (!DBInitService.instance) {
      DBInitService.instance = new DBInitService();
    }
    return DBInitService.instance;
  }

  /**
   * Initializes and tests the database connection.
   * This doesn't create tables; it's just for connection verification.
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Test the connection by running a simple query
      await this.databaseService.query('SELECT 1');
      
      this.initialized = true;
      console.log('Database service initialized successfully');
      console.log('Using PostgreSQL database');
    } catch (error) {
      console.error('Failed to initialize database service', error);
      throw error;
    }
  }
} 