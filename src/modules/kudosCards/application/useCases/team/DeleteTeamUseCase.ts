import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { TeamNotFoundError } from "../../../domain/exceptions/KudosCardExceptions";

/**
 * Use case for deleting a team
 */
export class DeleteTeamUseCase {
  constructor(private teamRepo: TeamRepo) {}

  /**
   * Execute the use case
   * @param id The ID of the team to delete
   * @returns Promise resolving to a boolean indicating success
   * @throws TeamNotFoundError if the team with the given ID doesn't exist
   */
  async execute(id: number): Promise<boolean> {
    // First check if team exists
    const existingTeam = await this.teamRepo.findById(id);
    if (!existingTeam) {
      throw new TeamNotFoundError(id);
    }

    // Delete the team
    const result = await this.teamRepo.delete(id);

    if (!result) {
      throw new Error(`Failed to delete team with ID ${id}`);
    }

    return true;
  }
}
