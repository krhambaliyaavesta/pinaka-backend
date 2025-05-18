import { CreateKudosCardUseCase } from "../../../../../modules/kudosCards/application/useCases/createKudosCard/CreateKudosCardUseCase";
import { KudosCardRepo } from "../../../../../modules/kudosCards/domain/repositories/KudosCardRepo";
import { TeamRepo } from "../../../../../modules/teams/domain/repositories/TeamRepo";
import { CategoryRepo } from "../../../../../modules/categories/domain/repositories/CategoryRepo";
import { UserRepo } from "../../../../../modules/auth/domain/repositories/UserRepo";
import { User } from "../../../../../modules/auth/domain/entities/User";
import { Team } from "../../../../../modules/teams/domain/entities/Team";
import { Category } from "../../../../../modules/categories/domain/entities/Category";
import { KudosCard } from "../../../../../modules/kudosCards/domain/entities/KudosCard";
import {
  KudosCardValidationError,
  InsufficientPermissionsError,
} from "../../../../../modules/kudosCards/domain/exceptions/KudosCardExceptions";
import { validKudosCardProps } from "../../../../fixtures/kudosCards.fixtures";
import { validTeamProps } from "../../../../fixtures/teams.fixtures";
import { validCategoryProps } from "../../../../fixtures/categories.fixtures";
import {
  validUserProps,
  adminUserProps,
} from "../../../../fixtures/users.fixtures";

