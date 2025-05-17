import { KudosCardsModuleFactory } from "../../../../../shared/factories/KudosCardsModuleFactory";
import { TeamModuleFactory } from "../../../../../shared/factories/TeamModuleFactory";
import { CategoryModuleFactory } from "../../../../../shared/factories/CategoryModuleFactory";
import { AuthModuleFactory } from "../../../../../shared/factories/AuthModuleFactory";
import { CreateKudosCardUseCase } from "./CreateKudosCardUseCase";

export class CreateKudosCardFactory {
  static create() {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();
    const teamRepo = TeamModuleFactory.getTeamRepo();
    const categoryRepo = CategoryModuleFactory.getCategoryRepo();
    const userRepo = AuthModuleFactory.getUserRepo();
    
    const useCase = new CreateKudosCardUseCase(
      kudosCardRepo,
      teamRepo,
      categoryRepo,
      userRepo
    );
    
    return { useCase };
  }
} 