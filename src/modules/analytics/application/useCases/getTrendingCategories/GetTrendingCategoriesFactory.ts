import { GetTrendingCategoriesUseCase } from "./GetTrendingCategoriesUseCase";
import { AnalyticsRepoFactory } from "../../../infrastructure/repositories/AnalyticsRepoFactory";

/**
 * Factory for creating GetTrendingCategoriesUseCase
 */
export class GetTrendingCategoriesFactory {
  /**
   * Create a new instance of GetTrendingCategoriesUseCase with all dependencies
   * @returns An instance of GetTrendingCategoriesUseCase
   */
  static create(): GetTrendingCategoriesUseCase {
    const analyticsRepo = AnalyticsRepoFactory.getRepo();
    return new GetTrendingCategoriesUseCase(analyticsRepo);
  }
} 