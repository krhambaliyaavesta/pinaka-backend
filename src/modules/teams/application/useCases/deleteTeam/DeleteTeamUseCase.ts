import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { TeamNotFoundError } from "../../../domain/exceptions/TeamExceptions";

/**
 * Use case for deleting a team
 */
export class DeleteTeamUseCase {
  constructor(private teamRepo: TeamRepo) {}

  /**
   * Execute the use case
   * @param id Team ID to delete
   * @returns Promise resolving to void
   */
  async execute(id: number): Promise<void> {
    // First check if the team exists
    const team = await this.teamRepo.findById(id);
    if (!team) {
      throw new TeamNotFoundError(id);
    }

    // Delete the team
    const result = await this.teamRepo.delete(id);
    if (!result) {
      throw new Error(`Failed to delete team with ID ${id}`);
    }
  }
} 