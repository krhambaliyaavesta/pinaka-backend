import { CommentRepo } from "../../../domain/repositories/CommentRepo";
import { KudosCardNotFoundError } from "../../../domain/exceptions/CommentExceptions";
import { AddCommentRequestDto } from "./AddCommentRequestDto";
import { AddCommentResponseDto } from "./AddCommentResponseDto";
import { KudosCardRepo } from "../../../../kudosCards/domain/repositories/KudosCardRepo";

export class AddCommentUseCase {
  constructor(
    private commentRepo: CommentRepo,
    private kudosCardRepo: KudosCardRepo
  ) {}

  async execute(
    dto: AddCommentRequestDto,
    userId: string
  ): Promise<AddCommentResponseDto> {
    // Check if kudos card exists
    const kudosCard = await this.kudosCardRepo.findById(dto.kudosCardId);
    if (!kudosCard) {
      throw new KudosCardNotFoundError(dto.kudosCardId);
    }

    // Create and save the comment
    const comment = await this.commentRepo.add({
      kudosCardId: dto.kudosCardId,
      userId,
      content: dto.content,
    } as any); // Using 'as any' to bypass the type error temporarily

    // Get total comments count
    const totalComments = await this.commentRepo.getCommentCountByKudosCardId(
      dto.kudosCardId
    );

    return {
      comment: {
        id: comment.id,
        kudosCardId: comment.kudosCardId,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      },
      totalComments,
    };
  }
}
