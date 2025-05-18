import request from "supertest";
import app from "../../../app";
import { PostgresService } from "../../../shared/services/PostgresService";
import { KudosCardRepo } from "../../../modules/kudosCards/domain/repositories/KudosCardRepo";
import { KudosCardRepoPgImpl } from "../../../modules/kudosCards/infrastructure/repositories/KudosCardRepoPgImpl";
import { TeamRepo } from "../../../modules/teams/domain/repositories/TeamRepo";
import { TeamRepoPgImpl } from "../../../modules/teams/infrastructure/repositories/TeamRepoPgImpl";
import { CategoryRepo } from "../../../modules/categories/domain/repositories/CategoryRepo";
import { CategoryRepoPgImpl } from "../../../modules/categories/infrastructure/repositories/CategoryRepoPgImpl";
import { UserRepo } from "../../../modules/auth/domain/repositories/UserRepo";
import { UserRepoPgImpl } from "../../../modules/auth/infrastructure/repositories/UserRepoPgImpl";
import {
  createKudosCardDto,
  validKudosCardProps,
  validTeamProps,
  validCategoryProps,
  kudosCardDbResponse,
  teamDbResponse,
  categoryDbResponse,
} from "../../fixtures/kudosCards.fixtures";
import { validUserProps } from "../../fixtures/auth.fixtures";

// Define a mock PostgresService type
interface MockPostgresService {
  query: jest.Mock;
}

// Mock the database service
jest.mock("../../../shared/services/PostgresService", () => {
  // Create a mock instance
  const mockInstance = {
    query: jest.fn(),
  };

  // Return the class with static getInstance method
  return {
    PostgresService: {
      getInstance: jest.fn().mockReturnValue(mockInstance),
    },
  };
});

// Mock the factories to use our mocked repos
jest.mock("../../../shared/factories/KudosCardsModuleFactory", () => ({
  KudosCardsModuleFactory: {
    getKudosCardRepo: jest.fn(),
    getTeamRepo: jest.fn(),
    getCategoryRepo: jest.fn(),
  },
}));

jest.mock("../../../shared/factories/AuthModuleFactory", () => ({
  AuthModuleFactory: {
    getUserRepo: jest.fn(),
  },
}));

// Mock the token blacklist service
jest.mock("../../../shared/services/TokenBlacklistService", () => {
  return {
    TokenBlacklistService: {
      getInstance: jest.fn().mockReturnValue({
        addToBlacklist: jest.fn(),
        isBlacklisted: jest.fn().mockReturnValue(false),
      }),
    },
  };
});

