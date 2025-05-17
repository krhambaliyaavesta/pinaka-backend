import { KudosCardRepo } from "../../../../domain/repositories/KudosCardRepo";

/**
 * Response type for the trending categories analytics
 */
export interface TrendingCategoryDTO {
  categoryId: number;
  categoryName: string;
  count: number;
}

/**
 * Use case for retrieving analytics about trending kudos card categories
 */
export class GetTrendingCategoriesUseCase {
  constructor(private kudosCardRepo: KudosCardRepo) {}

  /**
   * Execute the use case
   * @param limit Maximum number of results to return
   * @param period Optional time period for filtering (daily, weekly, monthly, quarterly, yearly)
   * @returns Promise resolving to an array of trending categories with their kudos count
   */
  async execute(
    limit: number,
    period?: string
  ): Promise<TrendingCategoryDTO[]> {
    // Validate limit
    if (limit <= 0) {
      limit = 10; // Default to 10 results if invalid limit provided
    }

    // Get analytics data from repository
    const trendingCategories =
      await this.kudosCardRepo.getTrendingCategories(limit, period);

    // Return the data as DTOs
    return trendingCategories.map((category) => ({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      count: category.count,
    }));
  }
}
