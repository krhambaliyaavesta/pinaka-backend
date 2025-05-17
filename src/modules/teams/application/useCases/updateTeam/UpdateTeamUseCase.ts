import { Team } from "../../../domain/entities/Team";
import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { TeamNotFoundError, TeamValidationError } from "../../../domain/exceptions/TeamExceptions";

interface UpdateTeamInput {
  name?: string;
}

/**
 * Use case for updating an existing team
 */
export class UpdateTeamUseCase {
  constructor(private teamRepo: TeamRepo) {}

  /**
   * Execute the use case
   * @param id Team ID to update
   * @param input Team update data
   * @returns Promise resolving to the updated team
   */
  async execute(id: number, input: UpdateTeamInput): Promise<Team> {
    // Find the team
    const team = await this.teamRepo.findById(id);
    if (!team) {
      throw new TeamNotFoundError(id);
    }

    try {
      // Update team attributes if provided
      if (input.name !== undefined) {
        team.updateName(input.name);
      }

      // Persist the updated team
      return await this.teamRepo.update(team);
    } catch (error) {
      if (error instanceof Error) {
        throw new TeamValidationError(error.message);
      }
      throw error;
    }
  }
} 