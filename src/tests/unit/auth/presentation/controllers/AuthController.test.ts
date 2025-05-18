import { AuthController } from "../../../../../modules/auth/presentation/controllers/AuthController";
import { Request, Response, NextFunction } from "express";
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../../../../modules/auth/domain/exceptions/AuthExceptions";
import {
  signInRequestDto,
  signUpRequestDto,
  mockJwtPayload,
} from "../../../../fixtures/auth.fixtures";

// Mock factories and usecases
jest.mock(
  "../../../../../modules/auth/application/useCases/signUp/SignUpFactory",
  () => ({
    SignUpFactory: {
      create: jest.fn().mockReturnValue({
        execute: jest.fn(),
      }),
    },
  })
);

jest.mock(
  "../../../../../modules/auth/application/useCases/signIn/SignInFactory",
  () => ({
    SignInFactory: {
      create: jest.fn().mockReturnValue({
        execute: jest.fn(),
      }),
    },
  })
);

jest.mock(
  "../../../../modules/auth/application/useCases/getUserInfo/GetUserInfoFactory",
  () => ({
    GetUserInfoFactory: {
      create: jest.fn().mockReturnValue({
        execute: jest.fn(),
      }),
    },
  })
);

jest.mock(
  "../../../../modules/auth/application/useCases/logout/LogoutFactory",
  () => ({
    LogoutFactory: {
      create: jest.fn().mockReturnValue({
        execute: jest.fn(),
      }),
    },
  })
);

jest.mock("../../../../shared/factories/AuthModuleFactory", () => ({
  AuthModuleFactory: {
    getUserRepo: jest.fn(),
  },
}));

// Mock the AppError class
jest.mock("../../../../shared/errors/AppError", () => {
  return {
    AppError: jest.fn().mockImplementation((message, statusCode) => ({
      message,
      statusCode,
    })),
  };
});

describe("AuthController", () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Initialize controller
    authController = new AuthController();

    // Setup mock request/response/next
    mockRequest = {
      body: {},
      user: undefined,
      headers: {
        authorization: undefined,
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp method", () => {
    it("should return 201 status with user data on successful signup", async () => {
      // Arrange
      const mockSuccessResult = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "newuser@example.com",
        firstName: "New",
        lastName: "User",
      };

      mockRequest.body = signUpRequestDto;

      // Setup mock usecase to return success result
      const mockSignUpFactory = require("../../../../modules/auth/application/useCases/signUp/SignUpFactory");
      mockSignUpFactory.SignUpFactory.create().execute.mockResolvedValueOnce(
        mockSuccessResult
      );

      // Act
      await authController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockSuccessResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with 409 AppError when EmailAlreadyExistsError occurs", async () => {
      // Arrange
      mockRequest.body = signUpRequestDto;

      // Setup mock usecase to throw error
      const mockSignUpFactory = require("../../../../modules/auth/application/useCases/signUp/SignUpFactory");
      const error = new EmailAlreadyExistsError(signUpRequestDto.email);
      mockSignUpFactory.SignUpFactory.create().execute.mockRejectedValueOnce(
        error
      );

      // Act
      await authController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: error.message,
          statusCode: 409,
        })
      );
    });
  });

  describe("signIn method", () => {
    it("should return 200 status with token and user data on successful signin", async () => {
      // Arrange
      const mockSuccessResult = {
        token: "mockJwtToken",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      };

      mockRequest.body = signInRequestDto;

      // Setup mock usecase to return success result
      const mockSignInFactory = require("../../../../modules/auth/application/useCases/signIn/SignInFactory");
      mockSignInFactory.SignInFactory.create().execute.mockResolvedValueOnce(
        mockSuccessResult
      );

      // Act
      await authController.signIn(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockSuccessResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with 401 AppError when InvalidCredentialsError occurs", async () => {
      // Arrange
      mockRequest.body = signInRequestDto;

      // Setup mock usecase to throw error
      const mockSignInFactory = require("../../../../modules/auth/application/useCases/signIn/SignInFactory");
      const error = new InvalidCredentialsError();
      mockSignInFactory.SignInFactory.create().execute.mockRejectedValueOnce(
        error
      );

      // Act
      await authController.signIn(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: error.message,
          statusCode: 401,
        })
      );
    });
  });

  describe("getUserInfo method", () => {
    it("should return 200 status with user data for authenticated user", async () => {
      // Arrange
      const mockSuccessResult = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
      };

      mockRequest.user = mockJwtPayload;

      // Setup mock usecase to return success result
      const mockGetUserInfoFactory = require("../../../../modules/auth/application/useCases/getUserInfo/GetUserInfoFactory");
      mockGetUserInfoFactory.GetUserInfoFactory.create().execute.mockResolvedValueOnce(
        mockSuccessResult
      );

      // Act
      await authController.getUserInfo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockSuccessResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with 401 AppError when user is not authenticated", async () => {
      // Arrange
      mockRequest.user = undefined; // No user in request

      // Act
      await authController.getUserInfo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Authentication required",
          statusCode: 401,
        })
      );
    });

    it("should call next with 404 AppError when UserNotFoundError occurs", async () => {
      // Arrange
      mockRequest.user = mockJwtPayload;

      // Setup mock usecase to throw error
      const mockGetUserInfoFactory = require("../../../../modules/auth/application/useCases/getUserInfo/GetUserInfoFactory");
      const error = new UserNotFoundError(mockJwtPayload.userId);
      mockGetUserInfoFactory.GetUserInfoFactory.create().execute.mockRejectedValueOnce(
        error
      );

      // Act
      await authController.getUserInfo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: error.message,
          statusCode: 404,
        })
      );
    });
  });

  describe("logout method", () => {
    it("should return 200 status on successful logout", async () => {
      // Arrange
      const mockSuccessResult = { success: true };

      mockRequest.user = mockJwtPayload;
      mockRequest.headers = {
        authorization: "Bearer mockJwtToken",
      };

      // Setup mock usecase to return success result
      const mockLogoutFactory = require("../../../../modules/auth/application/useCases/logout/LogoutFactory");
      mockLogoutFactory.LogoutFactory.create().execute.mockResolvedValueOnce(
        mockSuccessResult
      );

      // Act
      await authController.logout(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockSuccessResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with 401 AppError when user is not authenticated", async () => {
      // Arrange
      mockRequest.user = undefined; // No user in request

      // Act
      await authController.logout(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Authentication required",
          statusCode: 401,
        })
      );
    });

    it("should call next with 401 AppError when token is missing", async () => {
      // Arrange
      mockRequest.user = mockJwtPayload;
      mockRequest.headers = {}; // No authorization header

      // Act
      await authController.logout(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Authentication required",
          statusCode: 401,
        })
      );
    });
  });
});
