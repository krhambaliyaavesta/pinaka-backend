import request from "supertest";
import app from "../../../app";
import { PostgresService } from "../../../shared/services/PostgresService";
import { UserRepo } from "../../../modules/auth/domain/repositories/UserRepo";
import { UserRepoPgImpl } from "../../../modules/auth/infrastructure/repositories/UserRepoPgImpl";

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

describe("Admin Routes", () => {
  let mockDb: MockPostgresService;
  let userRepo: UserRepo;
  let adminToken: string;
  let leadToken: string;
  let regularToken: string;
  let adminUserId: string;
  let leadUserId: string;
  let regularUserId: string;
  let testUserId: string;

  beforeAll(async () => {
    // Get the mock database instance
    mockDb = PostgresService.getInstance() as unknown as MockPostgresService;
    userRepo = new UserRepoPgImpl(mockDb as unknown as PostgresService);

    // Setup the mock user repository
    const mockAuthModuleFactory = require("../../../shared/factories/AuthModuleFactory");
    mockAuthModuleFactory.AuthModuleFactory.getUserRepo.mockReturnValue(
      userRepo
    );

    // Setup user IDs
    adminUserId = "admin-user-id";
    leadUserId = "lead-user-id";
    regularUserId = "regular-user-id";
    testUserId = "test-user-id";

    // Use hardcoded tokens for testing
    adminToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLWlkIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOjEsImlhdCI6MTYxMTY4MjcwMCwiZXhwIjoxNjExNjg2MzAwfQ.6RcS6ZNON7JKcCtNs0b_x5ciZjhTc5H0JR8z1xrYFhU";
    leadToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJsZWFkLXVzZXItaWQiLCJlbWFpbCI6ImxlYWRAdGVzdC5jb20iLCJyb2xlIjoyLCJpYXQiOjE2MTE2ODI3MDAsImV4cCI6MTYxMTY4NjMwMH0.ULtS5kN5YPMc0zTQ0P8PZTzWQbqGwXQiBJf_J-28_Jc";
    regularToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyZWd1bGFyLXVzZXItaWQiLCJlbWFpbCI6InJlZ3VsYXJAdGVzdC5jb20iLCJyb2xlIjozLCJpYXQiOjE2MTE2ODI3MDAsImV4cCI6MTYxMTY4NjMwMH0.IKPuG_LIo3e7OifRXnRU8WQSbA9Z_LyLkJHDAfpXwOE";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/admin/users", () => {
    it("should allow admin to get all users", async () => {
      // Mock user lookup for authentication
      mockDb.query.mockResolvedValueOnce([
        [
          {
            id: adminUserId,
            email: "admin@test.com",
            role: 1,
            first_name: "Admin",
            last_name: "User",
          },
        ],
        [],
      ]);

      // Mock getAllUsers query response
      mockDb.query.mockResolvedValueOnce([
        [
          {
            id: adminUserId,
            email: "admin@test.com",
            role: 1,
            first_name: "Admin",
            last_name: "User",
          },
          {
            id: leadUserId,
            email: "lead@test.com",
            role: 2,
            first_name: "Lead",
            last_name: "User",
          },
          {
            id: regularUserId,
            email: "regular@test.com",
            role: 3,
            first_name: "Regular",
            last_name: "User",
          },
          {
            id: testUserId,
            email: "test@test.com",
            role: 3,
            first_name: "Test",
            last_name: "User",
          },
        ],
        [],
      ]);

      const response = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(4);
    });

    it("should allow lead to get all users", async () => {
      const response = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${leadToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(4);
    });

    it("should not allow regular user to get all users", async () => {
      const response = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${regularToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/admin/users/:id", () => {
    it("should allow admin to get user by ID", async () => {
      const response = await request(app)
        .get(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe("test@test.com");
    });

    it("should allow lead to get user by ID", async () => {
      const response = await request(app)
        .get(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${leadToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe("test@test.com");
    });

    it("should not allow regular user to get user by ID", async () => {
      const response = await request(app)
        .get(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${regularToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe("PUT /api/admin/users/:id", () => {
    it("should allow admin to update a user's profile", async () => {
      const updateData = {
        firstName: "Updated",
        lastName: "TestUser",
        jobTitle: "Senior Tester",
      };

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
      expect(response.body.data.jobTitle).toBe(updateData.jobTitle);
    });

    it("should allow lead to update a user's profile", async () => {
      const updateData = {
        firstName: "Lead",
        lastName: "Updated",
        jobTitle: "Lead Updated Position",
      };

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${leadToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
      expect(response.body.data.jobTitle).toBe(updateData.jobTitle);
    });

    it("should allow admin to update a user's role", async () => {
      const updateData = {
        role: 2, // Update to Lead
      };

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.role).toBe(updateData.role);
    });

    it("should allow lead to update a user's role", async () => {
      const updateData = {
        role: 3, // Reset to regular user
      };

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${leadToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.role).toBe(updateData.role);
    });

    it("should not allow regular user to update other users", async () => {
      const updateData = {
        firstName: "Unauthorized",
        lastName: "Update",
      };

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${regularToken}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });

    it("should allow users to update their own profiles", async () => {
      const updateData = {
        firstName: "Self",
        lastName: "Updated",
      };

      const response = await request(app)
        .put(`/api/admin/users/${regularUserId}`)
        .set("Authorization", `Bearer ${regularToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
    });

    it("should not allow regular users to update their own role", async () => {
      const updateData = {
        role: 1, // Try to promote to admin
      };

      const response = await request(app)
        .put(`/api/admin/users/${regularUserId}`)
        .set("Authorization", `Bearer ${regularToken}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });
});
