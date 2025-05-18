import { GetKudosCardsUseCase } from "../../../../../modules/kudosCards/application/useCases/getKudosCards/GetKudosCardsUseCase";
import { KudosCardRepo } from "../../../../../modules/kudosCards/domain/repositories/KudosCardRepo";
import { TeamRepo } from "../../../../../modules/teams/domain/repositories/TeamRepo";
import { CategoryRepo } from "../../../../../modules/categories/domain/repositories/CategoryRepo";
import { UserRepo } from "../../../../../modules/auth/domain/repositories/UserRepo";
import { Team } from "../../../../../modules/teams/domain/entities/Team";
import { Category } from "../../../../../modules/categories/domain/entities/Category";
import { KudosCard } from "../../../../../modules/kudosCards/domain/entities/KudosCard";
import {
  validTeamProps,
  validCategoryProps,
  validKudosCardProps,
} from "../../../../fixtures/kudosCards.fixtures";
import { KudosCardFilterDTO } from "../../../../../modules/kudosCards/application/dtos/KudosCardDTOs";

describe("GetKudosCardsUseCase", () => {
  // Mocks
  const mockKudosCardRepo: jest.Mocked<KudosCardRepo> = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
    getTopRecipients: jest.fn(),
    getTopTeams: jest.fn(),
    getTrendingCategories: jest.fn(),
    getTrendingKeywords: jest.fn(),
  };

  const mockTeamRepo: jest.Mocked<TeamRepo> = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategoryRepo: jest.Mocked<CategoryRepo> = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepo: jest.Mocked<UserRepo> = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // Set up mocks for tests
  let getKudosCardsUseCase: GetKudosCardsUseCase;
  let mockTeam: Team;
  let mockCategory: Category;
  let mockKudosCard1: KudosCard;
  let mockKudosCard2: KudosCard;
  let adminUser: any;
  let regularUser: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create the use case with mocked repositories
    getKudosCardsUseCase = new GetKudosCardsUseCase(
      mockKudosCardRepo,
      mockTeamRepo,
      mockCategoryRepo,
      mockUserRepo
    );

    // Setup the users first
    adminUser = {
      id: "admin-user-id",
      email: "admin@example.com",
      password: "hashedpassword",
      firstName: "Admin",
      lastName: "User",
      role: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isAdmin: true,
      isActive: true,
      displayName: "Admin User",
      verifyPassword: jest.fn(),
    };

    regularUser = {
      id: "regular-user-id",
      email: "regular@example.com",
      password: "hashedpassword",
      firstName: "Regular",
      lastName: "User",
      role: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isAdmin: false,
      isActive: true,
      displayName: "Regular User",
      verifyPassword: jest.fn(),
    };

    // Create mock entities
    mockTeam = Team.create(validTeamProps);
    mockCategory = Category.create(validCategoryProps);

    // Initialize mock kudos card entities with string IDs
    const kudosCardProps1 = {
      id: "1",
      createdBy: adminUser.id,
      sentBy: undefined,
      recipientName: "John Doe",
      teamId: 1,
      categoryId: 1,
      message: "Great job!",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const kudosCardProps2 = {
      id: "2",
      recipientName: "Jane Smith",
      createdBy: adminUser.id,
      teamId: 2,
      categoryId: 2,
      message: "Excellent work!",
      sentBy: regularUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    // Create kudos cards with the props
    mockKudosCard1 = KudosCard.create(kudosCardProps1);
    mockKudosCard2 = KudosCard.create(kudosCardProps2);

    // Set up default mock behaviors
    mockUserRepo.findById.mockImplementation((id) => {
      if (id === adminUser.id) return Promise.resolve(adminUser);
      if (id === regularUser.id) return Promise.resolve(regularUser);
      return Promise.resolve(null);
    });

    mockTeamRepo.findById.mockImplementation((id) => {
      if (id === mockTeam.id) return Promise.resolve(mockTeam);
      return Promise.resolve(null);
    });

    mockCategoryRepo.findById.mockImplementation((id) => {
      if (id === mockCategory.id) return Promise.resolve(mockCategory);
      return Promise.resolve(null);
    });

    mockKudosCardRepo.findAll.mockImplementation((filters) => {
      if (filters && filters.recipientName === "John" && filters.teamId === 1) {
        return Promise.resolve([mockKudosCard1]);
      }
      return Promise.resolve([mockKudosCard1, mockKudosCard2]);
    });
  });

  it("should retrieve all kudos cards with proper sender information", async () => {
    // Act
    const result = await getKudosCardsUseCase.execute({});

    // Assert results
    expect(result.length).toBe(2);

    // First card: created and sent by admin
    expect(result[0].id).toBe(mockKudosCard1.id);
    expect(result[0].createdBy).toBe(adminUser.id);
    expect(result[0].creatorName).toBe(
      `${adminUser.firstName} ${adminUser.lastName}`
    );
    expect(result[0].sentBy).toBe(adminUser.id);
    expect(result[0].senderName).toBe(
      `${adminUser.firstName} ${adminUser.lastName}`
    );

    // Second card: created by admin but sent on behalf of regular user
    expect(result[1].id).toBe(mockKudosCard2.id);
    expect(result[1].createdBy).toBe(adminUser.id);
    expect(result[1].creatorName).toBe(
      `${adminUser.firstName} ${adminUser.lastName}`
    );
    expect(result[1].sentBy).toBe(regularUser.id);
    expect(result[1].senderName).toBe(
      `${regularUser.firstName} ${regularUser.lastName}`
    );
  });

  it("should apply filters correctly", async () => {
    // Arrange
    const filters = {
      recipientName: "John",
      teamId: 1,
    };

    // Act
    const result = await getKudosCardsUseCase.execute(filters);

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(mockKudosCard1.id);
  });

  it("should handle unknown users gracefully", async () => {
    // Arrange
    mockUserRepo.findById.mockResolvedValue(null);

    // Act
    const result = await getKudosCardsUseCase.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(2);

    // Both cards should have unknown user names
    expect(result[0].creatorName).toBe("Unknown User");
    expect(result[0].senderName).toBe("Unknown User");
    expect(result[1].creatorName).toBe("Unknown User");
    expect(result[1].senderName).toBe("Unknown User");
  });

  it("should handle unknown teams gracefully", async () => {
    // Arrange
    mockTeamRepo.findById.mockResolvedValue(null);

    // Act
    const result = await getKudosCardsUseCase.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(2);

    // Both cards should have unknown team names
    expect(result[0].teamName).toBe("Unknown Team");
    expect(result[1].teamName).toBe("Unknown Team");
  });

  it("should handle unknown categories gracefully", async () => {
    // Arrange
    mockCategoryRepo.findById.mockResolvedValue(null);

    // Act
    const result = await getKudosCardsUseCase.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(2);

    // Both cards should have unknown category names
    expect(result[0].categoryName).toBe("Unknown Category");
    expect(result[1].categoryName).toBe("Unknown Category");
  });

  it("should return an empty array when no kudos cards are found", async () => {
    // Arrange
    mockKudosCardRepo.findAll.mockResolvedValue([]);

    // Act
    const result = await getKudosCardsUseCase.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
    expect(mockTeamRepo.findById).not.toHaveBeenCalled();
    expect(mockCategoryRepo.findById).not.toHaveBeenCalled();
    expect(mockUserRepo.findById).not.toHaveBeenCalled();
  });
});
