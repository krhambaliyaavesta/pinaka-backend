import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { TeamMapper } from "../../mappers/TeamMapper";
import { CreateTeamDTO, TeamDTO } from "../../dtos/TeamDTOs";
import { Team } from "../../../domain/entities/Team";
import { KudosCardValidationError } from "../../../domain/exceptions/KudosCardExceptions";

/**
 * Use case for creating a new team
 */
export class CreateTeamUseCase {
  constructor(private teamRepo: TeamRepo) {}

  /**
   * Execute the use case
   * @param createTeamDTO The data for creating a new team
   * @returns Promise resolving to the created TeamDTO
   */
  async execute(createTeamDTO: CreateTeamDTO): Promise<TeamDTO> {
    try {
      // Convert DTO to domain entity props
      const teamProps = TeamMapper.toDomain(createTeamDTO);

      // Create the domain entity
      const team = Team.create(teamProps);

      // Save to repository
      const savedTeam = await this.teamRepo.create(team);

      // Return DTO
      return TeamMapper.toDTO(savedTeam);
    } catch (error) {
      if (error instanceof Error) {
        throw new KudosCardValidationError(error.message);
      }
      throw error;
    }
  }
}
