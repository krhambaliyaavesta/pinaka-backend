import { config } from "../config";
import { DBInitService } from "../shared/services/DBInitService";

// Override environment variables for testing
process.env.NODE_ENV = "test";
process.env.DB_NAME = "pinaka_test_db";

// Increase timeout for test operations
jest.setTimeout(30000);

// Global setup before all tests
beforeAll(async () => {
  // Connect to test database
  try {
    const dbService = DBInitService.getInstance();
    await dbService.initialize();
    console.log("Test database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize test database:", error);
    throw error;
  }
});

// Global teardown after all tests
afterAll(async () => {
  try {
    // DBInitService doesn't have a disconnect method
    // The connection will close automatically when the process ends
    console.log("Test completed - database connection will close with process");
  } catch (error) {
    console.error("Error during test teardown:", error);
  }
});

// Reset application state between test suites if needed
beforeEach(async () => {
  // Clear all mocks between tests
  jest.clearAllMocks();
}); 