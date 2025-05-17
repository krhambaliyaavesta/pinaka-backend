import { KudosCardRepo } from "../../../domain/repositories/KudosCardRepo";
import { TeamRepo } from "../../../../teams/domain/repositories/TeamRepo";
import { CategoryRepo } from "../../../../categories/domain/repositories/CategoryRepo";
import { KudosCardMapper } from "../../mappers/KudosCardMapper";
import { UpdateKudosCardDTO, KudosCardDTO } from "../../dtos/KudosCardDTOs";
import {
  KudosCardNotFoundError,
  KudosCardValidationError,
  InsufficientPermissionsError,
  UnauthorizedKudosCardAccessError,
} from "../../../domain/exceptions/KudosCardExceptions";
import { UserRepo } from "../../../../auth/domain/repositories/UserRepo";
import { TeamNotFoundError } from "../../../../teams/domain/exceptions/TeamExceptions";
import { CategoryNotFoundError } from "../../../../categories/domain/exceptions/CategoryExceptions";

/**
 * Use case for updating an existing kudos card
 */
export class UpdateKudosCardUseCase {
  constructor(
    private kudosCardRepo: KudosCardRepo,
    private teamRepo: TeamRepo,
    private categoryRepo: CategoryRepo,
    private userRepo: UserRepo
  ) {}

  /**
   * Execute the use case
   * @param id The ID of the kudos card to update
   * @param updateKudosCardDTO The data for updating the kudos card
   * @param userId The ID of the user updating the kudos card
   * @returns Promise resolving to the updated KudosCardDTO
   * @throws KudosCardNotFoundError if the kudos card doesn't exist
   * @throws TeamNotFoundError if the team with the given ID doesn't exist
   * @throws CategoryNotFoundError if the category with the given ID doesn't exist
   * @throws UnauthorizedKudosCardAccessError if the user didn't create the kudos card
   * @throws InsufficientPermissionsError if the user doesn't have permission to update kudos cards
   * @throws KudosCardValidationError if the input data is invalid
   */
  async execute(
    id: string,
    updateKudosCardDTO: UpdateKudosCardDTO,
    userId: string
  ): Promise<KudosCardDTO> {
    try {
      // Check if user has permission to update kudos cards (role = lead or admin)
      const user = await this.userRepo.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Get the kudos card
      const kudosCard = await this.kudosCardRepo.findById(id);
      if (!kudosCard) {
        throw new KudosCardNotFoundError(id);
      }

      // Check if user is allowed to update this kudos card
      // Only the creator or an admin can update the kudos card
      if (kudosCard.createdBy !== userId && user.role !== 1) {
        throw new UnauthorizedKudosCardAccessError(userId, id);
      }

      // Check if user has sufficient permissions
      if (!(user.role === 1 || user.role === 2)) {
        // 1 = admin, 2 = lead
        throw new InsufficientPermissionsError("Tech Lead or Admin");
      }

      // Verify team exists if it's being updated
      if (updateKudosCardDTO.teamId !== undefined) {
        const team = await this.teamRepo.findById(updateKudosCardDTO.teamId);
        if (!team) {
          throw new TeamNotFoundError(updateKudosCardDTO.teamId);
        }
      }

      // Verify category exists if it's being updated
      if (updateKudosCardDTO.categoryId !== undefined) {
        const category = await this.categoryRepo.findById(
          updateKudosCardDTO.categoryId
        );
        if (!category) {
          throw new CategoryNotFoundError(updateKudosCardDTO.categoryId);
        }
      }

      // Convert DTO to domain entity props
      const updateProps = KudosCardMapper.toUpdateDomain(updateKudosCardDTO);

      // Update the kudos card
      const updatedKudosCard = await this.kudosCardRepo.update(id, updateProps);

      if (!updatedKudosCard) {
        throw new KudosCardNotFoundError(id);
      }

      // Get the team name
      const teamId = updatedKudosCard.teamId;
      const team = await this.teamRepo.findById(teamId);
      if (!team) {
        throw new TeamNotFoundError(teamId);
      }

      // Get the category name
      const categoryId = updatedKudosCard.categoryId;
      const category = await this.categoryRepo.findById(categoryId);
      if (!category) {
        throw new CategoryNotFoundError(categoryId);
      }

      // Get creator name
      const creatorName = `${user.firstName} ${user.lastName}`;

      // Get sender name (if different from creator)
      let senderName = creatorName;
      if (
        updatedKudosCard.sentBy &&
        updatedKudosCard.sentBy !== updatedKudosCard.createdBy
      ) {
        const sender = await this.userRepo.findById(updatedKudosCard.sentBy);
        if (sender) {
          senderName = `${sender.firstName} ${sender.lastName}`;
        }
      }

      // Return enriched DTO with team and category names
      return KudosCardMapper.toDTO(
        updatedKudosCard,
        team.name,
        category.name,
        creatorName,
        senderName
      );
    } catch (error) {
      if (
        error instanceof KudosCardNotFoundError ||
        error instanceof TeamNotFoundError ||
        error instanceof CategoryNotFoundError ||
        error instanceof UnauthorizedKudosCardAccessError ||
        error instanceof InsufficientPermissionsError
      ) {
        throw error;
      }
      if (error instanceof Error) {
        throw new KudosCardValidationError(error.message);
      }
      throw error;
    }
  }
}
