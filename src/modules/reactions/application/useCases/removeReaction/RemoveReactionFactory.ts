import { RemoveReactionUseCase } from "./RemoveReactionUseCase";
import { ReactionRepo } from "../../../domain/repositories/ReactionRepo";

export class RemoveReactionFactory {
  static create(reactionRepo: ReactionRepo) {
    const useCase = new RemoveReactionUseCase(reactionRepo);
    return { useCase };
  }
}
