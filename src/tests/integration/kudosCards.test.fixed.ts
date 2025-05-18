import { createTestRequest } from '../utils/testRequest';
import { UserRole } from '../utils/authHelpers';
import { setupTestEnvironment } from '../utils/testHelpers';
import { createKudosCardDTO, createUser, createTeam, createCategory } from '../mocks/testFactories';

// Define a KudosCard interface for better type safety
interface KudosCard {
  id: string;
  recipientName: string;
  teamId: string;
  categoryId: string;
  message: string;
  createdBy: string;
  createdAt: Date;
}

/**
 * Kudos Cards API Integration Tests
 * 
 * Tests the entire request/response flow through the API endpoints
 * for kudos card operations including create, read, update, and delete.
 */
describe('Kudos Cards API Integration Tests', () => {
  let testRequest: ReturnType<typeof createTestRequest>;
  let testEnv: any;
  
  // Global setup once before all tests in this describe block
  beforeAll(async () => {
    // Set up test environment with clean data
    testEnv = setupTestEnvironment();
  });
  
  // Clean up after all tests
  afterAll(async () => {
    testEnv.tearDown();
  });
  
  // Reset state and create fresh request for each test
  beforeEach(() => {
    // Create fresh test request instance for each test
    testRequest = createTestRequest();
  });
  
  describe('POST /api/kudos-cards', () => {
    it('should create a new kudos card when authenticated as tech lead', async () => {
      // Arrange - set up isolated test data specific to this test
      const techLead = await testEnv.mockRepositories.userRepository.create(
        createUser({ name: 'Tech Lead', role: 'TECH_LEAD' })
      );
      
      const team = await testEnv.mockRepositories.teamRepository.create(
        createTeam({ name: 'Engineering Team' })
      );
      
      const category = await testEnv.mockRepositories.categoryRepository.create(
        createCategory({ name: 'Innovation' })
      );
      
      const newKudos = createKudosCardDTO({
        recipientName: 'Test Recipient',
        teamId: team.id,
        categoryId: category.id,
        message: 'Great job on the project launch!'
      });
      
      // Act - perform the API request
      const response = await testRequest
        .setAuth(techLead.id, UserRole.TECH_LEAD)
        .post('/api/kudos-cards', newKudos);
      
      // Assert - verify the response
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toMatchObject({
        recipientName: newKudos.recipientName,
        teamId: newKudos.teamId,
        categoryId: newKudos.categoryId,
        message: newKudos.message,
        createdBy: techLead.id
      });
    });
    
    it('should return 403 when authenticated as team member', async () => {
      // Arrange - set up test data
      const teamMember = await testEnv.mockRepositories.userRepository.create(
        createUser({ name: 'Team Member', role: 'TEAM_MEMBER' })
      );
      
      const team = await testEnv.mockRepositories.teamRepository.create(
        createTeam({ name: 'Product Team' })
      );
      
      const category = await testEnv.mockRepositories.categoryRepository.create(
        createCategory({ name: 'Teamwork' })
      );
      
      const newKudos = createKudosCardDTO({
        recipientName: 'Another Recipient',
        teamId: team.id,
        categoryId: category.id,
        message: 'Amazing collaboration on the feature!'
      });
      
      // Act
      const response = await testRequest
        .setAuth(teamMember.id, UserRole.TEAM_MEMBER)
        .post('/api/kudos-cards', newKudos);
      
      // Assert
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
    
    // Table-driven tests for validation cases
    describe('input validation', () => {
      const validationTestCases = [
        {
          scenario: 'missing recipient name',
          input: { recipientName: '' },
          expectedStatus: 400,
          expectedErrorPattern: /recipient.+required/i
        },
        {
          scenario: 'missing team ID',
          input: { teamId: '' },
          expectedStatus: 400,
          expectedErrorPattern: /team.+required/i
        },
        {
          scenario: 'missing category ID',
          input: { categoryId: '' },
          expectedStatus: 400,
          expectedErrorPattern: /category.+required/i
        },
        {
          scenario: 'message too short',
          input: { message: 'Hi' },
          expectedStatus: 400,
          expectedErrorPattern: /message.+too short/i
        }
      ];

      // Set up a tech lead user once for all validation tests
      let techLeadId: string;

      beforeAll(async () => {
        const techLead = await testEnv.mockRepositories.userRepository.create(
          createUser({ name: 'Tech Lead for Validation', role: 'TECH_LEAD' })
        );
        techLeadId = techLead.id;
      });

      validationTestCases.forEach(({ scenario, input, expectedStatus, expectedErrorPattern }) => {
        it(`should return ${expectedStatus} with ${scenario}`, async () => {
          // Arrange
          const invalidKudos = createKudosCardDTO(input);
          
          // Act
          const response = await testRequest
            .setAuth(techLeadId, UserRole.TECH_LEAD)
            .post('/api/kudos-cards', invalidKudos);
          
          // Assert
          expect(response.status).toBe(expectedStatus);
          expect(response.body).toHaveProperty('error');
          expect(response.body.error).toMatch(expectedErrorPattern);
        });
      });
    });
    
    it('should return 401 when not authenticated', async () => {
      // Arrange - prepare test data
      const newKudos = createKudosCardDTO();
      
      // Act - no authentication token set
      const response = await testRequest
        .post('/api/kudos-cards', newKudos);
      
      // Assert
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/kudos-cards', () => {
    // Setup data needed for the get tests
    let teamMemberId: string;
    let teamId: string;
    let categoryId: string;
    
    beforeAll(async () => {
      // Create test data once for all GET tests
      const teamMember = await testEnv.mockRepositories.userRepository.create(
        createUser({ name: 'Team Member for GET', role: 'TEAM_MEMBER' })
      );
      teamMemberId = teamMember.id;
      
      const team = await testEnv.mockRepositories.teamRepository.create(
        createTeam({ name: 'Team for GET' })
      );
      teamId = team.id;
      
      const category = await testEnv.mockRepositories.categoryRepository.create(
        createCategory({ name: 'Category for GET' })
      );
      categoryId = category.id;
      
      // Create some test kudos cards
      await testEnv.mockRepositories.kudosCardRepository.create({
        id: 'kudos-get-1',
        recipientName: 'John Doe',
        teamId,
        categoryId,
        message: 'First test kudos card',
        createdBy: teamMemberId,
        createdAt: new Date()
      });
      
      await testEnv.mockRepositories.kudosCardRepository.create({
        id: 'kudos-get-2',
        recipientName: 'Jane Smith',
        teamId,
        categoryId: 'different-category',
        message: 'Second test kudos card',
        createdBy: teamMemberId,
        createdAt: new Date()
      });
    });
    
    it('should return all kudos cards', async () => {
      // Arrange
      
      // Act
      const response = await testRequest
        .setAuth(teamMemberId, UserRole.TEAM_MEMBER)
        .get('/api/kudos-cards');
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
    
    it('should filter kudos cards by team', async () => {
      // Arrange
      
      // Act
      const response = await testRequest
        .setAuth(teamMemberId, UserRole.TEAM_MEMBER)
        .get(`/api/kudos-cards?teamId=${teamId}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // All returned kudos should belong to the specified team
      response.body.forEach((kudos: KudosCard) => {
        expect(kudos.teamId).toBe(teamId);
      });
    });
    
    it('should filter kudos cards by category', async () => {
      // Arrange
      
      // Act
      const response = await testRequest
        .setAuth(teamMemberId, UserRole.TEAM_MEMBER)
        .get(`/api/kudos-cards?categoryId=${categoryId}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // All returned kudos should belong to the specified category
      response.body.forEach((kudos: KudosCard) => {
        expect(kudos.categoryId).toBe(categoryId);
      });
    });
    
    it('should filter kudos cards by recipient name', async () => {
      // Arrange
      const recipientName = 'John Doe';
      
      // Add specific test data for this test case
      await testEnv.mockRepositories.kudosCardRepository.create({
        id: 'kudos-get-recipient',
        recipientName,
        teamId: 'any-team',
        categoryId: 'any-category',
        message: 'Test recipient filtering',
        createdBy: teamMemberId,
        createdAt: new Date()
      });
      
      // Act
      const response = await testRequest
        .setAuth(teamMemberId, UserRole.TEAM_MEMBER)
        .get(`/api/kudos-cards?recipientName=${encodeURIComponent(recipientName)}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // All returned kudos should have the specified recipient name
      response.body.forEach((kudos: KudosCard) => {
        expect(kudos.recipientName).toBe(recipientName);
      });
    });
    
    it('should return 401 when not authenticated', async () => {
      // Act - no authentication token set
      const response = await testRequest
        .get('/api/kudos-cards');
      
      // Assert
      expect(response.status).toBe(401);
    });
    
    // Edge case: Test with pagination
    it('should support pagination of results', async () => {
      // Arrange - Create many kudos cards for pagination testing
      const kudosCount = 12; // Make sure there's enough data for pagination
      
      for (let i = 0; i < kudosCount; i++) {
        await testEnv.mockRepositories.kudosCardRepository.create({
          id: `kudos-page-${i}`,
          recipientName: `Recipient ${i}`,
          teamId: 'pagination-team',
          categoryId: 'pagination-category',
          message: `Kudos message ${i}`,
          createdBy: teamMemberId,
          createdAt: new Date()
        });
      }
      
      // Act - Request page 2 with 5 items per page
      const response = await testRequest
        .setAuth(teamMemberId, UserRole.TEAM_MEMBER)
        .get('/api/kudos-cards?page=2&limit=5&teamId=pagination-team');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body.page).toBe(2);
      expect(response.body.limit).toBe(5);
      // Should be 5 items on page 2 if there are >= 10 items total
      expect(response.body.items.length).toBeLessThanOrEqual(5);
    });
  });
});
