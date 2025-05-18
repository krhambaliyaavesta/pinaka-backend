import { GetKudosCardByIdUseCase } from "../../../../../modules/kudosCards/application/useCases/getKudosCardById/GetKudosCardByIdUseCase";
import { KudosCardRepo } from "../../../../../modules/kudosCards/domain/repositories/KudosCardRepo";
import { TeamRepo } from "../../../../../modules/teams/domain/repositories/TeamRepo";
import { CategoryRepo } from "../../../../../modules/categories/domain/repositories/CategoryRepo";
import { UserRepo } from "../../../../../modules/auth/domain/repositories/UserRepo";
import { Team } from "../../../../../modules/teams/domain/entities/Team";
import { Category } from "../../../../../modules/categories/domain/entities/Category";
import { KudosCard } from "../../../../../modules/kudosCards/domain/entities/KudosCard";
import { KudosCardNotFoundError } from "../../../../../modules/kudosCards/domain/exceptions/KudosCardExceptions";
import { TeamNotFoundError } from "../../../../../modules/teams/domain/exceptions/TeamExceptions";
import { CategoryNotFoundError } from "../../../../../modules/categories/domain/exceptions/CategoryExceptions";
import {
  validTeamProps,
  validCategoryProps,
  validKudosCardProps,
} from "../../../../fixtures/kudosCards.fixtures";

