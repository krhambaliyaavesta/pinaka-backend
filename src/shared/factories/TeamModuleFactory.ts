import { TeamRepo } from "../../modules/teams/domain/repositories/TeamRepo";
import { TeamRepoFactory } from "../../modules/teams/infrastructure/repositories/TeamRepoFactory";
import { DatabaseServiceFactory } from "../services/DatabaseServiceFactory";

/**
 * Factory that provides access to all repositories in the Kudos Cards module.
 */
export class TeamModuleFactory {
  private static teamRepo: TeamRepo | null = null;

  /**
   * Gets a singleton instance of the TeamRepo
   */
  static getTeamRepo(): TeamRepo {
    if (!this.teamRepo) {
      const dbService = DatabaseServiceFactory.getDatabase();
      this.teamRepo = TeamRepoFactory.createTeamRepo();
    }
    return this.teamRepo as TeamRepo;
  }
  /**
   * Resets all repository instances (mainly for testing)
   */
  static reset(): void {
    this.teamRepo = null;
  }
}
