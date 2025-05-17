import { PostgresService } from "../../../../shared/services/PostgresService";
import { TeamRepo } from "../../domain/repositories/TeamRepo";
import { TeamRepoPgImpl } from "./TeamRepoPgImpl";

/**
 * Factory for creating TeamRepo implementations
 */
export class TeamRepoFactory {
  static getRepo(dbService: PostgresService): TeamRepo {
    return new TeamRepoPgImpl(dbService);
  }
}
