import { KudosCardRepository } from "../../../domain/repositories/KudosCardRepository";
import {
  KudosCardNotFoundError,
  InsufficientPermissionsError,
  UnauthorizedKudosCardAccessError,
} from "../../../domain/exceptions/KudosCardExceptions";
import { UserRepo } from "../../../../auth/domain/repositories/UserRepo";

/**
 * Use case for soft deleting a kudos card
 */
export class DeleteKudosCardUseCase {
  constructor(
    private kudosCardRepository: KudosCardRepository,
    private userRepository: UserRepo
  ) {}

  /**
   * Execute the use case
   * @param id The ID of the kudos card to delete
   * @param userId The ID of the user deleting the kudos card
   * @returns Promise resolving to a boolean indicating success
   * @throws KudosCardNotFoundError if the kudos card doesn't exist
   * @throws UnauthorizedKudosCardAccessError if the user didn't create the kudos card
   * @throws InsufficientPermissionsError if the user doesn't have permission to delete kudos cards
   */
  async execute(id: string, userId: string): Promise<boolean> {
    // Check if user exists and has permission
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user has sufficient permissions (role = lead or admin)
    if (!(user.role === 1 || user.role === 2)) {
      // 1 = admin, 2 = lead
      throw new InsufficientPermissionsError("Tech Lead or Admin");
    }

    // Check if kudos card exists
    const kudosCard = await this.kudosCardRepository.findById(id);
    if (!kudosCard) {
      throw new KudosCardNotFoundError(id);
    }

    // Check if user is allowed to delete this kudos card
    // Only the creator or an admin can delete the kudos card
    if (kudosCard.createdBy !== userId && user.role !== 1) {
      throw new UnauthorizedKudosCardAccessError(userId, id);
    }

    // Soft delete the kudos card
    const result = await this.kudosCardRepository.softDelete(id);

    if (!result) {
      throw new Error(`Failed to delete kudos card with ID ${id}`);
    }

    return true;
  }
}
