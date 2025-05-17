/**
 * Base exception for team-related errors
 */
export class TeamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamError";
  }
}

/**
 * Exception for when a team is not found
 */
export class TeamNotFoundError extends TeamError {
  constructor(id: number) {
    super(`Team with ID ${id} not found`);
    this.name = "TeamNotFoundError";
  }
}

/**
 * Exception for team validation errors
 */
export class TeamValidationError extends TeamError {
  constructor(message: string) {
    super(message);
    this.name = "TeamValidationError";
  }
} 