import { TeamRepoFactory } from "../../infrastructure/repositories/TeamRepoFactory";
import { CreateTeamUseCase } from "./createTeam/CreateTeamUseCase";
import { GetAllTeamsUseCase } from "./getAllTeams/GetAllTeamsUseCase";
import { GetTeamByIdUseCase } from "./getTeam/GetTeamByIdUseCase";
import { UpdateTeamUseCase } from "./updateTeam/UpdateTeamUseCase";
import { DeleteTeamUseCase } from "./deleteTeam/DeleteTeamUseCase";

/**
 * Factory for creating team use case instances
 */
export class TeamUseCaseFactory {
  /**
   * Create a new instance of CreateTeamUseCase
   * @returns CreateTeamUseCase instance
   */
  static createCreateTeamUseCase(): CreateTeamUseCase {
    const teamRepo = TeamRepoFactory.createTeamRepo();
    return new CreateTeamUseCase(teamRepo);
  }

  /**
   * Create a new instance of GetAllTeamsUseCase
   * @returns GetAllTeamsUseCase instance
   */
  static createGetAllTeamsUseCase(): GetAllTeamsUseCase {
    const teamRepo = TeamRepoFactory.createTeamRepo();
    return new GetAllTeamsUseCase(teamRepo);
  }

  /**
   * Create a new instance of GetTeamByIdUseCase
   * @returns GetTeamByIdUseCase instance
   */
  static createGetTeamByIdUseCase(): GetTeamByIdUseCase {
    const teamRepo = TeamRepoFactory.createTeamRepo();
    return new GetTeamByIdUseCase(teamRepo);
  }

  /**
   * Create a new instance of UpdateTeamUseCase
   * @returns UpdateTeamUseCase instance
   */
  static createUpdateTeamUseCase(): UpdateTeamUseCase {
    const teamRepo = TeamRepoFactory.createTeamRepo();
    return new UpdateTeamUseCase(teamRepo);
  }

  /**
   * Create a new instance of DeleteTeamUseCase
   * @returns DeleteTeamUseCase instance
   */
  static createDeleteTeamUseCase(): DeleteTeamUseCase {
    const teamRepo = TeamRepoFactory.createTeamRepo();
    return new DeleteTeamUseCase(teamRepo);
  }
} 