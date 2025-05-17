import { AnalyticsRepo } from "../../modules/analytics/domain/repositories/AnalyticsRepo";
import { AnalyticsRepoFactory } from "../../modules/analytics/infrastructure/repositories/AnalyticsRepoFactory";

/**
 * Factory providing access to all repositories in the Analytics module
 */
export class AnalyticsModuleFactory {
  private static analyticsRepo: AnalyticsRepo | null = null;

  /**
   * Gets a singleton instance of the AnalyticsRepo
   */
  static getAnalyticsRepo(): AnalyticsRepo {
    if (!this.analyticsRepo) {
      this.analyticsRepo = AnalyticsRepoFactory.getRepo();
    }
    return this.analyticsRepo as AnalyticsRepo;
  }

  /**
   * Resets all repository instances (mainly for testing)
   */
  static reset(): void {
    this.analyticsRepo = null;
  }
} 