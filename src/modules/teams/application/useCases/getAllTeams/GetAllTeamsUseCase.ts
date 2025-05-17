import { Team } from "../../../domain/entities/Team";
import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { TeamDTO, TeamMapper } from "../../mappers/TeamMapper";

/**
 * Use case for retrieving all teams
 */
export class GetAllTeamsUseCase {
  constructor(private teamRepo: TeamRepo) {}

  /**
   * Execute the use case
   * @returns Promise resolving to array of team DTOs
   */
  async execute(): Promise<TeamDTO[]> {
    const teams = await this.teamRepo.findAll();
    return teams.map(team => TeamMapper.toDTO(team));
  }
} 