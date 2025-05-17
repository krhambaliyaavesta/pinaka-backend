import { KudosCardsModuleFactory } from "../../../../../shared/factories/KudosCardsModuleFactory";
import { GetAllTeamsUseCase } from "./GetAllTeamsUseCase";
import { GetTeamByIdUseCase } from "./GetTeamByIdUseCase";
import { CreateTeamUseCase } from "./CreateTeamUseCase";
import { UpdateTeamUseCase } from "./UpdateTeamUseCase";
import { DeleteTeamUseCase } from "./DeleteTeamUseCase";

/**
 * Factory for creating team-related use cases
 */
export class TeamUseCaseFactory {
  /**
   * Creates a use case for getting all teams
   */
  static createGetAllTeamsUseCase(): GetAllTeamsUseCase {
    const teamRepo = KudosCardsModuleFactory.getTeamRepo();
    return new GetAllTeamsUseCase(teamRepo);
  }

  /**
   * Creates a use case for getting a team by ID
   */
  static createGetTeamByIdUseCase(): GetTeamByIdUseCase {
    const teamRepo = KudosCardsModuleFactory.getTeamRepo();
    return new GetTeamByIdUseCase(teamRepo);
  }

  /**
   * Creates a use case for creating a team
   */
  static createCreateTeamUseCase(): CreateTeamUseCase {
    const teamRepo = KudosCardsModuleFactory.getTeamRepo();
    return new CreateTeamUseCase(teamRepo);
  }

  /**
   * Creates a use case for updating a team
   */
  static createUpdateTeamUseCase(): UpdateTeamUseCase {
    const teamRepo = KudosCardsModuleFactory.getTeamRepo();
    return new UpdateTeamUseCase(teamRepo);
  }

  /**
   * Creates a use case for deleting a team
   */
  static createDeleteTeamUseCase(): DeleteTeamUseCase {
    const teamRepo = KudosCardsModuleFactory.getTeamRepo();
    return new DeleteTeamUseCase(teamRepo);
  }
}
