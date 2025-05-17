import { TeamRepo } from "../../domain/repositories/TeamRepo";
import { TeamRepoPgImpl } from "./TeamRepoPgImpl";
import { PostgresService } from "../../../../shared/services/PostgresService";

/**
 * Factory for creating TeamRepo instances
 */
export class TeamRepoFactory {
  /**
   * Create and return a TeamRepo implementation
   * @returns TeamRepo implementation
   */
  static createTeamRepo(): TeamRepo {
    const dbService = PostgresService.getInstance();
    return new TeamRepoPgImpl(dbService);
  }
} 