/**
 * Base error class for all domain-specific errors in the Kudos Card module
 */
export class KudosCardDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Thrown when a requested kudos card is not found
 */
export class KudosCardNotFoundError extends KudosCardDomainError {
  constructor(id: string) {
    super(`Kudos card with ID ${id} not found`);
  }
}

/**
 * Thrown when a user attempts to modify a kudos card they didn't create
 */
export class UnauthorizedKudosCardAccessError extends KudosCardDomainError {
  constructor(userId: string, cardId: string) {
    super(`User ${userId} is not authorized to modify kudos card ${cardId}`);
  }
}

/**
 * Thrown when validation fails on kudos card data
 */
export class KudosCardValidationError extends KudosCardDomainError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Thrown when a user is not allowed to perform an operation due to role restrictions
 */
export class InsufficientPermissionsError extends KudosCardDomainError {
  constructor(requiredRole: string) {
    super(`This operation requires ${requiredRole} role`);
  }
}
