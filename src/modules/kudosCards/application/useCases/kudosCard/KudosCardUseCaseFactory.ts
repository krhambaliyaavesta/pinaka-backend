import { KudosCardsModuleFactory } from "../../../../../shared/factories/KudosCardsModuleFactory";
import { AuthModuleFactory } from "../../../../../shared/factories/AuthModuleFactory";
import { CreateKudosCardUseCase } from "./CreateKudosCardUseCase";
import { GetKudosCardsUseCase } from "./GetKudosCardsUseCase";
import { GetKudosCardByIdUseCase } from "./GetKudosCardByIdUseCase";
import { UpdateKudosCardUseCase } from "./UpdateKudosCardUseCase";
import { DeleteKudosCardUseCase } from "./DeleteKudosCardUseCase";
import { GetTopRecipientsUseCase } from "./analytics/GetTopRecipientsUseCase";
import { GetTopTeamsUseCase } from "./analytics/GetTopTeamsUseCase";
import { GetTrendingCategoriesUseCase } from "./analytics/GetTrendingCategoriesUseCase";
import { GetTrendingKeywordsUseCase } from "./analytics/GetTrendingKeywordsUseCase";

/**
 * Factory for creating kudos card-related use cases
 */
export class KudosCardUseCaseFactory {
  /**
   * Creates a use case for getting kudos cards with filtering
   */
  static createGetKudosCardsUseCase(): GetKudosCardsUseCase {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();
    const teamRepo = KudosCardsModuleFactory.getTeamRepo();
    const categoryRepo = KudosCardsModuleFactory.getCategoryRepo();
    const userRepo = AuthModuleFactory.getUserRepo();

    return new GetKudosCardsUseCase(
      kudosCardRepo,
      teamRepo,
      categoryRepo,
      userRepo
    );
  }

  /**
   * Creates a use case for getting a kudos card by ID
   */
  static createGetKudosCardByIdUseCase(): GetKudosCardByIdUseCase {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();
    const teamRepo = KudosCardsModuleFactory.getTeamRepo();
    const categoryRepo = KudosCardsModuleFactory.getCategoryRepo();
    const userRepo = AuthModuleFactory.getUserRepo();

    return new GetKudosCardByIdUseCase(
      kudosCardRepo,
      teamRepo,
      categoryRepo,
      userRepo
    );
  }

  /**
   * Creates a use case for creating a kudos card
   */
  static createCreateKudosCardUseCase(): CreateKudosCardUseCase {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();
    const teamRepo = KudosCardsModuleFactory.getTeamRepo();
    const categoryRepo = KudosCardsModuleFactory.getCategoryRepo();
    const userRepo = AuthModuleFactory.getUserRepo();

    return new CreateKudosCardUseCase(
      kudosCardRepo,
      teamRepo,
      categoryRepo,
      userRepo
    );
  }

  /**
   * Creates a use case for updating a kudos card
   */
  static createUpdateKudosCardUseCase(): UpdateKudosCardUseCase {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();
    const teamRepo = KudosCardsModuleFactory.getTeamRepo();
    const categoryRepo = KudosCardsModuleFactory.getCategoryRepo();
    const userRepo = AuthModuleFactory.getUserRepo();

    return new UpdateKudosCardUseCase(
      kudosCardRepo,
      teamRepo,
      categoryRepo,
      userRepo
    );
  }

  /**
   * Creates a use case for deleting a kudos card
   */
  static createDeleteKudosCardUseCase(): DeleteKudosCardUseCase {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();
    const userRepo = AuthModuleFactory.getUserRepo();

    return new DeleteKudosCardUseCase(kudosCardRepo, userRepo);
  }

  /**
   * Creates a use case for getting top recipients analytics
   */
  static createGetTopRecipientsUseCase(): GetTopRecipientsUseCase {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();

    return new GetTopRecipientsUseCase(kudosCardRepo);
  }

  /**
   * Creates a use case for getting top teams analytics
   */
  static createGetTopTeamsUseCase(): GetTopTeamsUseCase {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();

    return new GetTopTeamsUseCase(kudosCardRepo);
  }

  /**
   * Creates a use case for getting trending categories analytics
   */
  static createGetTrendingCategoriesUseCase(): GetTrendingCategoriesUseCase {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();

    return new GetTrendingCategoriesUseCase(kudosCardRepo);
  }

  /**
   * Creates a use case for getting trending keywords analytics
   */
  static createGetTrendingKeywordsUseCase(): GetTrendingKeywordsUseCase {
    const kudosCardRepo = KudosCardsModuleFactory.getKudosCardRepo();

    return new GetTrendingKeywordsUseCase(kudosCardRepo);
  }
}
