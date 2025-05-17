/**
 * Response DTO for the trending keywords analytics
 */
export interface GetTrendingKeywordsResponseDto {
  /**
   * The keyword or phrase
   */
  keyword: string;
  
  /**
   * Number of times the keyword appears
   */
  count: number;
} 