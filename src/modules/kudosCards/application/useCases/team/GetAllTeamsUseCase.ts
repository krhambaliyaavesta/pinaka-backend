import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { TeamMapper } from "../../mappers/TeamMapper";
import { TeamDTO } from "../../dtos/TeamDTOs";

/**
 * Use case for retrieving all teams
 */
export class GetAllTeamsUseCase {
  constructor(private teamRepository: TeamRepository) {}

  /**
   * Execute the use case
   * @returns Promise resolving to an array of TeamDTOs
   */
  async execute(): Promise<TeamDTO[]> {
    const teams = await this.teamRepository.findAll();
    return TeamMapper.toDTOList(teams);
  }
}
