import { Pool, PoolClient, QueryResult } from 'pg';
import { config } from '../../config';

/**
 * Service for PostgreSQL database operations.
 * Implemented as a singleton to ensure a single connection pool per application.
 */
export class PostgresService {
  private static instance: PostgresService;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      max: 10,
      idleTimeoutMillis: 30000,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Log errors from the pool
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  /**
   * Gets the singleton instance of the PostgresService.
   */
  public static getInstance(): PostgresService {
    if (!PostgresService.instance) {
      PostgresService.instance = new PostgresService();
    }
    return PostgresService.instance;
  }

  /**
   * Executes a SQL query with optional parameters.
   * Automatically converts MySQL-style placeholders (?) to PostgreSQL-style ($1, $2, etc.)
   * 
   * @param sql The SQL query to execute
   * @param params Optional parameters for the query
   * @returns Promise resolving to [rows, fields]
   */
  async query(sql: string, params?: any[]): Promise<[any[], any[]]> {
    // Convert MySQL-style placeholders (?) to PostgreSQL-style ($1, $2, etc.)
    if (params && params.length > 0) {
      let paramIndex = 0;
      sql = sql.replace(/\?/g, () => `$${++paramIndex}`);
    }
    
    const result: QueryResult = await this.pool.query(sql, params);
    return [result.rows, result.fields || []];
  }

  /**
   * Gets a dedicated connection from the pool.
   * Remember to release the connection when done.
   */
  async getConnection(): Promise<PoolClient> {
    return this.pool.connect();
  }

  /**
   * Executes operations within a transaction.
   * Automatically handles BEGIN, COMMIT, and ROLLBACK.
   * 
   * @param callback Function that performs database operations
   * @returns Result of the callback function
   */
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
} 