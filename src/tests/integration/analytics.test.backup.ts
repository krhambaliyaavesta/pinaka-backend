import { createTestRequest } from '../utils/testRequest';
import { initMockRepositories, seedMockData } from '../utils/dbHelpers';
import { UserRole } from '../utils/authHelpers';

describe('Analytics API Integration Tests', () => {
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
    
    // Create additional kudos cards for better analytics testing
    const techLeadUserId = seededData.userIds[0];
    const authRequest = createTestRequest().setAuth(techLeadUserId, UserRole.TECH_LEAD);
    
    // Create multiple kudos for the same recipient to ensure they show up as "top"
    const topRecipientName = 'Top Recipient';
    for (let i = 0; i < 3; i++) {
      // Instead of using the API, we'll create directly in the mock repository
      await mockRepositories.kudosCardRepository.create({
        recipientName: topRecipientName,
        teamId: seededData.teamIds[0], // Engineering team
        categoryId: seededData.categoryIds[0], // Teamwork category
        message: 'Great teamwork and collaboration on the project!',
        createdBy: techLeadUserId
      });
    }
    
    // Create kudos with different categories
    await mockRepositories.kudosCardRepository.create({
      recipientName: 'Another Recipient',
      teamId: seededData.teamIds[1], // Product team
      categoryId: seededData.categoryIds[1], // Innovation category
      message: 'Innovative solution to a complex problem!',
      createdBy: techLeadUserId
    });
    
    await mockRepositories.kudosCardRepository.create({
      recipientName: 'Yet Another Recipient',
      teamId: seededData.teamIds[2], // Design team
      categoryId: seededData.categoryIds[2], // Helping Hand category
      message: 'Always helping team members when needed!',
      createdBy: techLeadUserId
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
  
  describe('GET /api/analytics/top-recipients', () => {
    it('should return top recipients by kudos count', async () => {
      // Arrange
      const userId = seededData.userIds[1]; // Team member
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get('/api/analytics/top-recipients');
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // "Top Recipient" should be at the top with count of 3
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('recipientName', 'Top Recipient');
      expect(response.body[0]).toHaveProperty('count', 3);
      
      // Results should be in descending order by count
      for (let i = 1; i < response.body.length; i++) {
        expect(response.body[i-1].count).toBeGreaterThanOrEqual(response.body[i].count);
      }
    });
    
    it('should filter by time period when specified', async () => {
      // Arrange
      const userId = seededData.userIds[1];
      
      // Current month/year for filtering
      const now = new Date();
      const period = 'monthly';
      const periodDate = `${now.getFullYear()}-${now.getMonth() + 1}`;
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get(`/api/analytics/top-recipients?period=${period}&date=${periodDate}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // All kudos were created this month, so results should be the same as without filter
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('recipientName', 'Top Recipient');
    });
    
    it('should limit results when limit is specified', async () => {
      // Arrange
      const userId = seededData.userIds[1];
      const limit = 2;
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get(`/api/analytics/top-recipients?limit=${limit}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(limit);
    });
    
    it('should return 401 when not authenticated', async () => {
      // Act - no authentication token set
      const response = await testRequest
        .get('/api/analytics/top-recipients');
      
      // Assert
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/analytics/top-teams', () => {
    it('should return top teams by kudos count', async () => {
      // Arrange
      const userId = seededData.userIds[1]; // Team member
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get('/api/analytics/top-teams');
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // Engineering team should be at the top with higher count (3)
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('teamId', seededData.teamIds[0]);
      
      // Results should be in descending order by count
      for (let i = 1; i < response.body.length; i++) {
        expect(response.body[i-1].count).toBeGreaterThanOrEqual(response.body[i].count);
      }
    });
    
    it('should return 401 when not authenticated', async () => {
      // Act - no authentication token set
      const response = await testRequest
        .get('/api/analytics/top-teams');
      
      // Assert
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/analytics/top-categories', () => {
    it('should return top categories by kudos count', async () => {
      // Arrange
      const userId = seededData.userIds[1]; // Team member
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get('/api/analytics/top-categories');
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // Teamwork category should be at the top with higher count (3)
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('categoryId', seededData.categoryIds[0]);
      
      // Results should be in descending order by count
      for (let i = 1; i < response.body.length; i++) {
        expect(response.body[i-1].count).toBeGreaterThanOrEqual(response.body[i].count);
      }
    });
    
    it('should return 401 when not authenticated', async () => {
      // Act - no authentication token set
      const response = await testRequest
        .get('/api/analytics/top-categories');
      
      // Assert
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/analytics/trending-words', () => {
    it('should return trending words from kudos messages', async () => {
      // Arrange
      const userId = seededData.userIds[1]; // Team member
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get('/api/analytics/trending-words');
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // We should see "teamwork" and/or "collaboration" among trending words
      expect(response.body.length).toBeGreaterThan(0);
      
      // Check if common words like teamwork/collaboration are in the results
      const words = response.body.map((item: any) => item.word);
      expect(
        words.includes('teamwork') || 
        words.includes('collaboration') || 
        words.includes('helping')
      ).toBe(true);
      
      // Results should be in descending order by count
      for (let i = 1; i < response.body.length; i++) {
        expect(response.body[i-1].count).toBeGreaterThanOrEqual(response.body[i].count);
      }
    });
    
    it('should limit results when limit is specified', async () => {
      // Arrange
      const userId = seededData.userIds[1];
      const limit = 5;
      
      // Act
      const response = await testRequest
        .setAuth(userId, UserRole.TEAM_MEMBER)
        .get(`/api/analytics/trending-words?limit=${limit}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(limit);
    });
    
    it('should return 401 when not authenticated', async () => {
      // Act - no authentication token set
      const response = await testRequest
        .get('/api/analytics/trending-words');
      
      // Assert
      expect(response.status).toBe(401);
    });
  });
}); 