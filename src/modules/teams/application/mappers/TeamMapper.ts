import { Team, TeamProps } from "../../domain/entities/Team";

/**
 * DTO for Team entity
 */
export interface TeamDTO {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mapper class for converting between Team domain entities and DTOs
 */
export class TeamMapper {
  /**
   * Converts a Team entity to a TeamDTO
   * @param team The Team entity to convert
   * @returns A TeamDTO representing the Team
   */
  public static toDTO(team: Team): TeamDTO {
    // Convert entity to plain object to avoid 'props' property in response
    const teamData = team.toObject();

    return {
      id: teamData.id || 0,
      name: teamData.name,
      createdAt: teamData.createdAt?.toISOString() || "",
      updatedAt: teamData.updatedAt?.toISOString() || "",
    };
  }
}
