import { ReactionRepo } from "../../../domain/repositories/ReactionRepo";
import {
  ReactionNotFoundError,
  UnauthorizedReactionError,
} from "../../../domain/exceptions/ReactionExceptions";
import { RemoveReactionRequestDto } from "./RemoveReactionRequestDto";
import { RemoveReactionResponseDto } from "./RemoveReactionResponseDto";

export class RemoveReactionUseCase {
  constructor(private reactionRepo: ReactionRepo) {}

  async execute(
    dto: RemoveReactionRequestDto,
    userId: string
  ): Promise<RemoveReactionResponseDto> {
    // Check if reaction exists and belongs to user
    const reaction = await this.reactionRepo.findById(dto.reactionId);

    if (!reaction) {
      throw new ReactionNotFoundError(dto.reactionId);
    }

    if (reaction.userId !== userId) {
      throw new UnauthorizedReactionError(userId, dto.reactionId);
    }

    // Remove the reaction
    const removed = await this.reactionRepo.remove(dto.reactionId);

    if (!removed) {
      throw new Error("Failed to remove reaction");
    }

    // Get updated reaction counts
    const reactionCounts =
      await this.reactionRepo.getReactionCountsByKudosCardId(
        reaction.kudosCardId
      );

    return {
      success: true,
      kudosCardId: reaction.kudosCardId,
      reactionCounts,
    };
  }
}
