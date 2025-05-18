import { GetReactionsUseCase } from "./GetReactionsUseCase";
import { ReactionRepo } from "../../../domain/repositories/ReactionRepo";
import { KudosCardRepo } from "../../../../kudosCards/domain/repositories/KudosCardRepo";

export class GetReactionsFactory {
  static create(reactionRepo: ReactionRepo, kudosCardRepo: KudosCardRepo) {
    const useCase = new GetReactionsUseCase(reactionRepo, kudosCardRepo);
    return { useCase };
  }
}
