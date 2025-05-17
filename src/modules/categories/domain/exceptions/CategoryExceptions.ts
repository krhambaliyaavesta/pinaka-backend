/**
 * Base exception for category-related errors
 */
export class CategoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryError";
  }
}

/**
 * Exception for when a category is not found
 */
export class CategoryNotFoundError extends CategoryError {
  constructor(id: number) {
    super(`Category with ID ${id} not found`);
    this.name = "CategoryNotFoundError";
  }
}

/**
 * Exception for category validation errors
 */
export class CategoryValidationError extends CategoryError {
  constructor(message: string) {
    super(message);
    this.name = "CategoryValidationError";
  }
} 