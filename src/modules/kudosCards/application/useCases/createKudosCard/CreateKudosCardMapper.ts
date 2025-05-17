import { KudosCard } from "../../../domain/entities/KudosCard";
import { CreateKudosCardRequestDto } from "./CreateKudosCardRequestDto";
import { CreateKudosCardResponseDto } from "./CreateKudosCardResponseDto";

/**
 * Mapper for CreateKudosCard use case
 */
export class CreateKudosCardMapper {
  /**
   * Maps DTO to domain entity properties
   * @param dto The request DTO
   * @param userId The ID of the user creating the kudos card
   * @returns Object with domain entity properties
   */
  static toDomain(
    dto: CreateKudosCardRequestDto,
    userId: string
  ): {
    recipientName: string;
    teamId: number;
    categoryId: number;
    message: string;
    createdBy: string;
    sentBy?: string;
  } {
    return {
      recipientName: dto.recipientName,
      teamId: dto.teamId,
      categoryId: dto.categoryId,
      message: dto.message,
      createdBy: userId,
      sentBy: dto.sentBy,
    };
  }

  /**
   * Maps domain entity to response DTO
   * @param kudosCard The domain entity
   * @param teamName The name of the team
   * @param categoryName The name of the category
   * @param creatorName The name of the creator
   * @param senderName The name of the sender (if different from creator)
   * @returns Response DTO
   */
  static toResponseDto(
    kudosCard: KudosCard,
    teamName: string,
    categoryName: string,
    creatorName: string,
    senderName: string
  ): CreateKudosCardResponseDto {
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
