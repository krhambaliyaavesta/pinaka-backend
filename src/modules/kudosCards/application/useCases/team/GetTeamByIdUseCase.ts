import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { TeamMapper } from "../../mappers/TeamMapper";
import { TeamDTO } from "../../dtos/TeamDTOs";
import { TeamNotFoundError } from "../../../domain/exceptions/KudosCardExceptions";

/**
 * Use case for retrieving a team by ID
 */
export class GetTeamByIdUseCase {
  constructor(private teamRepository: TeamRepository) {}

  /**
   * Execute the use case
   * @param id The ID of the team to retrieve
   * @returns Promise resolving to a TeamDTO
   * @throws TeamNotFoundError if the team with the given ID doesn't exist
   */
  async execute(id: number): Promise<TeamDTO> {
    const team = await this.teamRepository.findById(id);

    if (!team) {
      throw new TeamNotFoundError(id);
    }

    return TeamMapper.toDTO(team);
  }
}
