import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { TeamMapper } from "../../mappers/TeamMapper";
import { UpdateTeamDTO, TeamDTO } from "../../dtos/TeamDTOs";
import {
  TeamNotFoundError,
  KudosCardValidationError,
} from "../../../domain/exceptions/KudosCardExceptions";

/**
 * Use case for updating an existing team
 */
export class UpdateTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  /**
   * Execute the use case
   * @param id The ID of the team to update
   * @param updateTeamDTO The data for updating the team
   * @returns Promise resolving to the updated TeamDTO
   * @throws TeamNotFoundError if the team with the given ID doesn't exist
   */
  async execute(id: number, updateTeamDTO: UpdateTeamDTO): Promise<TeamDTO> {
    try {
      // First check if team exists
      const existingTeam = await this.teamRepository.findById(id);
      if (!existingTeam) {
        throw new TeamNotFoundError(id);
      }

      // Convert DTO to domain entity props
      const updateProps = TeamMapper.toUpdateDomain(updateTeamDTO);

      // Update the team
      const updatedTeam = await this.teamRepository.update(id, updateProps);

      if (!updatedTeam) {
        throw new TeamNotFoundError(id);
      }

      // Return DTO
      return TeamMapper.toDTO(updatedTeam);
    } catch (error) {
      if (error instanceof TeamNotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new KudosCardValidationError(error.message);
      }
      throw error;
    }
  }
}
