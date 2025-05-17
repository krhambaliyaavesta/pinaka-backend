import { KudosCardRepo } from "../../../../domain/repositories/KudosCardRepo";

/**
 * Response type for the trending keywords analytics
 */
export interface TrendingKeywordDTO {
  keyword: string;
  count: number;
}

/**
 * Use case for retrieving analytics about trending keywords in kudos card messages
 */
export class GetTrendingKeywordsUseCase {
  constructor(private kudosCardRepo: KudosCardRepo) {}

  /**
   * Execute the use case
   * @param limit Maximum number of results to return
   * @param period Optional time period for filtering (daily, weekly, monthly, quarterly, yearly)
   * @returns Promise resolving to an array of trending keywords with their occurrence count
   */
  async execute(limit: number, period?: string): Promise<TrendingKeywordDTO[]> {
    // Validate limit
    if (limit <= 0) {
      limit = 10; // Default to 10 results if invalid limit provided
    }

    // Get analytics data from repository
    const trendingKeywords = await this.kudosCardRepo.getTrendingKeywords(
      limit,
      period
    );

    // Return the data as DTOs
    return trendingKeywords.map((keyword) => ({
      keyword: keyword.keyword,
      count: keyword.count,
    }));
  }
}
