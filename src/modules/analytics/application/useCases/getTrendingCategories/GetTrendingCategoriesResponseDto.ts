/**
 * Response DTO for the trending categories analytics
 */
export interface GetTrendingCategoriesResponseDto {
  /**
   * ID of the category
   */
  categoryId: number;
  
  /**
   * Name of the category
   */
  categoryName: string;
  
  /**
   * Number of times the category was used
   */
  count: number;
} 