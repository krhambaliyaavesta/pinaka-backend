import { UpdateUserUseCase } from "../../../../../../modules/admin/application/useCases/updateUser/UpdateUserUseCase";
import { UserRepo } from "../../../../../../modules/auth/domain/repositories/UserRepo";
import { User } from "../../../../../../modules/auth/domain/entities/User";
import {
  adminUserProps,
  techLeadUserProps,
  validUserProps,
} from "../../../../../fixtures/auth.fixtures";
import {
  UnauthorizedError,
  UserNotFoundError,
} from "../../../../../../modules/auth/domain/exceptions/AuthExceptions";

describe("UpdateUserUseCase", () => {
  // Mock repositories
  const mockUserRepo: jest.Mocked<UserRepo> = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // Setup variables for tests
  let updateUserUseCase: UpdateUserUseCase;
  let adminUser: User;
  let leadUser: User;
  let regularUser: User;
  let targetUser: User;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create the use case with mocked repo
    updateUserUseCase = new UpdateUserUseCase(mockUserRepo);

    // Create mock users
    adminUser = User.create(adminUserProps);
    leadUser = User.create(techLeadUserProps);
    regularUser = User.create(validUserProps);
    targetUser = User.create({
      ...validUserProps,
      id: "target-user-id",
      email: "target@example.com",
    });

    // Set default mock behavior
    mockUserRepo.findById.mockImplementation((id) => {
      if (id === adminUser.id) return Promise.resolve(adminUser);
      if (id === leadUser.id) return Promise.resolve(leadUser);
      if (id === regularUser.id) return Promise.resolve(regularUser);
      if (id === targetUser.id) return Promise.resolve(targetUser);
      return Promise.resolve(null);
    });

    mockUserRepo.update.mockImplementation((id, props) => {
      return Promise.resolve({
        ...targetUser,
        ...props,
      } as User);
    });
  });

  it("should allow admin to update a user's profile", async () => {
    // Arrange
    const updateData = {
      firstName: "Updated",
      lastName: "Name",
      jobTitle: "Senior Developer",
    };

    // Act
    const result = await updateUserUseCase.execute(
      adminUser.id,
      targetUser.id,
      updateData
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.firstName).toBe(updateData.firstName);
    expect(result.lastName).toBe(updateData.lastName);
    expect(result.jobTitle).toBe(updateData.jobTitle);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(adminUser.id);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(targetUser.id);
    expect(mockUserRepo.update).toHaveBeenCalledWith(
      targetUser.id,
      expect.objectContaining(updateData)
    );
  });

  it("should allow lead to update a user's profile", async () => {
    // Arrange
    const updateData = {
      firstName: "Updated",
      lastName: "Name",
      jobTitle: "Senior Developer",
    };

    // Act
    const result = await updateUserUseCase.execute(
      leadUser.id,
      targetUser.id,
      updateData
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.firstName).toBe(updateData.firstName);
    expect(result.lastName).toBe(updateData.lastName);
    expect(result.jobTitle).toBe(updateData.jobTitle);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(leadUser.id);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(targetUser.id);
    expect(mockUserRepo.update).toHaveBeenCalledWith(
      targetUser.id,
      expect.objectContaining(updateData)
    );
  });

  it("should allow admin to update a user's role", async () => {
    // Arrange
    const updateData = {
      role: 2, // Change to Lead role
    };

    // Act
    const result = await updateUserUseCase.execute(
      adminUser.id,
      targetUser.id,
      updateData
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.role).toBe(updateData.role);
    expect(mockUserRepo.update).toHaveBeenCalledWith(
      targetUser.id,
      expect.objectContaining(updateData)
    );
  });

  it("should allow lead to update a user's role", async () => {
    // Arrange
    const updateData = {
      role: 3, // Change to Member role
    };

    // Act
    const result = await updateUserUseCase.execute(
      leadUser.id,
      targetUser.id,
      updateData
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.role).toBe(updateData.role);
    expect(mockUserRepo.update).toHaveBeenCalledWith(
      targetUser.id,
      expect.objectContaining(updateData)
    );
  });

  it("should not allow regular user to update other users", async () => {
    // Arrange
    const updateData = {
      firstName: "Updated",
      lastName: "Name",
    };

    // Act & Assert
    await expect(
      updateUserUseCase.execute(regularUser.id, targetUser.id, updateData)
    ).rejects.toThrow(UnauthorizedError);
    expect(mockUserRepo.update).not.toHaveBeenCalled();
  });

  it("should allow users to update their own profiles", async () => {
    // Arrange
    const updateData = {
      firstName: "Updated",
      lastName: "Name",
      jobTitle: "Senior Developer",
    };

    // Act
    const result = await updateUserUseCase.execute(
      regularUser.id,
      regularUser.id,
      updateData
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.firstName).toBe(updateData.firstName);
    expect(mockUserRepo.update).toHaveBeenCalled();
  });

  it("should not allow non-admin/non-lead users to change their own role", async () => {
    // Arrange
    const updateData = {
      role: 1, // Try to promote to admin
    };

    // Act & Assert
    await expect(
      updateUserUseCase.execute(regularUser.id, regularUser.id, updateData)
    ).rejects.toThrow(UnauthorizedError);
    expect(mockUserRepo.update).not.toHaveBeenCalled();
  });

  it("should not allow changing of non-existent user", async () => {
    // Arrange
    mockUserRepo.findById.mockResolvedValueOnce(adminUser); // First call for logged in user
    mockUserRepo.findById.mockResolvedValueOnce(null); // Second call for target user

    const updateData = {
      firstName: "Updated",
    };

    // Act & Assert
    await expect(
      updateUserUseCase.execute(adminUser.id, "non-existent-id", updateData)
    ).rejects.toThrow(UserNotFoundError);
    expect(mockUserRepo.update).not.toHaveBeenCalled();
  });

  it("should not proceed if logged in user doesn't exist", async () => {
    // Arrange
    mockUserRepo.findById.mockResolvedValueOnce(null); // First call for logged in user

    const updateData = {
      firstName: "Updated",
    };

    // Act & Assert
    await expect(
      updateUserUseCase.execute("non-existent-id", targetUser.id, updateData)
    ).rejects.toThrow(UserNotFoundError);
    expect(mockUserRepo.update).not.toHaveBeenCalled();
  });
});
