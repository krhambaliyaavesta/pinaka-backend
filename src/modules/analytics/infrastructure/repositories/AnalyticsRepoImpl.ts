import { KudosCardRepo } from "../../../kudosCards/domain/repositories/KudosCardRepo";
import { AnalyticsRepo } from "../../domain/repositories/AnalyticsRepo";

/**
 * Implementation of AnalyticsRepo that uses KudosCardRepo for data retrieval
 */
export class AnalyticsRepoImpl implements AnalyticsRepo {
  constructor(private kudosCardRepo: KudosCardRepo) {}

  /**
   * Get top recipients of kudos cards
   * @param limit Maximum number of recipients to return
   * @param period Optional time period for filtering (e.g., 'weekly', 'monthly')
   * @returns Promise resolving to array of recipients with counts
   */
  async getTopRecipients(
    limit: number,
    period?: string
  ): Promise<{ recipientName: string; count: number }[]> {
    return this.kudosCardRepo.getTopRecipients(limit, period);
  }

  /**
   * Get top teams receiving kudos cards
   * @param limit Maximum number of teams to return
   * @param period Optional time period for filtering
   * @returns Promise resolving to array of teams with counts
   */
  async getTopTeams(
    limit: number,
    period?: string
  ): Promise<{ teamId: number; teamName: string; count: number }[]> {
    return this.kudosCardRepo.getTopTeams(limit, period);
  }

  /**
   * Get trending categories used in kudos cards
   * @param limit Maximum number of categories to return
   * @param period Optional time period for filtering
   * @returns Promise resolving to array of categories with counts
   */
  async getTrendingCategories(
    limit: number,
    period?: string
  ): Promise<{ categoryId: number; categoryName: string; count: number }[]> {
    return this.kudosCardRepo.getTrendingCategories(limit, period);
  }

  /**
   * Get trending keywords from kudos card messages
   * @param limit Maximum number of keywords to return
   * @param period Optional time period for filtering
   * @returns Promise resolving to array of keywords with counts
   */
  async getTrendingKeywords(
    limit: number,
    period?: string
  ): Promise<{ keyword: string; count: number }[]> {
    return this.kudosCardRepo.getTrendingKeywords(limit, period);
  }
} 