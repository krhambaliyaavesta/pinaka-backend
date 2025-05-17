import { GetTrendingKeywordsUseCase } from "./GetTrendingKeywordsUseCase";
import { AnalyticsRepoFactory } from "../../../infrastructure/repositories/AnalyticsRepoFactory";

/**
 * Factory for creating GetTrendingKeywordsUseCase
 */
export class GetTrendingKeywordsFactory {
  /**
   * Create a new instance of GetTrendingKeywordsUseCase with all dependencies
   * @returns An instance of GetTrendingKeywordsUseCase
   */
  static create(): GetTrendingKeywordsUseCase {
    const analyticsRepo = AnalyticsRepoFactory.getRepo();
    return new GetTrendingKeywordsUseCase(analyticsRepo);
  }
} 