describe("CreateKudosCardUseCase", () => {
  let createKudosCardUseCase: CreateKudosCardUseCase;
  let mockKudosCardRepo: jest.Mocked<KudosCardRepo>;
  let mockTeamRepo: jest.Mocked<TeamRepo>;
  let mockCategoryRepo: jest.Mocked<CategoryRepo>;
  let mockUserRepo: jest.Mocked<UserRepo>;
  let mockKudosCard: KudosCard;
  let mockTeam: Team;
  let mockCategory: Category;

  beforeEach(() => {
    // Create mock repositories
    mockKudosCardRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockTeamRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCategoryRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUserRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Create the use case with mocked repositories
    createKudosCardUseCase = new CreateKudosCardUseCase(
      mockKudosCardRepo,
      mockTeamRepo,
      mockCategoryRepo,
      mockUserRepo
    );

    // Create mock entities
    mockTeam = Team.create(validTeamProps);
    mockCategory = Category.create(validCategoryProps);

    // Create mocks with string IDs
    const kudosCardPropsWithStringId = {
      ...validKudosCardProps,
      id: "1", // Use a string ID
    };
    mockKudosCard = KudosCard.create(kudosCardPropsWithStringId);

    // Setup admin user (role 1)
    const adminUser = {
      id: "admin-id",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: 1, // Admin role
      isActive: true,
      isAdmin: true,
    };

    // Setup regular user (role 3)
    const regularUser = {
      id: "user-id",
      email: "user@example.com",
      firstName: "Regular",
      lastName: "User",
      role: 3, // Regular user role
      isActive: true,
      isAdmin: false,
    };

    // Set up mock behavior
    mockUserRepo.findById.mockImplementation((id) => {
      if (id === "admin-id") return Promise.resolve(adminUser as any);
      if (id === "user-id") return Promise.resolve(regularUser as any);
      return Promise.resolve(null);
    });

    mockTeamRepo.findById.mockResolvedValue(mockTeam);
    mockCategoryRepo.findById.mockResolvedValue(mockCategory);
    mockKudosCardRepo.create.mockResolvedValue(mockKudosCard);
  });

  it("should successfully create a kudos card with valid data", async () => {
    // Arrange
    const requestDto = {
      recipientName: "John Doe",
      teamId: 1,
      categoryId: 1,
      message: "Great job on the project!",
    };

    // Act
    const result = await createKudosCardUseCase.execute(requestDto, "admin-id");

    // Assert
    expect(result).toBeDefined();
    expect(mockTeamRepo.findById).toHaveBeenCalledWith(requestDto.teamId);
    expect(mockCategoryRepo.findById).toHaveBeenCalledWith(
      requestDto.categoryId
    );
    expect(mockKudosCardRepo.create).toHaveBeenCalled();
    expect(result.recipientName).toBe(requestDto.recipientName);
    expect(result.teamId).toBe(requestDto.teamId);
    expect(result.message).toBe(requestDto.message);
  });

  it("should allow an admin to create a kudos card on behalf of another user", async () => {
    // Arrange
    const requestDto = {
      recipientName: "John Doe",
      teamId: 1,
      categoryId: 1,
      message: "Great job!",
      sentBy: "user-id", // Create on behalf of a regular user
    };

    // Setup a mock return value with the correct sentBy field
    const modifiedKudosCard = {
      ...mockKudosCard,
      sentBy: requestDto.sentBy,
    };
    mockKudosCardRepo.create.mockResolvedValue(modifiedKudosCard as any);

    // Act
    const result = await createKudosCardUseCase.execute(requestDto, "admin-id");

    // Assert
    expect(result).toBeDefined();
    expect(result.sentBy).toBe(requestDto.sentBy);
  });

  it("should throw error if team is not found", async () => {
    // Arrange
    const requestDto = {
      recipientName: "John Doe",
      teamId: 999, // Non-existent team
      categoryId: 1,
      message: "Great work!",
    };

    mockTeamRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      createKudosCardUseCase.execute(requestDto, "admin-id")
    ).rejects.toThrow(/team not found/i);
  });

  it("should throw error if category is not found", async () => {
    // Arrange
    const requestDto = {
      recipientName: "John Doe",
      teamId: 1,
      categoryId: 999, // Non-existent category
      message: "Great work!",
    };

    mockCategoryRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      createKudosCardUseCase.execute(requestDto, "admin-id")
    ).rejects.toThrow(/category not found/i);
  });

  it("should throw error if user doesn't have permission to create kudos cards", async () => {
    // Arrange
    const requestDto = {
      recipientName: "John Doe",
      teamId: 1,
      categoryId: 1,
      message: "Great work!",
    };

    // Act & Assert
    await expect(
      createKudosCardUseCase.execute(requestDto, "user-id")
    ).rejects.toThrow(InsufficientPermissionsError);
  });

  it("should throw error if user doesn't exist", async () => {
    // Arrange
    const requestDto = {
      recipientName: "John Doe",
      teamId: 1,
      categoryId: 1,
      message: "Great work!",
    };

    mockUserRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      createKudosCardUseCase.execute(requestDto, "non-existent-id")
    ).rejects.toThrow("User not found");
  });

  it("should throw error if sentBy user doesn't exist", async () => {
    // Arrange
    const requestDto = {
      recipientName: "John Doe",
      teamId: 1,
      categoryId: 1,
      message: "Great work!",
      sentBy: "non-existent-id",
    };

    // Act & Assert
    await expect(
      createKudosCardUseCase.execute(requestDto, "admin-id")
    ).rejects.toThrow(/User with ID .* not found/);
  });

  it("should validate recipient name is not empty", async () => {
    // Arrange
    const requestDto = {
      recipientName: "", // Empty name
      teamId: 1,
      categoryId: 1,
      message: "Great work!",
    };

    // Act & Assert
    await expect(
      createKudosCardUseCase.execute(requestDto, "admin-id")
    ).rejects.toThrow(KudosCardValidationError);
  });

  it("should validate message is not empty", async () => {
    // Arrange
    const requestDto = {
      recipientName: "John Doe",
      teamId: 1,
      categoryId: 1,
      message: "", // Empty message
    };

    // Act & Assert
    await expect(
      createKudosCardUseCase.execute(requestDto, "admin-id")
    ).rejects.toThrow(KudosCardValidationError);
  });
});
