import { KudosCard, KudosCardProps } from "../../domain/entities/KudosCard";
import {
  KudosCardDTO,
  CreateKudosCardDTO,
  UpdateKudosCardDTO,
  KudosCardFilterDTO,
} from "../dtos/KudosCardDTOs";
import { KudosCardFilters } from "../../domain/repositories/KudosCardRepo";

/**
 * Mapper class for converting between KudosCard domain entities and DTOs
 */
export class KudosCardMapper {
  /**
   * Converts a KudosCard entity to a KudosCardDTO
   * @param kudosCard The KudosCard entity to convert
   * @param teamName The name of the team for the kudos card
   * @param categoryName The name of the category for the kudos card
   * @param creatorName The name of the creator of the kudos card
   * @param senderName The name of the sender (if different from creator)
   * @returns A KudosCardDTO representing the KudosCard
   */
  public static toDTO(
    kudosCard: KudosCard,
    teamName: string,
    categoryName: string,
    creatorName: string,
    senderName?: string
  ): KudosCardDTO {
    // Convert entity to plain object to avoid 'props' property in response
    const cardData = kudosCard.toObject();

    return {
      id: cardData.id.toString(),
      recipientName: cardData.recipientName,
      teamId: cardData.teamId,
      teamName: teamName,
      categoryId: cardData.categoryId,
      categoryName: categoryName,
      message: cardData.message,
      createdBy: cardData.createdBy,
      creatorName: creatorName,
      sentBy: kudosCard.sentBy || kudosCard.createdBy,
      senderName: senderName || creatorName,
      createdAt: kudosCard.createdAt.toISOString(),
      updatedAt: kudosCard.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a CreateKudosCardDTO to KudosCardProps for entity creation
   * @param createKudosCardDTO The CreateKudosCardDTO to convert
   * @param userId The ID of the user creating the kudos card
   * @returns KudosCardProps for entity creation
   */
  public static toEntity(
    createKudosCardDTO: Omit<CreateKudosCardDTO, "id">,
    userId: string
  ): Omit<KudosCardProps, "id"> {
    return {
      recipientName: createKudosCardDTO.recipientName,
      teamId: createKudosCardDTO.teamId,
      categoryId: createKudosCardDTO.categoryId,
      message: createKudosCardDTO.message,
      createdBy: userId,
      sentBy: (createKudosCardDTO as any).sentBy || userId, // Optional sentBy for creating on behalf of others
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }

  /**
   * Extracts update properties from UpdateKudosCardDTO
   * @param updateKudosCardDTO The DTO containing kudos card update data
   * @returns Partial KudosCard properties for entity update
   */
  public static toUpdateDomain(
    updateKudosCardDTO: UpdateKudosCardDTO
  ): Partial<KudosCardProps> {
    const updateProps: Partial<KudosCardProps> = {};

    if (updateKudosCardDTO.recipientName !== undefined) {
      updateProps.recipientName = updateKudosCardDTO.recipientName;
    }

    if (updateKudosCardDTO.teamId !== undefined) {
      updateProps.teamId = updateKudosCardDTO.teamId;
    }

    if (updateKudosCardDTO.categoryId !== undefined) {
      updateProps.categoryId = updateKudosCardDTO.categoryId;
    }

    if (updateKudosCardDTO.message !== undefined) {
      updateProps.message = updateKudosCardDTO.message;
    }

    return updateProps;
  }

  /**
   * Converts a filter DTO to domain filter object
   * @param filterDTO The filter DTO from the request
   * @returns A domain filter object for repository querying
   */
  public static toFilterDomain(
    filterDTO: KudosCardFilterDTO
  ): KudosCardFilters {
    const filter: KudosCardFilters = {};

    if (filterDTO.recipientName) {
      filter.recipientName = filterDTO.recipientName;
    }

    if (filterDTO.teamId) {
      filter.teamId = filterDTO.teamId;
    }

    if (filterDTO.categoryId) {
      filter.categoryId = filterDTO.categoryId;
    }

    if (filterDTO.startDate) {
      filter.startDate = new Date(filterDTO.startDate);
    }

    if (filterDTO.endDate) {
      filter.endDate = new Date(filterDTO.endDate);
    }

    if (filterDTO.createdBy) {
      filter.createdBy = filterDTO.createdBy;
    }

    return filter;
  }
}
