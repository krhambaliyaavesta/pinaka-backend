import { KudosCardsModuleFactory } from "../../../../../shared/factories/KudosCardsModuleFactory";
import { AuthModuleFactory } from "../../../../../shared/factories/AuthModuleFactory";
import { DeleteKudosCardUseCase } from "./DeleteKudosCardUseCase";

export class DeleteKudosCardFactory {
  static create() {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();
    const userRepo = AuthModuleFactory.getUserRepo();
    
    const useCase = new DeleteKudosCardUseCase(
      kudosCardRepo,
      userRepo
    );
    
    return { useCase };
  }
}