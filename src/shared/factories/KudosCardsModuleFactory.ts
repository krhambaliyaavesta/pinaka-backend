import { TeamRepo } from "../../modules/kudosCards/domain/repositories/TeamRepo";
import { CategoryRepo } from "../../modules/kudosCards/domain/repositories/CategoryRepo";
import { KudosCardRepo } from "../../modules/kudosCards/domain/repositories/KudosCardRepo";
import { TeamRepoFactory } from "../../modules/kudosCards/infrastructure/repositories/TeamRepoFactory";
import { CategoryRepoFactory } from "../../modules/kudosCards/infrastructure/repositories/CategoryRepoFactory";
import { KudosCardRepoFactory } from "../../modules/kudosCards/infrastructure/repositories/KudosCardRepoFactory";
import { PostgresService } from "../services/PostgresService";
import { DatabaseServiceFactory } from "../services/DatabaseServiceFactory";

/**
 * Factory that provides access to all repositories in the Kudos Cards module.
 */
export class KudosCardsModuleFactory {
  private static teamRepo: TeamRepo | null = null;
  private static categoryRepo: CategoryRepo | null = null;
  private static kudosCardRepo: KudosCardRepo | null = null;

  /**
   * Gets a singleton instance of the TeamRepo
   */
  static getTeamRepo(): TeamRepo {
    if (!this.teamRepo) {
      const dbService = DatabaseServiceFactory.getDatabase();
      this.teamRepo = TeamRepoFactory.getRepo(dbService);
    }
    return this.teamRepo as TeamRepo;
  }

  /**
   * Gets a singleton instance of the CategoryRepo
   */
  static getCategoryRepo(): CategoryRepo {
    if (!this.categoryRepo) {
      const dbService = DatabaseServiceFactory.getDatabase();
      this.categoryRepo = CategoryRepoFactory.getRepo(dbService);
    }
    return this.categoryRepo as CategoryRepo;
  }

  /**
   * Gets a singleton instance of the KudosCardRepo
   */
  static getKudosCardRepo(): KudosCardRepo {
    if (!this.kudosCardRepo) {
      const dbService = DatabaseServiceFactory.getDatabase();
      this.kudosCardRepo = KudosCardRepoFactory.getRepo(dbService);
    }
    return this.kudosCardRepo as KudosCardRepo;
  }

  /**
   * Resets all repository instances (mainly for testing)
   */
  static reset(): void {
    this.teamRepo = null;
    this.categoryRepo = null;
    this.kudosCardRepo = null;
  }
}
