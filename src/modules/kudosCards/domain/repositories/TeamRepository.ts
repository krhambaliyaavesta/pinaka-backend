import { Team } from "../entities/Team";

/**
 * Repository interface for Team entity operations.
 * This defines the contract for data access operations related to teams.
 */
export interface TeamRepository {
  /**
   * Find all teams in the system
   * @returns Promise resolving to array of Team entities
   */
  findAll(): Promise<Team[]>;

  /**
   * Find a team by its ID
   * @param id The team ID to search for
   * @returns Promise resolving to the Team entity if found, or null if not found
   */
  findById(id: number): Promise<Team | null>;

  /**
   * Create a new team
   * @param team The team data to create
   * @returns Promise resolving to the created Team entity
   */
  create(team: Omit<Team, "id" | "createdAt" | "updatedAt">): Promise<Team>;

  /**
   * Update an existing team
   * @param id The ID of the team to update
   * @param team The team data to update
   * @returns Promise resolving to the updated Team entity, or null if not found
   */
  update(id: number, team: Partial<Team>): Promise<Team | null>;

  /**
   * Delete a team by its ID
   * @param id The ID of the team to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: number): Promise<boolean>;
}
