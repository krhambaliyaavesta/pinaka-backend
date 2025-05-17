import { KudosCardsModuleFactory } from "../../../../../shared/factories/KudosCardsModuleFactory";
import { TeamModuleFactory } from "../../../../../shared/factories/TeamModuleFactory";
import { CategoryModuleFactory } from "../../../../../shared/factories/CategoryModuleFactory";
import { AuthModuleFactory } from "../../../../../shared/factories/AuthModuleFactory";
import { UpdateKudosCardUseCase } from "./UpdateKudosCardUseCase";

export class UpdateKudosCardFactory {
  static create() {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();
    const teamRepo = TeamModuleFactory.getTeamRepo();
    const categoryRepo = CategoryModuleFactory.getCategoryRepo();
    const userRepo = AuthModuleFactory.getUserRepo();
    
    const useCase = new UpdateKudosCardUseCase(
      kudosCardRepo,
      teamRepo,
      categoryRepo,
      userRepo
    );
    
    return { useCase };
  }
}