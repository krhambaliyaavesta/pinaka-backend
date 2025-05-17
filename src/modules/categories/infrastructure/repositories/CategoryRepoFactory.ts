import { CategoryRepo } from "../../domain/repositories/CategoryRepo";
import { CategoryRepoPgImpl } from "./CategoryRepoPgImpl";
import { PostgresService } from "../../../../shared/services/PostgresService";

/**
 * Factory for creating CategoryRepo instances
 */
export class CategoryRepoFactory {
  /**
   * Create and return a CategoryRepo implementation
   * @returns CategoryRepo implementation
   */
  static createCategoryRepo(): CategoryRepo {
    const dbService = PostgresService.getInstance();
    return new CategoryRepoPgImpl(dbService);
  }
} 