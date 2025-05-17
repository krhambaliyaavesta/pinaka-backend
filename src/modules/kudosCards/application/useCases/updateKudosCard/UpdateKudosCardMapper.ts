import { KudosCard, KudosCardProps } from "../../../domain/entities/KudosCard";
import { UpdateKudosCardRequestDto } from "./UpdateKudosCardRequestDto";
import { UpdateKudosCardResponseDto } from "./UpdateKudosCardResponseDto";

export class UpdateKudosCardMapper {
  /**
   * Converts domain entity to response DTO
   */
  public static toResponseDto(
    kudosCard: KudosCard,
    teamName: string,
    categoryName: string,
    creatorName: string
  ): UpdateKudosCardResponseDto {
    return {
      id: kudosCard.id,
      recipientName: kudosCard.recipientName,
      teamId: kudosCard.teamId,
      teamName,
      categoryId: kudosCard.categoryId,
      categoryName,
      message: kudosCard.message,
      createdBy: kudosCard.createdBy,
      creatorName,
      createdAt: kudosCard.createdAt.toISOString(),
      updatedAt: kudosCard.updatedAt.toISOString(),
    };
  }

  /**
   * Extracts update properties from request DTO
   */
  public static toUpdateDomain(
    updateDto: UpdateKudosCardRequestDto
  ): Partial<KudosCardProps> {
    const updateProps: Partial<KudosCardProps> = {};

    if (updateDto.recipientName !== undefined) {
      updateProps.recipientName = updateDto.recipientName;
    }

    if (updateDto.teamId !== undefined) {
      updateProps.teamId = updateDto.teamId;
    }

    if (updateDto.categoryId !== undefined) {
      updateProps.categoryId = updateDto.categoryId;
    }

    if (updateDto.message !== undefined) {
      updateProps.message = updateDto.message;
    }

    return updateProps;
  }
} 