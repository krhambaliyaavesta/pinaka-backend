import { UserRepoPgImpl } from "../../../../../modules/auth/infrastructure/repositories/UserRepoPgImpl";
import { PostgresService } from "../../../../../shared/services/PostgresService";
import { User } from "../../../../../modules/auth/domain/entities/User";
import {
  testUserData,
  validUserProps,
} from "../../../../fixtures/auth.fixtures";
import { ApprovalStatus } from "../../../../../modules/auth/domain/entities/UserTypes";

// Mocks
jest.mock("../../../../modules/auth/domain/entities/User");
jest.mock("../../../../shared/services/PostgresService");

describe("UserRepoPgImpl", () => {
  let mockDb: jest.Mocked<PostgresService>;
  let userRepo: UserRepoPgImpl;
  let mockUser: User;

  beforeEach(() => {
    // Setup mock database
    mockDb = {
      query: jest.fn(),
    } as unknown as jest.Mocked<PostgresService>;

    // Create the repository with mocked database
    userRepo = new UserRepoPgImpl(mockDb);

    // Setup mock user
    mockUser = {
      id: testUserData.id,
      email: {
        toString: () => testUserData.email,
      },
      password: {
        value: testUserData.password,
      },
      firstName: testUserData.first_name,
      lastName: testUserData.last_name,
      role: testUserData.role,
      jobTitle: testUserData.job_title,
      approvalStatus: testUserData.approval_status,
      createdAt: testUserData.created_at,
      updatedAt: testUserData.updated_at,
    } as unknown as User;

    // Mock User.fromData
    (User.fromData as jest.Mock).mockReturnValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should return a user when found by id", async () => {
      // Arrange
      const userId = testUserData.id;
      const mockRows = [testUserData];
      mockDb.query.mockResolvedValueOnce([mockRows, []]);

      // Act
      const result = await userRepo.findById(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE id = \$1/),
        [userId]
      );
      expect(User.fromData).toHaveBeenCalledWith(testUserData);
    });

    it("should return null when user not found by id", async () => {
      // Arrange
      const userId = "non-existent-id";
      mockDb.query.mockResolvedValueOnce([[], []]); // Empty result

      // Act
      const result = await userRepo.findById(userId);

      // Assert
      expect(result).toBeNull();
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE id = \$1/),
        [userId]
      );
      expect(User.fromData).not.toHaveBeenCalled();
    });

    it("should propagate errors from the database", async () => {
      // Arrange
      const userId = testUserData.id;
      const dbError = new Error("Database connection error");
      mockDb.query.mockRejectedValueOnce(dbError);

      // Act & Assert
      await expect(userRepo.findById(userId)).rejects.toThrow(dbError);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE id = \$1/),
        [userId]
      );
    });
  });

  describe("findByEmail", () => {
    it("should return a user when found by email", async () => {
      // Arrange
      const email = testUserData.email;
      const mockRows = [testUserData];
      mockDb.query.mockResolvedValueOnce([mockRows, []]);

      // Act
      const result = await userRepo.findByEmail(email);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE email = \$1/),
        [email]
      );
      expect(User.fromData).toHaveBeenCalledWith(testUserData);
    });

    it("should return null when user not found by email", async () => {
      // Arrange
      const email = "nonexistent@example.com";
      mockDb.query.mockResolvedValueOnce([[], []]); // Empty result

      // Act
      const result = await userRepo.findByEmail(email);

      // Assert
      expect(result).toBeNull();
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE email = \$1/),
        [email]
      );
      expect(User.fromData).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should insert a new user into the database", async () => {
      // Arrange
      const mockResult = [testUserData];
      mockDb.query.mockResolvedValueOnce([mockResult, []]);

      // Act
      const result = await userRepo.create(mockUser);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/INSERT INTO users/),
        expect.arrayContaining([
          mockUser.id,
          mockUser.email.toString(),
          mockUser.password.value,
          mockUser.firstName,
          mockUser.lastName,
          mockUser.role,
          mockUser.jobTitle,
          mockUser.approvalStatus,
        ])
      );
      expect(User.fromData).toHaveBeenCalledWith(testUserData);
    });

    it("should return the user as is when no rows are returned", async () => {
      // Arrange
      mockDb.query.mockResolvedValueOnce([[], []]);

      // Act
      const result = await userRepo.create(mockUser);

      // Assert
      expect(result).toEqual(mockUser);
      expect(User.fromData).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update an existing user in the database", async () => {
      // Arrange
      const mockResult = [testUserData];
      mockDb.query.mockResolvedValueOnce([mockResult, []]);

      // Act
      const result = await userRepo.update(mockUser);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE users SET/),
        expect.arrayContaining([
          mockUser.email.toString(),
          mockUser.password.value,
          mockUser.firstName,
          mockUser.lastName,
          mockUser.role,
          mockUser.jobTitle,
          mockUser.approvalStatus,
          mockUser.updatedAt,
          mockUser.id,
        ])
      );
      expect(User.fromData).toHaveBeenCalledWith(testUserData);
    });

    it("should return the user as is when no rows are returned", async () => {
      // Arrange
      mockDb.query.mockResolvedValueOnce([[], []]);

      // Act
      const result = await userRepo.update(mockUser);

      // Assert
      expect(result).toEqual(mockUser);
      expect(User.fromData).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete a user from the database", async () => {
      // Arrange
      const userId = testUserData.id;
      mockDb.query.mockResolvedValueOnce([[{ id: userId }], []]);

      // Act
      const result = await userRepo.delete(userId);

      // Assert
      expect(result).toBe(true);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/DELETE FROM users WHERE id = \$1/),
        [userId]
      );
    });

    it("should return false when user not found for deletion", async () => {
      // Arrange
      const userId = "non-existent-id";
      mockDb.query.mockResolvedValueOnce([[], []]);

      // Act
      const result = await userRepo.delete(userId);

      // Assert
      expect(result).toBe(false);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/DELETE FROM users WHERE id = \$1/),
        [userId]
      );
    });
  });
});
