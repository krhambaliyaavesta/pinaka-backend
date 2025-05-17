import { KudosCardRepository } from "../../../domain/repositories/KudosCardRepository";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";
import { KudosCardMapper } from "../../mappers/KudosCardMapper";
import { KudosCardDTO } from "../../dtos/KudosCardDTOs";
import { KudosCardNotFoundError } from "../../../domain/exceptions/KudosCardExceptions";
import { UserRepo } from "../../../../auth/domain/repositories/UserRepo";

/**
 * Use case for retrieving a kudos card by ID
 */
export class GetKudosCardByIdUseCase {
  constructor(
    private kudosCardRepository: KudosCardRepository,
    private teamRepository: TeamRepository,
    private categoryRepository: CategoryRepository,
    private userRepository: UserRepo
  ) {}

  /**
   * Execute the use case
   * @param id The ID of the kudos card to retrieve
   * @returns Promise resolving to a KudosCardDTO
   * @throws KudosCardNotFoundError if the kudos card doesn't exist
   */
  async execute(id: string): Promise<KudosCardDTO> {
    // Get the kudos card
    const kudosCard = await this.kudosCardRepository.findById(id);

    if (!kudosCard) {
      throw new KudosCardNotFoundError(id);
    }

    // Get the team
    const team = await this.teamRepository.findById(kudosCard.teamId);
    if (!team) {
      throw new Error(`Team with ID ${kudosCard.teamId} not found`);
    }

    // Get the category
    const category = await this.categoryRepository.findById(
      kudosCard.categoryId
    );
    if (!category) {
      throw new Error(`Category with ID ${kudosCard.categoryId} not found`);
    }

    // Get the creator
    const creator = await this.userRepository.findById(kudosCard.createdBy);
    const creatorName = creator
      ? `${creator.firstName} ${creator.lastName}`
      : "Unknown User";

    // Convert to DTO with enriched data
    return KudosCardMapper.toDTO(
      kudosCard,
      team.name,
      category.name,
      creatorName
    );
  }
}
