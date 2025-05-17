import { KudosCardRepo } from "../../../domain/repositories/KudosCardRepo";
import { TeamRepo } from "../../../../teams/domain/repositories/TeamRepo";
import { CategoryRepo } from "../../../../categories/domain/repositories/CategoryRepo";
import { KudosCardMapper } from "../../mappers/KudosCardMapper";
import { KudosCardDTO, KudosCardFilterDTO } from "../../dtos/KudosCardDTOs";
import { UserRepo } from "../../../../auth/domain/repositories/UserRepo";

/**
 * Use case for retrieving kudos cards with filtering
 */
export class GetKudosCardsUseCase {
  constructor(
    private kudosCardRepo: KudosCardRepo,
    private teamRepo: TeamRepo,
    private categoryRepo: CategoryRepo,
    private userRepo: UserRepo
  ) {}

  /**
   * Execute the use case
   * @param filterDTO Optional filter criteria for kudos cards
   * @returns Promise resolving to an array of KudosCardDTOs
   */
  async execute(filterDTO?: KudosCardFilterDTO): Promise<KudosCardDTO[]> {
    // Convert filter DTO to domain filter
    const filter = filterDTO
      ? KudosCardMapper.toFilterDomain(filterDTO)
      : undefined;

    // Get kudos cards from repository
    const kudosCards = await this.kudosCardRepo.findAll(filter);

    // Create a map of team IDs to team names for efficiency
    const teamIds = [...new Set(kudosCards.map((card) => card.teamId))];
    const teamMap = new Map<number, string>();
    for (const teamId of teamIds) {
      const team = await this.teamRepo.findById(teamId);
      if (team) {
        teamMap.set(teamId, team.name);
      }
    }

    // Create a map of category IDs to category names for efficiency
    const categoryIds = [...new Set(kudosCards.map((card) => card.categoryId))];
    const categoryMap = new Map<number, string>();
    for (const categoryId of categoryIds) {
      const category = await this.categoryRepo.findById(categoryId);
      if (category) {
        categoryMap.set(categoryId, category.name);
      }
    }

    // Create a map of user IDs to user names for efficiency
    const userIds = [...new Set(kudosCards.map((card) => card.createdBy))];
    const userMap = new Map<string, string>();
    for (const userId of userIds) {
      const user = await this.userRepo.findById(userId);
      if (user) {
        userMap.set(userId, `${user.firstName} ${user.lastName}`);
      }
    }

    // Convert domain entities to DTOs with enriched data
    return kudosCards.map((kudosCard) =>
      KudosCardMapper.toDTO(
        kudosCard,
        teamMap.get(kudosCard.teamId) || "Unknown Team",
        categoryMap.get(kudosCard.categoryId) || "Unknown Category",
        userMap.get(kudosCard.createdBy) || "Unknown User"
      )
    );
  }
}
