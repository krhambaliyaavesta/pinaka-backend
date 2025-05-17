import { KudosCardRepo } from "../../../domain/repositories/KudosCardRepo";
import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { UserRepo } from "../../../../auth/domain/repositories/UserRepo";
import { GetKudosCardByIdMapper } from "./GetKudosCardByIdMapper";
import { GetKudosCardByIdRequestDto } from "./GetKudosCardByIdRequestDto";
import { GetKudosCardByIdResponseDto } from "./GetKudosCardByIdResponseDto";
import { KudosCardNotFoundError } from "../../../domain/exceptions/KudosCardExceptions";

/**
 * Use case for getting a kudos card by ID
 */
export class GetKudosCardByIdUseCase {
  constructor(
    private kudosCardRepo: KudosCardRepo,
    private teamRepo: TeamRepo,
    private categoryRepo: CategoryRepo,
    private userRepo: UserRepo
  ) {}

  /**
   * Execute the use case
   * @param requestDto The request with the kudos card ID
   * @returns Promise resolving to the kudos card data
   * @throws KudosCardNotFoundError if the kudos card with the given ID doesn't exist
   */
  async execute(
    requestDto: GetKudosCardByIdRequestDto
  ): Promise<GetKudosCardByIdResponseDto> {
    // Find the kudos card
    const kudosCard = await this.kudosCardRepo.findById(requestDto.id);
    if (!kudosCard) {
      throw new KudosCardNotFoundError(requestDto.id);
    }

    // Get team details
    const team = await this.teamRepo.findById(kudosCard.teamId);
    if (!team) {
      throw new Error(`Team with ID ${kudosCard.teamId} not found`);
    }

    // Get category details
    const category = await this.categoryRepo.findById(kudosCard.categoryId);
    if (!category) {
      throw new Error(`Category with ID ${kudosCard.categoryId} not found`);
    }

    // Get creator details
    const creator = await this.userRepo.findById(kudosCard.createdBy);
    const creatorName = creator
      ? `${creator.firstName} ${creator.lastName}`
      : "Unknown User";

    // Return the response DTO
    return GetKudosCardByIdMapper.toResponseDto(
      kudosCard,
      team.name,
      category.name,
      creatorName
    );
  }
} 