import { KudosCardsModuleFactory } from "../../../../shared/factories/KudosCardsModuleFactory";
import { AnalyticsRepo } from "../../domain/repositories/AnalyticsRepo";
import { AnalyticsRepoImpl } from "./AnalyticsRepoImpl";

/**
 * Factory for creating AnalyticsRepo implementations
 */
export class AnalyticsRepoFactory {
  /**
   * Get a repository instance
   * @returns An instance of AnalyticsRepo
   */
  static getRepo(): AnalyticsRepo {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();
    return new AnalyticsRepoImpl(kudosCardRepo);
  }
} 