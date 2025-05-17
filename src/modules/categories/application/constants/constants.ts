/**
 * Constants for the categories module
 */

export const CATEGORY_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
};

export const CATEGORY_ERROR_MESSAGES = {
  NAME_REQUIRED: "Category name is required",
  NAME_TOO_SHORT: `Category name must be at least ${CATEGORY_VALIDATION.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Category name cannot exceed ${CATEGORY_VALIDATION.NAME_MAX_LENGTH} characters`,
  INVALID_ID: "Invalid category ID",
  NOT_FOUND: (id: number) => `Category with ID ${id} not found`,
  NO_UPDATE_DATA: "No update data provided",
}; 