/**
 * Request DTO for getting trending categories
 */
export interface GetTrendingCategoriesRequestDto {
  /**
   * Maximum number of results to return, defaults to 10
   */
  limit?: number;
  
  /**
   * Time period for filtering (daily, weekly, monthly, quarterly, yearly)
   */
  period?: string;
} 