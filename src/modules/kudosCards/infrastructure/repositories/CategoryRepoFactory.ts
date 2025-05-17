import { PostgresService } from "../../../../shared/services/PostgresService";
import { CategoryRepo } from "../../domain/repositories/CategoryRepo";
import { CategoryRepoPgImpl } from "./CategoryRepoPgImpl";

/**
 * Factory for creating CategoryRepo implementations
 */
export class CategoryRepoFactory {
  /**
   * Create a PostgreSQL implementation of CategoryRepo
   * @param dbService The database service to use
   * @returns CategoryRepo implementation
   */
  static getRepo(dbService: PostgresService): CategoryRepo {
    return new CategoryRepoPgImpl(dbService);
  }
}
