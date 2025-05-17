import { KudosCardRepo } from "../../../../domain/repositories/KudosCardRepo";

/**
 * Response type for the top recipients analytics
 */
export interface TopRecipientDTO {
  recipientName: string;
  count: number;
}

/**
 * Use case for retrieving analytics about top kudos card recipients
 */
export class GetTopRecipientsUseCase {
  constructor(private kudosCardRepo: KudosCardRepo) {}

  /**
   * Execute the use case
   * @param limit Maximum number of results to return
   * @param period Optional time period for filtering (daily, weekly, monthly, quarterly, yearly)
   * @returns Promise resolving to an array of top recipients with their kudos count
   */
  async execute(limit: number, period?: string): Promise<TopRecipientDTO[]> {
    // Validate limit
    if (limit <= 0) {
      limit = 10; // Default to 10 results if invalid limit provided
    }

    // Get analytics data from repository
    const topRecipients = await this.kudosCardRepo.getTopRecipients(
      limit,
      period
    );

    // Return the data as DTOs
    return topRecipients.map((recipient) => ({
      recipientName: recipient.recipientName,
      count: recipient.count,
    }));
  }
}
