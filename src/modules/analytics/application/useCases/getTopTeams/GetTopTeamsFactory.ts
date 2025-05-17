import { GetTopTeamsUseCase } from "./GetTopTeamsUseCase";
import { AnalyticsRepoFactory } from "../../../infrastructure/repositories/AnalyticsRepoFactory";

/**
 * Factory for creating GetTopTeamsUseCase
 */
export class GetTopTeamsFactory {
  /**
   * Create a new instance of GetTopTeamsUseCase with all dependencies
   * @returns An instance of GetTopTeamsUseCase
   */
  static create(): GetTopTeamsUseCase {
    const analyticsRepo = AnalyticsRepoFactory.getRepo();
    return new GetTopTeamsUseCase(analyticsRepo);
  }
} 