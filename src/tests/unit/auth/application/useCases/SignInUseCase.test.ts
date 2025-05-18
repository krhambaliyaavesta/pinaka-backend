import { SignInUseCase } from "../../../../../modules/auth/application/useCases/signIn/SignInUseCase";
import { SignInRequestDto } from "../../../../../modules/auth/application/useCases/signIn/SignInRequestDto";
import { User } from "../../../../../modules/auth/domain/entities/User";
import { UserRepo } from "../../../../../modules/auth/domain/repositories/UserRepo";
import { Email } from "../../../../../modules/auth/domain/valueObjects/Email";
import { Password } from "../../../../../modules/auth/domain/valueObjects/Password";
import { InvalidCredentialsError } from "../../../../../modules/auth/domain/exceptions/AuthExceptions";
import jwt from "jsonwebtoken";
import { config } from "../../../../../config";
import {
  testUserData,
  signInRequestDto,
} from "../../../../fixtures/auth.fixtures";

// Mocks
jest.mock("jsonwebtoken");
jest.mock("../../../../../config", () => ({
  config: {
    jwt: {
      secret: "test_secret",
      expiresIn: "1d",
    },
  },
}));

describe("SignInUseCase", () => {
  let mockUserRepo: jest.Mocked<UserRepo>;
  let signInUseCase: SignInUseCase;
  let mockUser: User;

  beforeEach(() => {
    // Create mock user
    mockUser = {
      id: testUserData.id,
      email: {
        toString: () => testUserData.email,
      } as Email,
      password: {
        compare: jest.fn().mockResolvedValue(true),
      } as unknown as Password,
      firstName: testUserData.first_name,
      lastName: testUserData.last_name,
      role: testUserData.role,
      jobTitle: testUserData.job_title,
      approvalStatus: testUserData.approval_status,
      fullName: `${testUserData.first_name} ${testUserData.last_name}`,
      createdAt: testUserData.created_at,
      updatedAt: testUserData.updated_at,
      verifyPassword: jest.fn().mockResolvedValue(true),
      toJSON: jest.fn().mockReturnValue({
        id: testUserData.id,
        email: testUserData.email,
        firstName: testUserData.first_name,
        lastName: testUserData.last_name,
        role: testUserData.role,
        jobTitle: testUserData.job_title,
      }),
    } as unknown as User;

    // Create mock repository
    mockUserRepo = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Mock jwt.sign
    (jwt.sign as jest.Mock).mockReturnValue("mock_token");

    // Create the use case with mocked dependencies
    signInUseCase = new SignInUseCase(mockUserRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully sign in a user with valid credentials", async () => {
    // Arrange
    const dto: SignInRequestDto = signInRequestDto;

    // Act
    const result = await signInUseCase.execute(dto);

    // Assert
    expect(result).toBeDefined();
    expect(result.token).toBe("mock_token");
    expect(result.user).toBeDefined();
    expect(result.user.id).toBe(mockUser.id);
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockUser.verifyPassword).toHaveBeenCalledWith(dto.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: mockUser.id,
        email: mockUser.email.toString(),
        role: mockUser.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  });

  it("should throw InvalidCredentialsError when user not found", async () => {
    // Arrange
    mockUserRepo.findByEmail.mockResolvedValueOnce(null);
    const dto: SignInRequestDto = signInRequestDto;

    // Act & Assert
    await expect(signInUseCase.execute(dto)).rejects.toThrow(
      InvalidCredentialsError
    );
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(dto.email);
  });

  it("should throw InvalidCredentialsError when password is incorrect", async () => {
    // Arrange
    mockUser.verifyPassword = jest.fn().mockResolvedValueOnce(false);
    const dto: SignInRequestDto = signInRequestDto;

    // Act & Assert
    await expect(signInUseCase.execute(dto)).rejects.toThrow(
      InvalidCredentialsError
    );
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockUser.verifyPassword).toHaveBeenCalledWith(dto.password);
  });
});
