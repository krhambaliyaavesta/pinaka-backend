import { KudosCardRepo } from "../../modules/kudosCards/domain/repositories/KudosCardRepo";
import { KudosCardRepoFactory } from "../../modules/kudosCards/infrastructure/repositories/KudosCardRepoFactory";
import { DatabaseServiceFactory } from "../services/DatabaseServiceFactory";

/**
 * Factory that provides access to all repositories in the Kudos Cards module.
 */
export class KudosCardsModuleFactory {
  private static kudosCardRepo: KudosCardRepo | null = null;

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
    this.kudosCardRepo = null;
  }
}
