import { KudosCardRepository } from "../../domain/repositories/KudosCardRepository";
import { KudosCardRepoPgImpl } from "./KudosCardRepoPgImpl";
import { DatabaseServiceFactory } from "../../../../shared/services/DatabaseServiceFactory";

/**
 * Factory for creating KudosCardRepository instances.
 * Currently configured to use PostgreSQL implementation.
 */
export class KudosCardRepoFactory {
  /**
   * Creates and returns a new KudosCardRepository implementation
   * based on PostgreSQL database.
   */
  public static createKudosCardRepo(): KudosCardRepository {
    const dbService = DatabaseServiceFactory.getDatabase();
    return new KudosCardRepoPgImpl(dbService);
  }
}
