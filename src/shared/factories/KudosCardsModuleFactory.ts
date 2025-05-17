import { TeamRepository } from "../../modules/kudosCards/domain/repositories/TeamRepository";
import { CategoryRepository } from "../../modules/kudosCards/domain/repositories/CategoryRepository";
import { KudosCardRepository } from "../../modules/kudosCards/domain/repositories/KudosCardRepository";
import { TeamRepoFactory } from "../../modules/kudosCards/infrastructure/repositories/TeamRepoFactory";
import { CategoryRepoFactory } from "../../modules/kudosCards/infrastructure/repositories/CategoryRepoFactory";
import { KudosCardRepoFactory } from "../../modules/kudosCards/infrastructure/repositories/KudosCardRepoFactory";

/**
 * Factory that provides access to all repositories in the Kudos Cards module.
 */
export class KudosCardsModuleFactory {
  private static teamRepo: TeamRepository | null = null;
  private static categoryRepo: CategoryRepository | null = null;
  private static kudosCardRepo: KudosCardRepository | null = null;

  /**
   * Gets a singleton instance of the TeamRepository
   */
  static getTeamRepo(): TeamRepository {
    if (!this.teamRepo) {
      this.teamRepo = TeamRepoFactory.createTeamRepo();
    }
    return this.teamRepo;
  }

  /**
   * Gets a singleton instance of the CategoryRepository
   */
  static getCategoryRepo(): CategoryRepository {
    if (!this.categoryRepo) {
      this.categoryRepo = CategoryRepoFactory.createCategoryRepo();
    }
    return this.categoryRepo;
  }

  /**
   * Gets a singleton instance of the KudosCardRepository
   */
  static getKudosCardRepo(): KudosCardRepository {
    if (!this.kudosCardRepo) {
      this.kudosCardRepo = KudosCardRepoFactory.createKudosCardRepo();
    }
    return this.kudosCardRepo;
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
