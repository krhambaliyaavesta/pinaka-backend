import { Team, TeamProps } from "../../domain/entities/Team";
import { CreateTeamDTO, TeamDTO, UpdateTeamDTO } from "../dtos/TeamDTOs";

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
    return {
      id: team.id as number,
      name: team.name,
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an array of Team entities to TeamDTOs
   * @param teams The Team entities to convert
   * @returns An array of TeamDTOs
   */
  public static toDTOList(teams: Team[]): TeamDTO[] {
    return teams.map((team) => this.toDTO(team));
  }

  /**
   * Converts a CreateTeamDTO to Team entity properties
   * @param createTeamDTO The DTO containing team creation data
   * @returns Team properties ready for entity creation
   */
  public static toDomain(createTeamDTO: CreateTeamDTO): TeamProps {
    return {
      id: createTeamDTO.id, 
      name: createTeamDTO.name,
    };
  }

  /**
   * Extracts update properties from UpdateTeamDTO
   * @param updateTeamDTO The DTO containing team update data
   * @returns Partial Team properties for entity update
   */
  public static toUpdateDomain(
    updateTeamDTO: UpdateTeamDTO
  ): Partial<TeamProps> {
    const updateProps: Partial<TeamProps> = {};

    if (updateTeamDTO.name !== undefined) {
      updateProps.name = updateTeamDTO.name;
    }

    return updateProps;
  }
}
