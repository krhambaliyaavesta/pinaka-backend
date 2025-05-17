/**
 * Repository interface for analytics operations
 * This repository provides methods to retrieve various analytics data
 */
export interface AnalyticsRepo {
  /**
   * Get top recipients of kudos cards
   * @param limit Maximum number of recipients to return
   * @param period Optional time period for filtering (e.g., 'weekly', 'monthly')
   * @returns Promise resolving to array of recipients with counts
   */
  getTopRecipients(
    limit: number,
    period?: string
  ): Promise<{ recipientName: string; count: number }[]>;

  /**
   * Get top teams receiving kudos cards
   * @param limit Maximum number of teams to return
   * @param period Optional time period for filtering
   * @returns Promise resolving to array of teams with counts
   */
  getTopTeams(
    limit: number,
    period?: string
  ): Promise<{ teamId: number; teamName: string; count: number }[]>;

  /**
   * Get trending categories used in kudos cards
   * @param limit Maximum number of categories to return
   * @param period Optional time period for filtering
   * @returns Promise resolving to array of categories with counts
   */
  getTrendingCategories(
    limit: number,
    period?: string
  ): Promise<{ categoryId: number; categoryName: string; count: number }[]>;

  /**
   * Get trending keywords from kudos card messages
   * @param limit Maximum number of keywords to return
   * @param period Optional time period for filtering
   * @returns Promise resolving to array of keywords with counts
   */
  getTrendingKeywords(
    limit: number,
    period?: string
  ): Promise<{ keyword: string; count: number }[]>;
} 