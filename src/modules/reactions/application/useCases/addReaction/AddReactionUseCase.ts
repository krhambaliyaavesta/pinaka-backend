import { ReactionRepo } from "../../../domain/repositories/ReactionRepo";
import { ReactionType, Reaction } from "../../../domain/entities/Reaction";
import {
  KudosCardNotFoundError,
  DuplicateReactionError,
} from "../../../domain/exceptions/ReactionExceptions";
import { AddReactionRequestDto } from "./AddReactionRequestDto";
import { AddReactionResponseDto } from "./AddReactionResponseDto";

// Import the KudosCardRepo interface from the kudosCards module
import { KudosCardRepo } from "../../../../kudosCards/domain/repositories/KudosCardRepo";

export class AddReactionUseCase {
  constructor(
    private reactionRepo: ReactionRepo,
    private kudosCardRepo: KudosCardRepo
  ) {}

  async execute(
    dto: AddReactionRequestDto,
    userId: string
  ): Promise<AddReactionResponseDto> {
    // Check if kudos card exists
    const kudosCard = await this.kudosCardRepo.findById(dto.kudosCardId);
    if (!kudosCard) {
      throw new KudosCardNotFoundError(dto.kudosCardId);
    }

    // Check if user already has this reaction type on the kudos card
    const existingReaction = await this.reactionRepo.findByUserAndType(
      dto.kudosCardId,
      userId,
      dto.type
    );

    if (existingReaction) {
      throw new DuplicateReactionError(userId, dto.type);
    }

    // Create and save the reaction
    const reaction = await this.reactionRepo.add({
      kudosCardId: dto.kudosCardId,
      userId,
      type: dto.type,
    } as any); // Using 'as any' to bypass the type error temporarily

    // Get updated reaction counts
    const reactionCounts =
      await this.reactionRepo.getReactionCountsByKudosCardId(dto.kudosCardId);

    return {
      reaction: {
        id: reaction.id,
        kudosCardId: reaction.kudosCardId,
        userId: reaction.userId,
        type: reaction.type,
        createdAt: reaction.createdAt.toISOString(),
      },
      reactionCounts,
    };
  }
}
