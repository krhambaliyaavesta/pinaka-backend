import { PostgresService } from './PostgresService';

export class DatabaseServiceFactory {

  public static getDatabase(): PostgresService {
    return PostgresService.getInstance();
  }
} 