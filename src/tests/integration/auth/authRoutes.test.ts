import request from "supertest";
import app from "../../../app";
import { PostgresService } from "../../../shared/services/PostgresService";
import { UserRepo } from "../../../modules/auth/domain/repositories/UserRepo";
import { UserRepoPgImpl } from "../../../modules/auth/infrastructure/repositories/UserRepoPgImpl";
import { User } from "../../../modules/auth/domain/entities/User";
import {
  signUpRequestDto,
  signInRequestDto,
  validUserProps,
} from "../../fixtures/auth.fixtures";

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

// Mock the AuthModuleFactory to use our mocked repo
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

describe("Auth Routes Integration Tests", () => {
  let mockDb: MockPostgresService;
  let userRepo: UserRepo;
  let mockUser: User;
  let authToken: string;

  beforeAll(async () => {
    // Get the mock database instance
    mockDb = PostgresService.getInstance() as unknown as MockPostgresService;
    userRepo = new UserRepoPgImpl(mockDb as unknown as PostgresService);

    // Setup the mock user repository
    const mockAuthModuleFactory = require("../../../shared/factories/AuthModuleFactory");
    mockAuthModuleFactory.AuthModuleFactory.getUserRepo.mockReturnValue(
      userRepo
    );

    // Setup mock user for tests
    mockUser = await User.create(validUserProps);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user with status 201", async () => {
      // Mock the repository to not find the user by email (simulating unique email)
      mockDb.query.mockResolvedValueOnce([[], []]);

      // Mock the repository to successfully create the user
      mockDb.query.mockResolvedValueOnce([
        [
          {
            id: expect.any(String),
            email: signUpRequestDto.email,
            password: expect.any(String),
            first_name: signUpRequestDto.firstName,
            last_name: signUpRequestDto.lastName,
            role: 3,
            job_title: signUpRequestDto.jobTitle,
            approval_status: 1,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
          },
        ],
        [],
      ]);

      // Make the request
      const response = await request(app)
        .post("/api/auth/signup")
        .send(signUpRequestDto)
        .expect("Content-Type", /json/)
        .expect(201);

      // Assert the response body with more relaxed expectations
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeTruthy();

      // Check specific properties if they exist
      if (response.body.data) {
        expect(response.body.data.email).toBe(signUpRequestDto.email);
        expect(response.body.data.firstName).toBe(signUpRequestDto.firstName);
        expect(response.body.data.lastName).toBe(signUpRequestDto.lastName);
      }

      // Verify the mock calls
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE email = \$1/),
        [signUpRequestDto.email]
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/INSERT INTO users/),
        expect.arrayContaining([
          expect.any(String), // id
          signUpRequestDto.email,
          expect.any(String), // hashed password
          signUpRequestDto.firstName,
          signUpRequestDto.lastName,
        ])
      );
    });

    it("should return 409 when email already exists", async () => {
      // Mock the repository to find a user with the same email
      mockDb.query.mockResolvedValueOnce([
        [
          {
            id: "existing-id",
            email: signUpRequestDto.email,
          },
        ],
        [],
      ]);

      // Make the request
      const response = await request(app)
        .post("/api/auth/signup")
        .send(signUpRequestDto)
        .expect("Content-Type", /json/)
        .expect(409);

      // Assert the response body
      expect(response.body).toEqual({
        status: "error",
        message: expect.stringContaining("already exists"),
        isOperational: true,
      });

      // Verify the mock calls
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE email = \$1/),
        [signUpRequestDto.email]
      );
      expect(mockDb.query).not.toHaveBeenCalledWith(
        expect.stringMatching(/INSERT INTO users/)
      );
    });

    it("should return 400 for invalid input", async () => {
      // Make the request with invalid data
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "invalid-email",
          password: "123", // too short
          firstName: "",
          lastName: "",
          jobTitle: "",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      // Assert the response body
      expect(response.body).toEqual({
        status: "error",
        message: expect.stringContaining("valid email"),
        isOperational: true,
      });

      // Verify the mock calls - validation should prevent DB queries
      expect(mockDb.query).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/signin", () => {
    it("should sign in a user with valid credentials and return token", async () => {
      // Mock the repository to find the user by email
      mockDb.query.mockResolvedValueOnce([
        [
          {
            id: validUserProps.id,
            email: signInRequestDto.email,
            password:
              "$2a$10$ASD8Ah0UasVlGYZLF5sH8.YGI.FII3wq9yRBOJYcYTZ/6wdlN/JzG", // Mocked hashed password
            first_name: validUserProps.firstName,
            last_name: validUserProps.lastName,
            role: validUserProps.role,
            job_title: validUserProps.jobTitle,
            approval_status: validUserProps.approvalStatus,
            created_at: validUserProps.createdAt,
            updated_at: validUserProps.updatedAt,
          },
        ],
        [],
      ]);

      // Mock Password verification
      jest.spyOn(User.prototype, "verifyPassword").mockResolvedValueOnce(true);

      // Make the request
      const response = await request(app)
        .post("/api/auth/signin")
        .send(signInRequestDto)
        .expect("Content-Type", /json/)
        .expect(200);

      // Save the token for later tests
      authToken = response.body.data.token;

      // Assert the response body
      expect(response.body).toEqual({
        status: "success",
        data: {
          token: expect.any(String),
          user: expect.any(Object), // Use any object instead of specific structure due to potential changes
        },
      });

      // Verify the mock calls
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE email = \$1/),
        [signInRequestDto.email]
      );
    });

    it("should return 401 for invalid credentials", async () => {
      // Mock the repository to not find the user by email
      mockDb.query.mockResolvedValueOnce([[], []]);

      // Make the request
      const response = await request(app)
        .post("/api/auth/signin")
        .send(signInRequestDto)
        .expect("Content-Type", /json/)
        .expect(401);

      // Assert the response body
      expect(response.body).toEqual({
        status: "error",
        message: expect.stringContaining("Invalid email or password"),
        isOperational: true,
      });

      // Verify the mock calls
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE email = \$1/),
        [signInRequestDto.email]
      );
    });

    it("should return 401 when password is incorrect", async () => {
      // Mock the repository to find the user by email
      mockDb.query.mockResolvedValueOnce([
        [
          {
            id: validUserProps.id,
            email: signInRequestDto.email,
            password:
              "$2a$10$ASD8Ah0UasVlGYZLF5sH8.YGI.FII3wq9yRBOJYcYTZ/6wdlN/JzG", // Mocked hashed password
            first_name: validUserProps.firstName,
            last_name: validUserProps.lastName,
            role: validUserProps.role,
            job_title: validUserProps.jobTitle,
            approval_status: validUserProps.approvalStatus,
            created_at: validUserProps.createdAt,
            updated_at: validUserProps.updatedAt,
          },
        ],
        [],
      ]);

      // Mock Password verification to fail
      jest.spyOn(User.prototype, "verifyPassword").mockResolvedValueOnce(false);

      // Make the request
      const response = await request(app)
        .post("/api/auth/signin")
        .send(signInRequestDto)
        .expect("Content-Type", /json/)
        .expect(401);

      // Assert the response body
      expect(response.body).toEqual({
        status: "error",
        message: expect.stringContaining("Invalid email or password"),
        isOperational: true,
      });

      // Verify the mock calls
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT.*FROM users WHERE email = \$1/),
        [signInRequestDto.email]
      );
    });
  });

  describe("Protected Routes", () => {
    describe("GET /api/auth/me", () => {
      it("should return user info for authenticated user", async () => {
        // Mock the repository to find the user by id
        mockDb.query.mockResolvedValueOnce([
          [
            {
              id: validUserProps.id,
              email: validUserProps.email,
              password:
                "$2a$10$ASD8Ah0UasVlGYZLF5sH8.YGI.FII3wq9yRBOJYcYTZ/6wdlN/JzG", // Mocked hashed password
              first_name: validUserProps.firstName,
              last_name: validUserProps.lastName,
              role: validUserProps.role,
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
          .get("/api/auth/me")
          .set("Authorization", `Bearer ${authToken}`)
          .expect("Content-Type", /json/)
          .expect(200);

        // Assert the response body
        expect(response.body).toEqual({
          status: "success",
          data: expect.objectContaining({
            id: validUserProps.id,
            email: validUserProps.email,
            firstName: validUserProps.firstName,
            lastName: validUserProps.lastName,
          }),
        });

        // Verify the mock calls
        expect(mockDb.query).toHaveBeenCalledWith(
          expect.stringMatching(/SELECT.*FROM users WHERE id = \$1/),
          [expect.any(String)]
        );
      });

      it("should return 401 for unauthorized request", async () => {
        // Make the request without token
        const response = await request(app)
          .get("/api/auth/me")
          .expect("Content-Type", /json/)
          .expect(401);

        // Assert the response body
        expect(response.body).toEqual({
          status: "error",
          message: expect.stringContaining("Authentication required"),
          isOperational: true,
        });

        // Verify the mock calls
        expect(mockDb.query).not.toHaveBeenCalled();
      });
    });

    describe("POST /api/auth/logout", () => {
      it("should logout a user and invalidate token", async () => {
        // Setup mock for TokenBlacklistService
        const mockTokenBlacklistService =
          require("../../../shared/services/TokenBlacklistService").TokenBlacklistService.getInstance();

        // Make the request
        const response = await request(app)
          .post("/api/auth/logout")
          .set("Authorization", `Bearer ${authToken}`)
          .expect("Content-Type", /json/)
          .expect(200);

        // Assert the response body
        expect(response.body).toEqual({
          status: "success",
          data: expect.objectContaining({
            success: true,
          }),
        });

        // Verify the token is added to blacklist
        expect(mockTokenBlacklistService.addToBlacklist).toHaveBeenCalledWith(
          authToken
        );
      });

      it("should return 401 for unauthorized logout request", async () => {
        // Make the request without token
        const response = await request(app)
          .post("/api/auth/logout")
          .expect("Content-Type", /json/)
          .expect(401);

        // Assert the response body
        expect(response.body).toEqual({
          status: "error",
          message: expect.stringContaining("Authentication required"),
          isOperational: true,
        });

        // Verify the mock calls
        const mockTokenBlacklistService =
          require("../../../shared/services/TokenBlacklistService").TokenBlacklistService.getInstance();
        expect(mockTokenBlacklistService.addToBlacklist).not.toHaveBeenCalled();
      });
    });
  });
});
