import { AddReactionUseCase } from "./AddReactionUseCase";
import { ReactionRepo } from "../../../domain/repositories/ReactionRepo";
import { KudosCardRepo } from "../../../../kudosCards/domain/repositories/KudosCardRepo";

export class AddReactionFactory {
  static create(reactionRepo: ReactionRepo, kudosCardRepo: KudosCardRepo) {
    const useCase = new AddReactionUseCase(reactionRepo, kudosCardRepo);
    return { useCase };
  }
}
