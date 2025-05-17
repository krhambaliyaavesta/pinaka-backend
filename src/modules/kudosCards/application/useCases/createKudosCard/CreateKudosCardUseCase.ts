import { KudosCardRepo } from "../../../domain/repositories/KudosCardRepo";
import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { CreateKudosCardMapper } from "./CreateKudosCardMapper";
import { CreateKudosCardRequestDto } from "./CreateKudosCardRequestDto";
import { CreateKudosCardResponseDto } from "./CreateKudosCardResponseDto";
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
    private kudosCardRepo: KudosCardRepo,
    private teamRepo: TeamRepo,
    private categoryRepo: CategoryRepo,
    private userRepo: UserRepo
  ) {}

  /**
   * Execute the use case
   * @param requestDto The data for creating a new kudos card
   * @param userId The ID of the user creating the kudos card
   * @returns Promise resolving to the created kudos card data
   * @throws TeamNotFoundError if the team with the given ID doesn't exist
   * @throws CategoryNotFoundError if the category with the given ID doesn't exist
   * @throws KudosCardValidationError if the input data is invalid
   * @throws InsufficientPermissionsError if the user doesn't have permission to create kudos cards
   */
  async execute(
    requestDto: CreateKudosCardRequestDto,
    userId: string
  ): Promise<CreateKudosCardResponseDto> {
    try {
      // Check if user has permission to create kudos cards (role = lead or admin)
      const user = await this.userRepo.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (!(user.role === 1 || user.role === 2)) {
        // 1 = admin, 2 = lead
        throw new InsufficientPermissionsError("Tech Lead or Admin");
      }

      // Verify team exists
      const team = await this.teamRepo.findById(
        requestDto.teamId
      );
      if (!team) {
        throw new TeamNotFoundError(requestDto.teamId);
      }

      // Verify category exists
      const category = await this.categoryRepo.findById(
        requestDto.categoryId
      );
      if (!category) {
        throw new CategoryNotFoundError(requestDto.categoryId);
      }

      // Convert DTO to domain entity props
      const kudosCardProps = {
        id: 0, // Temporary ID that will be replaced by the database
        recipientName: requestDto.recipientName,
        teamId: requestDto.teamId,
        categoryId: requestDto.categoryId,
        message: requestDto.message,
        createdBy: userId
      };

      // Create the domain entity
      const kudosCard = KudosCard.create(kudosCardProps);

      // Save to repository
      const savedKudosCard = await this.kudosCardRepo.create(kudosCard);

      // Return enriched DTO with team and category names
      return CreateKudosCardMapper.toResponseDto(
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