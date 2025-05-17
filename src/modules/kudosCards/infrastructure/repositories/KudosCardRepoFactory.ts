import { PostgresService } from "../../../../shared/services/PostgresService";
import { KudosCardRepo } from "../../domain/repositories/KudosCardRepo";
import { KudosCardRepoPgImpl } from "./KudosCardRepoPgImpl";

/**
 * Factory for creating KudosCardRepo implementations
 */
export class KudosCardRepoFactory {
  /**
   * Create a PostgreSQL implementation of KudosCardRepo
   * @param dbService The database service to use
   * @returns KudosCardRepo implementation
   */
  static getRepo(dbService: PostgresService): KudosCardRepo {
    return new KudosCardRepoPgImpl(dbService);
  }
}
