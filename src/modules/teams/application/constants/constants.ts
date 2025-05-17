/**
 * Constants for the teams module
 */

export const TEAM_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
};

export const TEAM_ERROR_MESSAGES = {
  NAME_REQUIRED: "Team name is required",
  NAME_TOO_SHORT: `Team name must be at least ${TEAM_VALIDATION.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Team name cannot exceed ${TEAM_VALIDATION.NAME_MAX_LENGTH} characters`,
  INVALID_ID: "Invalid team ID",
  NOT_FOUND: (id: number) => `Team with ID ${id} not found`,
  NO_UPDATE_DATA: "No update data provided",
}; 