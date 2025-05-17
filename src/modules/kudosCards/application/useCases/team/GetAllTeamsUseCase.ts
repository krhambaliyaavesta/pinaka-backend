import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { TeamMapper } from "../../mappers/TeamMapper";
import { TeamDTO } from "../../dtos/TeamDTOs";

/**
 * Use case for retrieving all teams
 */
export class GetAllTeamsUseCase {
  constructor(private teamRepo: TeamRepo) {}

  /**
   * Execute the use case
   * @returns Promise resolving to an array of TeamDTOs
   */
  async execute(): Promise<TeamDTO[]> {
    const teams = await this.teamRepo.findAll();
    return TeamMapper.toDTOList(teams);
  }
}
