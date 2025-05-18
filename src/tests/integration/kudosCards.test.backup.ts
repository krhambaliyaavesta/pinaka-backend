import { createTestRequest } from '../utils/testRequest';
import { initMockRepositories, seedMockData } from '../utils/dbHelpers';
import { UserRole } from '../utils/authHelpers';
import { mockKudosCard } from '../mocks/mockData';

describe('Kudos Cards API Integration Tests', () => {
  let testRequest: any;
  let mockRepositories: any;
  let seededData: { teamIds: string[]; categoryIds: string[]; userIds: string[] };
  
  beforeAll(async () => {
    // Initialize mock repositories and seed test data
    mockRepositories = initMockRepositories();
    seededData = seedMockData({
      createUsers: true, 
      createTeams: true,
      createCategories: true,
      createKudosCards: true
    });
  });
  
  afterAll(async () => {
    // Clean up test data
    mockRepositories.clearAllMockData();
  });
  
  beforeEach(() => {
    // Create fresh test request instance
    testRequest = createTestRequest();
  });
  
  describe('POST /api/kudos-cards', () => {
    it('should create a new kudos card when authenticated as tech lead', async () => {
      // Arrange
      const techLeadUserId = seededData.userIds[0]; // Assuming first user is a tech lead
      
      const newKudos = {
        recipientName: 'Test Recipient',
        teamId: seededData.teamIds[0],
        categoryId: seededData.categoryIds[0],
        message: 'Great job on the project launch!'
      };
      
      // Act
      const response = await testRequest
        .setAuth(techLeadUserId, UserRole.TECH_LEAD)
        .post('/api/kudos-cards', newKudos);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.recipientName).toBe(newKudos.recipientName);
      expect(response.body.message).toBe(newKudos.message);
      expect(response.body.teamId).toBe(newKudos.teamId);
      expect(response.body.categoryId).toBe(newKudos.categoryId);
    });
    
    it('should return 403 when authenticated as team member', async () => {
      // Arrange
      const teamMemberUserId = seededData.userIds[1]; // Assuming second user is a team member
      
      const newKudos = {
        recipientName: 'Another Recipient',
        teamId: seededData.teamIds[0],
        categoryId: seededData.categoryIds[0],
        message: 'Amazing collaboration on the feature!'
      };
      
      // Act
      const response = await testRequest
        .setAuth(teamMemberUserId, UserRole.TEAM_MEMBER)
        .post('/api/kudos-cards', newKudos);
      
      // Assert
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should return 400 when missing required fields', async () => {
      // Arrange
      const techLeadUserId = seededData.userIds[0];
      
      const invalidKudos = {
        // Missing recipientName
        teamId: seededData.teamIds[0],
        categoryId: seededData.categoryIds[0],
        message: 'Great job on the project!'
      };
      
      // Act
      const response = await testRequest
        .setAuth(techLeadUserId, UserRole.TECH_LEAD)
        .post('/api/kudos-cards', invalidKudos);
      
      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should return 401 when not authenticated', async () => {
      // Arrange
      const newKudos = {
        recipientName: 'Test Recipient',
        teamId: seededData.teamIds[0],
        categoryId: seededData.categoryIds[0],
        message: 'Great job on the project!'
      };
      
      // Act - no authentication token set
      const response = await testRequest
        .post('/api/kudos-cards', newKudos);
      
      // Assert
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/kudos-cards', () => {
    it('should return all kudos cards', async () => {
      // Arrange - any authenticated user can view kudos
      const userId = seededData.userIds[1]; // Team member
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get('/api/kudos-cards');
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Should return at least the kudos card we created in previous test
      expect(response.body.length).toBeGreaterThan(0);
    });
    
    it('should filter kudos cards by team', async () => {
      // Arrange
      const userId = seededData.userIds[1];
      const teamId = seededData.teamIds[0];
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get(`/api/kudos-cards?teamId=${teamId}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // All returned kudos should belong to the specified team
      response.body.forEach((kudos: any) => {
        expect(kudos.teamId).toBe(teamId);
      });
    });
    
    it('should filter kudos cards by category', async () => {
      // Arrange
      const userId = seededData.userIds[1];
      const categoryId = seededData.categoryIds[0];
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get(`/api/kudos-cards?categoryId=${categoryId}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // All returned kudos should belong to the specified category
      response.body.forEach((kudos: any) => {
        expect(kudos.categoryId).toBe(categoryId);
      });
    });
    
    it('should filter kudos cards by recipient name', async () => {
      // Arrange
      const userId = seededData.userIds[1];
      const recipientName = 'Test Recipient';
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get(`/api/kudos-cards?recipientName=${encodeURIComponent(recipientName)}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // All returned kudos should have the specified recipient name
      response.body.forEach((kudos: any) => {
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
  });
  
  describe('GET /api/kudos-cards/:id', () => {
    let kudosId: string;
    
    beforeAll(async () => {
      // Create a kudos card to test with
      const techLeadUserId = seededData.userIds[0];
      
      const newKudos = {
        recipientName: 'Get By ID Test',
        teamId: seededData.teamIds[0],
        categoryId: seededData.categoryIds[0],
        message: 'This is a test kudos for getById'
      };
      
      const response = await createTestRequest()
        .setAuth(techLeadUserId, UserRole.TECH_LEAD)
        .post('/api/kudos-cards', newKudos);
      
      kudosId = response.body.id;
    });
    
    it('should get a specific kudos card by ID', async () => {
      // Arrange
      const userId = seededData.userIds[1];
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get(`/api/kudos-cards/${kudosId}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', kudosId);
      expect(response.body.recipientName).toBe('Get By ID Test');
    });
    
    it('should return 404 for non-existent kudos ID', async () => {
      // Arrange
      const userId = seededData.userIds[1];
      const nonExistentId = 'non-existent-id';
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get(`/api/kudos-cards/${nonExistentId}`);
      
      // Assert
      expect(response.status).toBe(404);
    });
    
    it('should return 401 when not authenticated', async () => {
      // Act - no authentication token set
      const response = await testRequest
        .get(`/api/kudos-cards/${kudosId}`);
      
      // Assert
      expect(response.status).toBe(401);
    });
  });
}); 