describe("GetKudosCardByIdUseCase", () => {
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
  let getKudosCardByIdUseCase: GetKudosCardByIdUseCase;
  let mockTeam: Team;
  let mockCategory: Category;
  let mockKudosCard: KudosCard;
  let adminUser: any;
  let regularUser: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create the use case with mocked repositories
    getKudosCardByIdUseCase = new GetKudosCardByIdUseCase(
      mockKudosCardRepo,
      mockTeamRepo,
      mockCategoryRepo,
      mockUserRepo
    );

    // Create mock entities with proper types
    mockTeam = Team.create(validTeamProps);
    mockCategory = Category.create(validCategoryProps);

    // Use the string ID from fixtures directly
    mockKudosCard = KudosCard.create(validKudosCardProps);

    // Setup admin user (role 1)
    adminUser = {
      id: "123e4567-e89b-12d3-a456-426614174000", // Match the createdBy ID from fixtures
      email: "admin@example.com",
      password: "hashedpassword",
      firstName: "Admin",
      lastName: "User",
      role: 1, // Admin role
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isAdmin: true,
      isActive: true,
      displayName: "Admin User",
      verifyPassword: jest.fn(),
    };

    // Setup regular user (role 3)
    regularUser = {
      id: "regular-user-id",
      email: "regular@example.com",
      password: "hashedpassword",
      firstName: "Regular",
      lastName: "User",
      role: 3, // Regular user role
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isAdmin: false,
      isActive: true,
      displayName: "Regular User",
      verifyPassword: jest.fn(),
    };

    // Set up default mock behavior
    mockUserRepo.findById.mockImplementation((id) => {
      if (id === adminUser.id) return Promise.resolve(adminUser);
      if (id === regularUser.id) return Promise.resolve(regularUser);
      return Promise.resolve(null);
    });
    mockTeamRepo.findById.mockResolvedValue(mockTeam);
    mockCategoryRepo.findById.mockResolvedValue(mockCategory);
    mockKudosCardRepo.findById.mockResolvedValue(mockKudosCard);
  });

  it("should successfully retrieve a kudos card by ID", async () => {
    // Arrange
    const kudosCardId = validKudosCardProps.id;

    // Act
    const result = await getKudosCardByIdUseCase.execute(kudosCardId);

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe(mockKudosCard.id);
    expect(result.recipientName).toBe(mockKudosCard.recipientName);
    expect(result.teamId).toBe(mockKudosCard.teamId);
    expect(result.teamName).toBe(mockTeam.name);
    expect(result.categoryId).toBe(mockKudosCard.categoryId);
    expect(result.categoryName).toBe(mockCategory.name);
    expect(result.message).toBe(mockKudosCard.message);
    expect(result.createdBy).toBe(mockKudosCard.createdBy);
    // sentBy should default to createdBy if not specified
    expect(result.sentBy).toBe(mockKudosCard.createdBy);
    expect(result.senderName).toBe(
      `${adminUser.firstName} ${adminUser.lastName}`
    );

    // Verify repository calls
    expect(mockKudosCardRepo.findById).toHaveBeenCalledWith(kudosCardId);
    expect(mockTeamRepo.findById).toHaveBeenCalledWith(mockKudosCard.teamId);
    expect(mockCategoryRepo.findById).toHaveBeenCalledWith(
      mockKudosCard.categoryId
    );
    expect(mockUserRepo.findById).toHaveBeenCalledWith(mockKudosCard.createdBy);
  });

  it("should retrieve a kudos card with sentBy field different from createdBy", async () => {
    // Arrange
    const kudosCardId = "1";

    // Create a kudos card with sentBy field
    const kudosCardWithSentBy = Object.create(mockKudosCard);
    Object.defineProperty(kudosCardWithSentBy, "createdBy", {
      get: () => adminUser.id,
    });
    Object.defineProperty(kudosCardWithSentBy, "sentBy", {
      get: () => regularUser.id,
    });

    mockKudosCardRepo.findById.mockResolvedValue(kudosCardWithSentBy);

    // Act
    const result = await getKudosCardByIdUseCase.execute(kudosCardId);

    // Assert
    expect(result).toBeDefined();
    expect(result.createdBy).toBe(adminUser.id);
    expect(result.creatorName).toBe(
      `${adminUser.firstName} ${adminUser.lastName}`
    );
    expect(result.sentBy).toBe(regularUser.id);
    expect(result.senderName).toBe(
      `${regularUser.firstName} ${regularUser.lastName}`
    );

    // Verify repository calls
    expect(mockKudosCardRepo.findById).toHaveBeenCalledWith(kudosCardId);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(adminUser.id);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(regularUser.id);
  });

  it("should throw KudosCardNotFoundError when kudos card doesn't exist", async () => {
    // Arrange
    const nonExistentKudosCardId = "999";
    mockKudosCardRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      getKudosCardByIdUseCase.execute(nonExistentKudosCardId)
    ).rejects.toThrow(KudosCardNotFoundError);

    // Verify repository calls
    expect(mockKudosCardRepo.findById).toHaveBeenCalledWith(
      nonExistentKudosCardId
    );
    expect(mockTeamRepo.findById).not.toHaveBeenCalled();
    expect(mockCategoryRepo.findById).not.toHaveBeenCalled();
    expect(mockUserRepo.findById).not.toHaveBeenCalled();
  });

  it("should throw TeamNotFoundError when team doesn't exist", async () => {
    // Arrange
    const kudosCardId = "1";
    mockTeamRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getKudosCardByIdUseCase.execute(kudosCardId)).rejects.toThrow(
      TeamNotFoundError
    );

    // Verify repository calls
    expect(mockKudosCardRepo.findById).toHaveBeenCalledWith(kudosCardId);
    expect(mockTeamRepo.findById).toHaveBeenCalledWith(mockKudosCard.teamId);
    expect(mockCategoryRepo.findById).not.toHaveBeenCalled();
    expect(mockUserRepo.findById).not.toHaveBeenCalled();
  });

  it("should throw CategoryNotFoundError when category doesn't exist", async () => {
    // Arrange
    const kudosCardId = "1";
    mockCategoryRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getKudosCardByIdUseCase.execute(kudosCardId)).rejects.toThrow(
      CategoryNotFoundError
    );

    // Verify repository calls
    expect(mockKudosCardRepo.findById).toHaveBeenCalledWith(kudosCardId);
    expect(mockTeamRepo.findById).toHaveBeenCalledWith(mockKudosCard.teamId);
    expect(mockCategoryRepo.findById).toHaveBeenCalledWith(
      mockKudosCard.categoryId
    );
    expect(mockUserRepo.findById).not.toHaveBeenCalled();
  });

  it("should handle missing creator user correctly", async () => {
    // Arrange
    const kudosCardId = "1";
    mockUserRepo.findById.mockResolvedValue(null);

    // Act
    const result = await getKudosCardByIdUseCase.execute(kudosCardId);

    // Assert
    expect(result).toBeDefined();
    expect(result.creatorName).toBe("Unknown User");
    expect(result.senderName).toBe("Unknown User");

    // Verify repository calls
    expect(mockKudosCardRepo.findById).toHaveBeenCalledWith(kudosCardId);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(mockKudosCard.createdBy);
  });
});
