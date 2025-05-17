import { Team } from "../../../domain/entities/Team";
import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { TeamValidationError } from "../../../domain/exceptions/TeamExceptions";

interface CreateTeamInput {
  name: string;
}

/**
 * Use case for creating a new team
 */
export class CreateTeamUseCase {
  constructor(private teamRepo: TeamRepo) {}

  /**
   * Execute the use case
   * @param input Team creation input data
   * @returns Promise resolving to the created team
   */
  async execute(input: CreateTeamInput): Promise<Team> {
    try {
      // Create the team entity
      const team = Team.create({
        name: input.name,
        id: 0, // Will be replaced by the database
      });

      // Persist the team
      return await this.teamRepo.create(team);
    } catch (error) {
      if (error instanceof Error) {
        throw new TeamValidationError(error.message);
      }
      throw error;
    }
  }
} 