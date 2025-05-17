import { Team } from "../../../domain/entities/Team";
import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { TeamNotFoundError } from "../../../domain/exceptions/TeamExceptions";

/**
 * Use case for retrieving a team by ID
 */
export class GetTeamByIdUseCase {
  constructor(private teamRepo: TeamRepo) {}

  /**
   * Execute the use case
   * @param id Team ID
   * @returns Promise resolving to the team
   */
  async execute(id: number): Promise<Team> {
    const team = await this.teamRepo.findById(id);
    
    if (!team) {
      throw new TeamNotFoundError(id);
    }
    
    return team;
  }
} 