import { CategoryRepo } from "../../modules/categories/domain/repositories/CategoryRepo";
import { CategoryRepoFactory } from "../../modules/categories/infrastructure/repositories/CategoryRepoFactory";
import { DatabaseServiceFactory } from "../services/DatabaseServiceFactory";

/**
 * Factory that provides access to all repositories in the Kudos Cards module.
 */
export class CategoryModuleFactory {
  private static categoryRepo: CategoryRepo | null = null;



  /**
   * Gets a singleton instance of the CategoryRepo
   */
  static getCategoryRepo(): CategoryRepo {
    if (!this.categoryRepo) {
      const dbService = DatabaseServiceFactory.getDatabase();
      this.categoryRepo = CategoryRepoFactory.createCategoryRepo();
    }
    return this.categoryRepo as CategoryRepo;
  }

  /**
   * Resets all repository instances (mainly for testing)
   */
  static reset(): void {
    this.categoryRepo = null;
  }
}
