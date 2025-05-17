import { KudosCardRepository } from "../../../domain/repositories/KudosCardRepository";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";
import { KudosCardMapper } from "../../mappers/KudosCardMapper";
import { CreateKudosCardDTO, KudosCardDTO } from "../../dtos/KudosCardDTOs";
import { KudosCard } from "../../../domain/entities/KudosCard";
import {
  KudosCardValidationError,
  TeamNotFoundError,
  CategoryNotFoundError,
  InsufficientPermissionsError,
} from "../../../domain/exceptions/KudosCardExceptions";
import { UserRepo } from "../../../../auth/domain/repositories/UserRepo";

/**
 * Use case for creating a new kudos card
 */
export class CreateKudosCardUseCase {
  constructor(
    private kudosCardRepository: KudosCardRepository,
    private teamRepository: TeamRepository,
    private categoryRepository: CategoryRepository,
    private userRepository: UserRepo
  ) {}

  /**
   * Execute the use case
   * @param createKudosCardDTO The data for creating a new kudos card
   * @param userId The ID of the user creating the kudos card
   * @returns Promise resolving to the created KudosCardDTO
   * @throws TeamNotFoundError if the team with the given ID doesn't exist
   * @throws CategoryNotFoundError if the category with the given ID doesn't exist
   * @throws KudosCardValidationError if the input data is invalid
   * @throws InsufficientPermissionsError if the user doesn't have permission to create kudos cards
   */
  async execute(
    createKudosCardDTO: CreateKudosCardDTO,
    userId: string
  ): Promise<KudosCardDTO> {
    try {
      // Check if user has permission to create kudos cards (role = lead or admin)
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (!(user.role === 1 || user.role === 2)) {
        // 1 = admin, 2 = lead
        throw new InsufficientPermissionsError("Tech Lead or Admin");
      }

      // Verify team exists
      const team = await this.teamRepository.findById(
        createKudosCardDTO.teamId
      );
      if (!team) {
        throw new TeamNotFoundError(createKudosCardDTO.teamId);
      }

      // Verify category exists
      const category = await this.categoryRepository.findById(
        createKudosCardDTO.categoryId
      );
      if (!category) {
        throw new CategoryNotFoundError(createKudosCardDTO.categoryId);
      }

      // Convert DTO to domain entity props
      const kudosCardProps = KudosCardMapper.toDomain(
        createKudosCardDTO,
        userId
      );

      // Create the domain entity
      const kudosCard = KudosCard.create(kudosCardProps);

      // Save to repository
      const savedKudosCard = await this.kudosCardRepository.create(kudosCard);

      // Return enriched DTO with team and category names
      return KudosCardMapper.toDTO(
        savedKudosCard,
        team.name,
        category.name,
        `${user.firstName} ${user.lastName}`
      );
    } catch (error) {
      if (
        error instanceof TeamNotFoundError ||
        error instanceof CategoryNotFoundError ||
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
