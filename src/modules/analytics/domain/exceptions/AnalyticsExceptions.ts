/**
 * Base class for analytics-related errors
 */
export class AnalyticsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when there's a validation issue with analytics parameters
 */
export class AnalyticsValidationError extends AnalyticsError {
  constructor(message: string) {
    super(`Validation error: ${message}`);
  }
}

/**
 * Error thrown when analytics data request fails
 */
export class AnalyticsDataError extends AnalyticsError {
  constructor(message: string) {
    super(`Data retrieval error: ${message}`);
  }
}

/**
 * Error thrown when an invalid period is specified
 */
export class InvalidPeriodError extends AnalyticsError {
  constructor(period: string) {
    super(`Invalid period: ${period}. Valid periods are: daily, weekly, monthly, quarterly, yearly`);
  }
} 