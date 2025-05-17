import { KudosCardsModuleFactory } from "../../../../../shared/factories/KudosCardsModuleFactory";
import { TeamModuleFactory } from "../../../../../shared/factories/TeamModuleFactory";
import { CategoryModuleFactory } from "../../../../../shared/factories/CategoryModuleFactory";
import { AuthModuleFactory } from "../../../../../shared/factories/AuthModuleFactory";
import { GetKudosCardsUseCase } from "./GetKudosCardsUseCase";

export class GetKudosCardsFactory {
  static create() {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();
    const teamRepo = TeamModuleFactory.getTeamRepo();
    const categoryRepo = CategoryModuleFactory.getCategoryRepo();
    const userRepo = AuthModuleFactory.getUserRepo();
    
    const useCase = new GetKudosCardsUseCase(
      kudosCardRepo,
      teamRepo,
      categoryRepo,
      userRepo
    );
    
    return { useCase };
  }
}