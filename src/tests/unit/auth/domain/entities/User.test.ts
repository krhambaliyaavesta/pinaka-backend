import {
  User,
  UserProps,
} from "../../../../../modules/auth/domain/entities/User";
import { Email } from "../../../../../modules/auth/domain/valueObjects/Email";
import { Password } from "../../../../../modules/auth/domain/valueObjects/Password";
import { ApprovalStatus } from "../../../../../modules/auth/domain/entities/UserTypes";
import {
  validUserProps,
  testUserData,
} from "../../../../fixtures/auth.fixtures";

// Mock crypto for randomUUID
global.crypto = {
  randomUUID: jest.fn().mockReturnValue("mocked-uuid"),
} as any;

// Mock dependencies
jest.mock("../../../../modules/auth/domain/valueObjects/Email");
jest.mock("../../../../modules/auth/domain/valueObjects/Password");

describe("User Entity", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Email class
    (Email.create as jest.Mock).mockImplementation((email) => ({
      toString: () => email,
      value: email,
    }));

    // Mock Password class
    (Password.create as jest.Mock).mockImplementation((password) => ({
      value: password,
      isHashed: false,
      hash: jest.fn().mockResolvedValue({
        value: "$2a$10$hashed_password",
        isHashed: true,
      }),
      compare: jest.fn().mockResolvedValue(true),
    }));

    (Password.fromHashed as jest.Mock).mockImplementation((hashedPassword) => ({
      value: hashedPassword,
      isHashed: true,
      compare: jest.fn().mockResolvedValue(true),
    }));
  });

  describe("create method", () => {
    it("should create a valid User entity with all required properties", async () => {
      // Arrange
      const props: UserProps = {
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        jobTitle: "Developer",
      };

      // Act
      const user = await User.create(props);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.password).toBeDefined();
      expect(user.firstName).toBe(props.firstName);
      expect(user.lastName).toBe(props.lastName);
      expect(user.jobTitle).toBe(props.jobTitle);
      expect(user.role).toBe(3); // Default role
      expect(user.approvalStatus).toBe(ApprovalStatus.PENDING); // Default status
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(Email.create).toHaveBeenCalledWith(props.email);
    });

    it("should use provided id, role, and timestamps if specified", async () => {
      // Arrange
      const customCreatedAt = new Date("2022-01-01");
      const customUpdatedAt = new Date("2022-01-02");

      const props: UserProps = {
        ...validUserProps,
        createdAt: customCreatedAt,
        updatedAt: customUpdatedAt,
      };

      // Act
      const user = await User.create(props);

      // Assert
      expect(user.id).toBe(props.id);
      expect(user.role).toBe(props.role);
      expect(user.createdAt).toBe(customCreatedAt);
      expect(user.updatedAt).toBe(customUpdatedAt);
    });

    it("should throw error when email is missing", async () => {
      // Arrange
      const props: UserProps = {
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        jobTitle: "Developer",
      } as UserProps;

      // Act & Assert
      await expect(User.create(props)).rejects.toThrow("Email is required");
    });

    it("should throw error when password is missing", async () => {
      // Arrange
      const props: UserProps = {
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        jobTitle: "Developer",
      } as UserProps;

      // Act & Assert
      await expect(User.create(props)).rejects.toThrow("Password is required");
    });

    it("should throw error when firstName is missing", async () => {
      // Arrange
      const props: UserProps = {
        email: "test@example.com",
        password: "password123",
        lastName: "Doe",
        jobTitle: "Developer",
      } as UserProps;

      // Act & Assert
      await expect(User.create(props)).rejects.toThrow(
        "First name is required"
      );
    });

    it("should throw error when lastName is missing", async () => {
      // Arrange
      const props: UserProps = {
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        jobTitle: "Developer",
      } as UserProps;

      // Act & Assert
      await expect(User.create(props)).rejects.toThrow("Last name is required");
    });

    it("should throw error when jobTitle is missing", async () => {
      // Arrange
      const props: UserProps = {
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      } as UserProps;

      // Act & Assert
      await expect(User.create(props)).rejects.toThrow("Job title is required");
    });
  });

  describe("fromData method", () => {
    it("should create a User entity from database data", () => {
      // Act
      const user = User.fromData(testUserData);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(testUserData.id);
      expect(Email.create).toHaveBeenCalledWith(testUserData.email);
      expect(Password.fromHashed).toHaveBeenCalledWith(testUserData.password);
      expect(user.firstName).toBe(testUserData.first_name);
      expect(user.lastName).toBe(testUserData.last_name);
      expect(user.role).toBe(testUserData.role);
      expect(user.jobTitle).toBe(testUserData.job_title);
      expect(user.approvalStatus).toBe(testUserData.approval_status);
    });
  });

  describe("verifyPassword method", () => {
    it("should call password.compare with the provided plain password", async () => {
      // Arrange
      const user = User.fromData(testUserData);
      const plainPassword = "password123";

      // Act
      const result = await user.verifyPassword(plainPassword);

      // Assert
      expect(result).toBe(true);
      expect(user.password.compare).toHaveBeenCalledWith(plainPassword);
    });
  });

  describe("fullName getter", () => {
    it("should return the concatenated first and last name", () => {
      // Arrange
      const user = User.fromData(testUserData);

      // Act & Assert
      expect(user.fullName).toBe(
        `${testUserData.first_name} ${testUserData.last_name}`
      );
    });
  });

  describe("toJSON method", () => {
    it("should return a JSON representation without the password", () => {
      // Arrange
      const user = User.fromData(testUserData);

      // Act
      const json = user.toJSON();

      // Assert
      expect(json).toEqual({
        id: user.id,
        email: user.email.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        jobTitle: user.jobTitle,
        approvalStatus: user.approvalStatus,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });

      // Should not contain password
      expect(json).not.toHaveProperty("password");
    });
  });
});
