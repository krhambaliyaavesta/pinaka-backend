/**
 * Response DTO for the top recipients analytics
 */
export interface GetTopRecipientsResponseDto {
  /**
   * Name of the recipient
   */
  recipientName: string;
  
  /**
   * Number of kudos received
   */
  count: number;
} 