describe("KudosCard Routes Integration Tests", () => {
  let mockDb: MockPostgresService;
  let kudosCardRepo: KudosCardRepo;
  let teamRepo: TeamRepo;
  let categoryRepo: CategoryRepo;
  let userRepo: UserRepo;
  let authToken: string;

  beforeAll(async () => {
    // Get the mock database instance
    mockDb = PostgresService.getInstance() as unknown as MockPostgresService;

    // Setup repositories with mock DB
    kudosCardRepo = new KudosCardRepoPgImpl(
      mockDb as unknown as PostgresService
    );
    teamRepo = new TeamRepoPgImpl(mockDb as unknown as PostgresService);
    categoryRepo = new CategoryRepoPgImpl(mockDb as unknown as PostgresService);
    userRepo = new UserRepoPgImpl(mockDb as unknown as PostgresService);

    // Setup the mock factories
    const mockKudosCardsModuleFactory = require("../../../shared/factories/KudosCardsModuleFactory");
    mockKudosCardsModuleFactory.KudosCardsModuleFactory.getKudosCardRepo.mockReturnValue(
      kudosCardRepo
    );
    mockKudosCardsModuleFactory.KudosCardsModuleFactory.getTeamRepo.mockReturnValue(
      teamRepo
    );
    mockKudosCardsModuleFactory.KudosCardsModuleFactory.getCategoryRepo.mockReturnValue(
      categoryRepo
    );

    const mockAuthModuleFactory = require("../../../shared/factories/AuthModuleFactory");
    mockAuthModuleFactory.AuthModuleFactory.getUserRepo.mockReturnValue(
      userRepo
    );

    // Generate a test token for authentication
    // This should match the format required by your auth middleware
    authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoxLCJpYXQiOjE2NzI1NzQ0MDAsImV4cCI6MTY3MjU3ODAwMH0.bCOUf2KJ1vsk9DyjBILNgrF_5_PpSaTou4N3u8zxeyc";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/kudos-cards", () => {
    it("should create a new kudos card with status 201", async () => {
      // Mock the user repository to find the admin user by id (for permission check)
      mockDb.query.mockResolvedValueOnce([
        [
          {
            id: validUserProps.id,
            email: validUserProps.email,
            password: "hashedpassword",
            first_name: validUserProps.firstName,
            last_name: validUserProps.lastName,
            role: 1, // Admin role
            job_title: validUserProps.jobTitle,
            approval_status: validUserProps.approvalStatus,
            created_at: validUserProps.createdAt,
            updated_at: validUserProps.updatedAt,
          },
        ],
        [],
      ]);

      // Mock the team repository to find the team
      mockDb.query.mockResolvedValueOnce([[teamDbResponse], []]);

      // Mock the category repository to find the category
      mockDb.query.mockResolvedValueOnce([[categoryDbResponse], []]);

      // Mock the repository to successfully create the kudos card
      mockDb.query.mockResolvedValueOnce([[kudosCardDbResponse], []]);

      // Make the request
      const response = await request(app)
        .post("/api/kudos-cards")
        .set("Authorization", `Bearer ${authToken}`)
        .send(createKudosCardDto)
        .expect("Content-Type", /json/)
        .expect(201);

      // Assert the response body
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.recipientName).toBe(
        createKudosCardDto.recipientName
      );
      expect(response.body.data.teamId).toBe(createKudosCardDto.teamId);
      expect(response.body.data.categoryId).toBe(createKudosCardDto.categoryId);
      expect(response.body.data.message).toBe(createKudosCardDto.message);

      // Verify the mock calls
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE id = \$1/),
        [expect.any(String)]
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM teams WHERE id = \$1/),
        [createKudosCardDto.teamId]
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM categories WHERE id = \$1/),
        [createKudosCardDto.categoryId]
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/INSERT INTO kudos_cards/),
        expect.arrayContaining([
          expect.any(String), // id
          createKudosCardDto.recipientName,
          createKudosCardDto.teamId,
          createKudosCardDto.categoryId,
          createKudosCardDto.message,
        ])
      );
    });

    it("should return 401 for unauthorized request", async () => {
      // Make the request without token
      const response = await request(app)
        .post("/api/kudos-cards")
        .send(createKudosCardDto)
        .expect("Content-Type", /json/)
        .expect(401);

      // Assert the response body
      expect(response.body).toEqual({
        status: "error",
        message: expect.stringContaining("Authentication required"),
        isOperational: true,
      });

      // Verify no repository calls were made
      expect(mockDb.query).not.toHaveBeenCalled();
    });

    it("should return 403 when user has insufficient permissions", async () => {
      // Mock the user repository to find a regular user (non-admin, non-lead)
      mockDb.query.mockResolvedValueOnce([
        [
          {
            id: validUserProps.id,
            email: validUserProps.email,
            password: "hashedpassword",
            first_name: validUserProps.firstName,
            last_name: validUserProps.lastName,
            role: 3, // Regular user
            job_title: validUserProps.jobTitle,
            approval_status: validUserProps.approvalStatus,
            created_at: validUserProps.createdAt,
            updated_at: validUserProps.updatedAt,
          },
        ],
        [],
      ]);

      // Make the request
      const response = await request(app)
        .post("/api/kudos-cards")
        .set("Authorization", `Bearer ${authToken}`)
        .send(createKudosCardDto)
        .expect("Content-Type", /json/)
        .expect(403);

      // Assert the response body
      expect(response.body).toEqual({
        status: "error",
        message: expect.stringContaining("permission"),
        isOperational: true,
      });

      // Verify only the user query was called
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE id = \$1/),
        [expect.any(String)]
      );
    });
  });

  describe("GET /api/kudos-cards/:id", () => {
    it("should return a kudos card by ID", async () => {
      // Mock the repository to find the kudos card
      mockDb.query.mockResolvedValueOnce([[kudosCardDbResponse], []]);

      // Mock team and category queries for enriching the response
      mockDb.query.mockResolvedValueOnce([[teamDbResponse], []]);

      mockDb.query.mockResolvedValueOnce([[categoryDbResponse], []]);

      // Mock creator user query
      mockDb.query.mockResolvedValueOnce([
        [
          {
            id: validUserProps.id,
            first_name: validUserProps.firstName,
            last_name: validUserProps.lastName,
          },
        ],
        [],
      ]);

      // Make the request
      const response = await request(app)
        .get(`/api/kudos-cards/${validKudosCardProps.id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      // Assert the response body
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.id).toBe(validKudosCardProps.id);
      expect(response.body.data.recipientName).toBe(
        validKudosCardProps.recipientName
      );
      expect(response.body.data.teamId).toBe(validKudosCardProps.teamId);
      expect(response.body.data.categoryId).toBe(
        validKudosCardProps.categoryId
      );

      // Verify the mock calls
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM kudos_cards WHERE id = \$1/),
        [validKudosCardProps.id]
      );
    });

    it("should return 404 when kudos card not found", async () => {
      // Mock the repository to not find the kudos card
      mockDb.query.mockResolvedValueOnce([[], []]);

      // Make the request
      const response = await request(app)
        .get("/api/kudos-cards/non-existent-id")
        .expect("Content-Type", /json/)
        .expect(404);

      // Assert the response body
      expect(response.body).toEqual({
        status: "error",
        message: expect.stringContaining("not found"),
        isOperational: true,
      });

      // Verify the mock calls
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM kudos_cards WHERE id = \$1/),
        ["non-existent-id"]
      );
    });
  });

  // More test cases for other routes (PUT, DELETE, etc.) would go here
});
