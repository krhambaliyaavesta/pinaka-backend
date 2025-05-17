import { GetTopRecipientsUseCase } from "./GetTopRecipientsUseCase";
import { AnalyticsRepoFactory } from "../../../infrastructure/repositories/AnalyticsRepoFactory";

/**
 * Factory for creating GetTopRecipientsUseCase
 */
export class GetTopRecipientsFactory {
  /**
   * Create a new instance of GetTopRecipientsUseCase with all dependencies
   * @returns An instance of GetTopRecipientsUseCase
   */
  static create(): GetTopRecipientsUseCase {
    const analyticsRepo = AnalyticsRepoFactory.getRepo();
    return new GetTopRecipientsUseCase(analyticsRepo);
  }
} 