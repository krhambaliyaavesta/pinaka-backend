import { AnalyticsRepo } from "../../../domain/repositories/AnalyticsRepo";
import { GetTrendingCategoriesResponseDto } from "./GetTrendingCategoriesResponseDto";
import { GetTrendingCategoriesRequestDto } from "./GetTrendingCategoriesRequestDto";
import {
  AnalyticsValidationError,
  InvalidPeriodError,
} from "../../../domain/exceptions/AnalyticsExceptions";

/**
 * Use case for retrieving analytics about trending categories
 */
export class GetTrendingCategoriesUseCase {
  constructor(private analyticsRepo: AnalyticsRepo) {}

  /**
   * Execute the use case
   * @param request Request DTO with limit and period parameters
   * @returns Promise resolving to an array of trending categories with their usage count
   */
  async execute(request: GetTrendingCategoriesRequestDto): Promise<GetTrendingCategoriesResponseDto[]> {
    // Validate limit
    const limit = request.limit || 10;
    if (limit <= 0) {
      throw new AnalyticsValidationError("Limit must be greater than 0");
    }

    // Validate period if provided
    if (request.period && !this.isValidPeriod(request.period)) {
      throw new InvalidPeriodError(request.period);
    }

    // Get analytics data from repository
    const trendingCategories = await this.analyticsRepo.getTrendingCategories(
      limit,
      request.period
    );

    // Return the data as DTOs
    return trendingCategories.map((category) => ({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      count: category.count,
    }));
  }

  /**
   * Validate if the period parameter is valid
   * @param period The period string to validate
   * @returns True if the period is valid, false otherwise
   */
  private isValidPeriod(period: string): boolean {
    const validPeriods = ["daily", "weekly", "monthly", "quarterly", "yearly"];
    return validPeriods.includes(period.toLowerCase());
  }
} 