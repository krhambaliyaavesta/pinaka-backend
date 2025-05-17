import { AnalyticsRepo } from "../../../domain/repositories/AnalyticsRepo";
import { GetTopRecipientsResponseDto } from "./GetTopRecipientsResponseDto";
import { GetTopRecipientsRequestDto } from "./GetTopRecipientsRequestDto";
import {
  AnalyticsValidationError,
  InvalidPeriodError,
} from "../../../domain/exceptions/AnalyticsExceptions";

/**
 * Use case for retrieving analytics about top kudos card recipients
 */
export class GetTopRecipientsUseCase {
  constructor(private analyticsRepo: AnalyticsRepo) {}

  /**
   * Execute the use case
   * @param request Request DTO with limit and period parameters
   * @returns Promise resolving to an array of top recipients with their kudos count
   */
  async execute(request: GetTopRecipientsRequestDto): Promise<GetTopRecipientsResponseDto[]> {
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
    const topRecipients = await this.analyticsRepo.getTopRecipients(
      limit,
      request.period
    );

    // Return the data as DTOs
    return topRecipients.map((recipient) => ({
      recipientName: recipient.recipientName,
      count: recipient.count,
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