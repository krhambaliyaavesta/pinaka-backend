/**
 * DTO for retrieving team information
 */
export interface TeamDTO {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO for creating a new team
 */
export interface CreateTeamDTO {
  name: string;
}

/**
 * DTO for updating an existing team
 */
export interface UpdateTeamDTO {
  name?: string;
}
