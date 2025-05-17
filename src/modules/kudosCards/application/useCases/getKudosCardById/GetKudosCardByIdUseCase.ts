import { KudosCardRepo } from "../../../domain/repositories/KudosCardRepo";
import { TeamRepo } from "../../../../teams/domain/repositories/TeamRepo";
import { CategoryRepo } from "../../../../categories/domain/repositories/CategoryRepo";
import { UserRepo } from "../../../../auth/domain/repositories/UserRepo";
import { KudosCardMapper } from "../../mappers/KudosCardMapper";
import { KudosCardDTO } from "../../dtos/KudosCardDTOs";
import { KudosCardNotFoundError } from "../../../domain/exceptions/KudosCardExceptions";
import { TeamNotFoundError } from "../../../../teams/domain/exceptions/TeamExceptions";
import { CategoryNotFoundError } from "../../../../categories/domain/exceptions/CategoryExceptions";

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
   * @param id The ID of the kudos card to retrieve
   * @returns Promise resolving to the kudos card data
   * @throws KudosCardNotFoundError if the kudos card with the given ID doesn't exist
   * @throws TeamNotFoundError if the team does not exist
   * @throws CategoryNotFoundError if the category does not exist
   */
  async execute(id: string): Promise<KudosCardDTO> {
    // Find the kudos card
    const kudosCard = await this.kudosCardRepo.findById(id);
    if (!kudosCard) {
      throw new KudosCardNotFoundError(id);
    }

    // Get team details
    const team = await this.teamRepo.findById(kudosCard.teamId);
    if (!team) {
      throw new TeamNotFoundError(kudosCard.teamId);
    }

    // Get category details
    const category = await this.categoryRepo.findById(kudosCard.categoryId);
    if (!category) {
      throw new CategoryNotFoundError(kudosCard.categoryId);
    }

    // Get creator details
    const creator = await this.userRepo.findById(kudosCard.createdBy);
    const creatorName = creator
      ? `${creator.firstName} ${creator.lastName}`
      : "Unknown User";

    // Get sender details (if different from creator)
    let senderName = creatorName;
    if (kudosCard.sentBy && kudosCard.sentBy !== kudosCard.createdBy) {
      const sender = await this.userRepo.findById(kudosCard.sentBy);
      if (sender) {
        senderName = `${sender.firstName} ${sender.lastName}`;
      }
    }

    // Return the DTO using the shared mapper
    return KudosCardMapper.toDTO(
      kudosCard,
      team.name,
      category.name,
      creatorName,
      senderName
    );
  }
}
