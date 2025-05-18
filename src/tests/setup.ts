/**
 * Jest setup file that runs before all tests
 */

// Mock environment variables
process.env.JWT_SECRET = "test_secret_key";
process.env.JWT_EXPIRES_IN = "1h";
process.env.NODE_ENV = "test";

// Set a fixed random seed for reproducible tests
jest.spyOn(global.Math, "random").mockReturnValue(0.123456789);

// Set a fixed date for any new Date() calls
const fixedDate = new Date("2023-01-01T12:00:00.000Z");
jest
  .spyOn(global, "Date")
  .mockImplementation(() => fixedDate as unknown as Date);

// Mock crypto for randomUUID - ensure it's available globally
global.crypto = {
  ...global.crypto,
  randomUUID: jest.fn().mockReturnValue("123e4567-e89b-12d3-a456-426614174000"),
} as any;

// Legacy crypto mock for older code that might use require('crypto')
jest.mock("crypto", () => ({
  ...jest.requireActual("crypto"),
  randomUUID: jest.fn().mockReturnValue("123e4567-e89b-12d3-a456-426614174000"),
}));

// Set timeout for tests
jest.setTimeout(30000);

// Global teardown after all tests
afterAll(async () => {
  // Any cleanup code needed after tests complete
  jest.restoreAllMocks();
});
