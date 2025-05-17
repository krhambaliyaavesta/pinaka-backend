import { Team } from "../../../domain/entities/Team";
import { TeamRepo } from "../../../domain/repositories/TeamRepo";

/**
 * Use case for retrieving all teams
 */
export class GetAllTeamsUseCase {
  constructor(private teamRepo: TeamRepo) {}

  /**
   * Execute the use case
   * @returns Promise resolving to array of teams
   */
  async execute(): Promise<Team[]> {
    return await this.teamRepo.findAll();
  }
} 