import { KudosCardController } from "../../../../../modules/kudosCards/presentation/controllers/KudosCardController";
import { KudosCardUseCaseFactory } from "../../../../../modules/kudosCards/application/useCases/kudosCard/KudosCardUseCaseFactory";
import { RequestWithUser } from "../../../../../shared/types/express";
import {
  KudosCardNotFoundError,
  TeamNotFoundError,
  CategoryNotFoundError,
  KudosCardValidationError,
  InsufficientPermissionsError,
  UnauthorizedKudosCardAccessError,
} from "../../../../../modules/kudosCards/domain/exceptions/KudosCardExceptions";
import {
  createKudosCardDto,
  validKudosCardProps,
  updateKudosCardDto,
} from "../../../../fixtures/kudosCards.fixtures";
import { AppError } from "../../../../../shared/errors/AppError";

describe("KudosCardController", () => {
  // Mocks
  const mockRequest = {} as RequestWithUser;
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;
  const mockNext = jest.fn();

  // Mock use cases
  const mockCreateKudosCardUseCase = {
    execute: jest.fn(),
  };
  const mockGetKudosCardByIdUseCase = {
    execute: jest.fn(),
  };
  const mockGetKudosCardsUseCase = {
    execute: jest.fn(),
  };
  const mockUpdateKudosCardUseCase = {
    execute: jest.fn(),
  };
  const mockDeleteKudosCardUseCase = {
    execute: jest.fn(),
  };

  // Mock the KudosCardUseCaseFactory
  jest.mock(
    "../../../../modules/kudosCards/application/useCases/kudosCard/KudosCardUseCaseFactory",
    () => ({
      KudosCardUseCaseFactory: {
        createCreateKudosCardUseCase: jest
          .fn()
          .mockReturnValue(mockCreateKudosCardUseCase),
        createGetKudosCardByIdUseCase: jest
          .fn()
          .mockReturnValue(mockGetKudosCardByIdUseCase),
        createGetKudosCardsUseCase: jest
          .fn()
          .mockReturnValue(mockGetKudosCardsUseCase),
        createUpdateKudosCardUseCase: jest
          .fn()
          .mockReturnValue(mockUpdateKudosCardUseCase),
        createDeleteKudosCardUseCase: jest
          .fn()
          .mockReturnValue(mockDeleteKudosCardUseCase),
      },
    })
  );

  // Controller instance
  let kudosCardController: KudosCardController;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create a fresh instance for each test
    kudosCardController = new KudosCardController();

    // Set up request object
    mockRequest.user = {
      userId: "123e4567-e89b-12d3-a456-426614174000",
      email: "admin@example.com",
      role: 1,
    };
    mockRequest.params = { id: validKudosCardProps.id };
    mockRequest.body = createKudosCardDto;
    mockRequest.query = {};
  });

  describe("createKudosCard", () => {
    it("should return 201 with kudos card data on successful creation", async () => {
      // Arrange
      const mockKudosCardDto = {
        id: validKudosCardProps.id,
        recipientName: createKudosCardDto.recipientName,
        teamId: createKudosCardDto.teamId,
        teamName: "Engineering",
        categoryId: createKudosCardDto.categoryId,
        categoryName: "Teamwork",
        message: createKudosCardDto.message,
        createdBy: mockRequest.user!.userId,
        creatorName: "Admin User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockCreateKudosCardUseCase.execute.mockResolvedValue(mockKudosCardDto);

      // Act
      await kudosCardController.createKudosCard(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockCreateKudosCardUseCase.execute).toHaveBeenCalledWith(
        createKudosCardDto,
        mockRequest.user!.userId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockKudosCardDto,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with 401 AppError when user is not authenticated", async () => {
      // Arrange
      mockRequest.user = undefined;

      // Act
      await kudosCardController.createKudosCard(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: expect.stringContaining("must be logged in"),
        })
      );
      expect(mockCreateKudosCardUseCase.execute).not.toHaveBeenCalled();
    });

    it("should call next with 404 AppError when TeamNotFoundError occurs", async () => {
      // Arrange
      const error = new TeamNotFoundError(createKudosCardDto.teamId);
      mockCreateKudosCardUseCase.execute.mockRejectedValue(error);

      // Act
      await kudosCardController.createKudosCard(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: error.message,
        })
      );
    });

    it("should call next with 404 AppError when CategoryNotFoundError occurs", async () => {
      // Arrange
      const error = new CategoryNotFoundError(createKudosCardDto.categoryId);
      mockCreateKudosCardUseCase.execute.mockRejectedValue(error);

      // Act
      await kudosCardController.createKudosCard(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: error.message,
        })
      );
    });

    it("should call next with 403 AppError when InsufficientPermissionsError occurs", async () => {
      // Arrange
      const error = new InsufficientPermissionsError("Admin or Lead");
      mockCreateKudosCardUseCase.execute.mockRejectedValue(error);

      // Act
      await kudosCardController.createKudosCard(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          message: error.message,
        })
      );
    });

    it("should call next with 400 AppError when KudosCardValidationError occurs", async () => {
      // Arrange
      const error = new KudosCardValidationError("Invalid data");
      mockCreateKudosCardUseCase.execute.mockRejectedValue(error);

      // Act
      await kudosCardController.createKudosCard(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: error.message,
        })
      );
    });
  });

  describe("getKudosCardById", () => {
    it("should return 200 with kudos card data when found", async () => {
      // Arrange
      const mockKudosCardDto = {
        id: validKudosCardProps.id,
        recipientName: validKudosCardProps.recipientName,
        teamId: validKudosCardProps.teamId,
        teamName: "Engineering",
        categoryId: validKudosCardProps.categoryId,
        categoryName: "Teamwork",
        message: validKudosCardProps.message,
        createdBy: validKudosCardProps.createdBy,
        creatorName: "Admin User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockGetKudosCardByIdUseCase.execute.mockResolvedValue(mockKudosCardDto);

      // Act
      await kudosCardController.getKudosCardById(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockGetKudosCardByIdUseCase.execute).toHaveBeenCalledWith(
        validKudosCardProps.id
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockKudosCardDto,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with 404 AppError when KudosCardNotFoundError occurs", async () => {
      // Arrange
      const error = new KudosCardNotFoundError(validKudosCardProps.id!);
      mockGetKudosCardByIdUseCase.execute.mockRejectedValue(error);

      // Act
      await kudosCardController.getKudosCardById(
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: error.message,
        })
      );
    });
  });

  // Additional tests for the other controller methods could be added here
  // updateKudosCard, deleteKudosCard, getKudosCards, etc.
});
