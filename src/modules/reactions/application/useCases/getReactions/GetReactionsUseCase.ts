import { ReactionRepo } from "../../../domain/repositories/ReactionRepo";
import { KudosCardRepo } from "../../../../kudosCards/domain/repositories/KudosCardRepo";
import { KudosCardNotFoundError } from "../../../domain/exceptions/ReactionExceptions";
import { GetReactionsRequestDto } from "./GetReactionsRequestDto";
import {
  GetReactionsResponseDto,
  ReactionDto,
} from "./GetReactionsResponseDto";

export class GetReactionsUseCase {
  constructor(
    private reactionRepo: ReactionRepo,
    private kudosCardRepo: KudosCardRepo
  ) {}

  async execute(dto: GetReactionsRequestDto): Promise<GetReactionsResponseDto> {
    // Check if kudos card exists
    const kudosCard = await this.kudosCardRepo.findById(dto.kudosCardId);
    if (!kudosCard) {
      throw new KudosCardNotFoundError(dto.kudosCardId);
    }

    // Get reactions
    const reactions = await this.reactionRepo.findByKudosCardId(
      dto.kudosCardId
    );

    // Get reaction counts
    const reactionCounts =
      await this.reactionRepo.getReactionCountsByKudosCardId(dto.kudosCardId);

    // Map to DTOs
    const reactionDtos: ReactionDto[] = reactions.map((reaction) => ({
      id: reaction.id,
      kudosCardId: reaction.kudosCardId,
      userId: reaction.userId,
      type: reaction.type,
      createdAt: reaction.createdAt.toISOString(),
    }));

    return {
      reactions: reactionDtos,
      reactionCounts,
    };
  }
}
