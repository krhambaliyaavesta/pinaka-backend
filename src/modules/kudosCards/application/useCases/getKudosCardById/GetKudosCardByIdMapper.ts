import { KudosCard } from "../../../domain/entities/KudosCard";
import { GetKudosCardByIdResponseDto } from "./GetKudosCardByIdResponseDto";

/**
 * Mapper for GetKudosCardById use case
 */
export class GetKudosCardByIdMapper {
  /**
   * Maps domain entity to response DTO
   * @param kudosCard The domain entity
   * @param teamName The name of the team
   * @param categoryName The name of the category
   * @param creatorName The name of the creator
   * @returns Response DTO
   */
  static toResponseDto(
    kudosCard: KudosCard,
    teamName: string,
    categoryName: string,
    creatorName: string,
    senderName: string
  ): GetKudosCardByIdResponseDto {
    return {
      id: kudosCard.id,
      recipientName: kudosCard.recipientName,
      teamId: kudosCard.teamId,
      teamName: teamName,
      categoryId: kudosCard.categoryId,
      categoryName: categoryName,
      message: kudosCard.message,
      createdBy: kudosCard.createdBy,
      creatorName: creatorName,
      sentBy: kudosCard.sentBy || kudosCard.createdBy,
      senderName: senderName,
      createdAt: kudosCard.createdAt.toISOString(),
      updatedAt: kudosCard.updatedAt.toISOString(),
    };
  }
}
