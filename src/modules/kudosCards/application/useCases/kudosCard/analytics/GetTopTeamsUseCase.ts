import { KudosCardRepo } from "../../../../domain/repositories/KudosCardRepo";

/**
 * Response type for the top teams analytics
 */
export interface TopTeamDTO {
  teamId: number;
  teamName: string;
  count: number;
}

/**
 * Use case for retrieving analytics about top teams receiving kudos
 */
export class GetTopTeamsUseCase {
  constructor(private kudosCardRepo: KudosCardRepo) {}

  /**
   * Execute the use case
   * @param limit Maximum number of results to return
   * @param period Optional time period for filtering (daily, weekly, monthly, quarterly, yearly)
   * @returns Promise resolving to an array of top teams with their kudos count
   */
  async execute(limit: number, period?: string): Promise<TopTeamDTO[]> {
    // Validate limit
    if (limit <= 0) {
      limit = 10; // Default to 10 results if invalid limit provided
    }

    // Get analytics data from repository
    const topTeams = await this.kudosCardRepo.getTopTeams(limit, period);

    // Return the data as DTOs
    return topTeams.map((team) => ({
      teamId: team.teamId,
      teamName: team.teamName,
      count: team.count,
    }));
  }
}
