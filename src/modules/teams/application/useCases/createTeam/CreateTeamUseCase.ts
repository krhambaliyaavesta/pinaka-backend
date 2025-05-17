import { Team } from "../../../domain/entities/Team";
import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { TeamValidationError } from "../../../domain/exceptions/TeamExceptions";
import { TeamDTO, TeamMapper } from "../../mappers/TeamMapper";

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
   * @returns Promise resolving to the created team DTO
   */
  async execute(input: CreateTeamInput): Promise<TeamDTO> {
    try {
      // Create the team entity
      const team = Team.create({
        name: input.name,
        id: 0, // Will be replaced by the database
      });

      // Persist the team and get the result
      const createdTeam = await this.teamRepo.create(team);
      
      // Transform to DTO and return
      return TeamMapper.toDTO(createdTeam);
    } catch (error) {
      if (error instanceof Error) {
        throw new TeamValidationError(error.message);
      }
      throw error;
    }
  }
} 