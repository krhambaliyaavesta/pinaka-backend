import { TeamRepository } from "../../domain/repositories/TeamRepository";
import { TeamRepoPgImpl } from "./TeamRepoPgImpl";
import { DatabaseServiceFactory } from "../../../../shared/services/DatabaseServiceFactory";

/**
 * Factory for creating TeamRepository instances.
 * Currently configured to use PostgreSQL implementation.
 */
export class TeamRepoFactory {
  /**
   * Creates and returns a new TeamRepository implementation
   * based on PostgreSQL database.
   */
  public static createTeamRepo(): TeamRepository {
    const dbService = DatabaseServiceFactory.getDatabase();
    return new TeamRepoPgImpl(dbService);
  }
}
