import { CategoryRepository } from "../../domain/repositories/CategoryRepository";
import { CategoryRepoPgImpl } from "./CategoryRepoPgImpl";
import { DatabaseServiceFactory } from "../../../../shared/services/DatabaseServiceFactory";

/**
 * Factory for creating CategoryRepository instances.
 * Currently configured to use PostgreSQL implementation.
 */
export class CategoryRepoFactory {
  /**
   * Creates and returns a new CategoryRepository implementation
   * based on PostgreSQL database.
   */
  public static createCategoryRepo(): CategoryRepository {
    const dbService = DatabaseServiceFactory.getDatabase();
    return new CategoryRepoPgImpl(dbService);
  }
}
