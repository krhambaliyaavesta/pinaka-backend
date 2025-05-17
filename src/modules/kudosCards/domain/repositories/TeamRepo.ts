import { Team } from "../entities/Team";

/**
 * Repo interface for Team entity operations
 */
export interface TeamRepo {
  /**
   * Find a team by its ID
   * @param id The team ID
   * @returns Promise resolving to Team or null if not found
   */
  findById(id: number): Promise<Team | null>;

  /**
   * Find all teams
   * @returns Promise resolving to array of Teams
   */
  findAll(): Promise<Team[]>;

  /**
   * Create a new team
   * @param team The team entity to create
   * @returns Promise resolving to the created Team
   */
  create(team: Team): Promise<Team>;

  /**
   * Update an existing team
   * @param team The team entity with updated values
   * @returns Promise resolving to the updated Team
   */
  update(team: Team): Promise<Team>;

  /**
   * Delete a team by ID
   * @param id The team ID to delete
   * @returns Promise resolving to true if successful, false otherwise
   */
  delete(id: number): Promise<boolean>;
}
