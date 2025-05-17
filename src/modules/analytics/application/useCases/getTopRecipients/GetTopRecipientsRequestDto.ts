/**
 * Request DTO for getting top recipients
 */
export interface GetTopRecipientsRequestDto {
  /**
   * Maximum number of results to return, defaults to 10
   */
  limit?: number;
  
  /**
   * Time period for filtering (daily, weekly, monthly, quarterly, yearly)
   */
  period?: string;
} 