import { GetKudosCardByIdUseCase } from '../../../../../../../modules/kudosCards/application/useCases/getKudosCardById/GetKudosCardByIdUseCase';
import { KudosCardNotFoundError } from '../../../../../../../modules/kudosCards/domain/exceptions/KudosCardExceptions';
import { TeamNotFoundError } from '../../../../../../../modules/teams/domain/exceptions/TeamExceptions';
import { CategoryNotFoundError } from '../../../../../../../modules/categories/domain/exceptions/CategoryExceptions';
import { createKudosCard, createTeam, createCategory, createUser } from '../../../../../../mocks/testFactories';

// Define the expected DTO type
interface KudosCardDTO {
  id: string;
  recipientName: string;
  teamId: any;  // Could be string or number depending on implementation
  teamName: string;
  categoryId: any;  // Could be string or number depending on implementation
  categoryName: string;
  message: string;
  createdBy: string;
  creatorName: string;
  senderName: string;
  createdAt: any;  // Date or string
  [key: string]: any;  // For other potential properties
}

// Create a mock implementation for KudosCardMapper
const mockToDTO = jest.fn();

// Mock the KudosCardMapper module
jest.mock('../../../../../../../modules/kudosCards/application/mappers/KudosCardMapper', () => ({
  KudosCardMapper: {
    toDTO: (
      kudosCard: any, 
      teamName: string, 
      categoryName: string, 
      creatorName: string, 
      senderName: string
    ) => mockToDTO(kudosCard, teamName, categoryName, creatorName, senderName)
  }
}));

// Import the module after mocking
import { KudosCardMapper } from '../../../../../../../modules/kudosCards/application/mappers/KudosCardMapper';

/**
 * GetKudosCardByIdUseCase Unit Tests
 * 
 * These tests verify the business logic of the GetKudosCardByIdUseCase
 * without relying on external systems or database connections.
 */
describe('GetKudosCardByIdUseCase', () => {
  let getKudosCardByIdUseCase: GetKudosCardByIdUseCase;
  let mockKudosCardRepo: any;
  let mockTeamRepo: any;
  let mockCategoryRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    // Arrange (common setup)
    // Create fresh mock repos for each test to ensure isolation
    mockKudosCardRepo = {
      findById: jest.fn()
    };
    
    mockTeamRepo = {
      findById: jest.fn()
    };
    
    mockCategoryRepo = {
      findById: jest.fn()
    };
    
    mockUserRepo = {
      findById: jest.fn()
    };
    
    // Initialize use case with mock repositories
    getKudosCardByIdUseCase = new GetKudosCardByIdUseCase(
      mockKudosCardRepo,
      mockTeamRepo,
      mockCategoryRepo,
      mockUserRepo
    );
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a kudos card with team and category details when found', async () => {
      // Arrange
      const kudosCardId = 'kudos-123';
      const creatorId = 'creator-123';
      const currentDate = new Date();
      
      const kudosCard = createKudosCard({
        id: kudosCardId,
        recipientName: 'John Doe',
        teamId: 'team-123',
        categoryId: 'category-123',
        message: 'Great job!',
        createdBy: creatorId,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      
      const team = createTeam({
        id: 'team-123',
        name: 'Engineering'
      });
      
      const category = createCategory({
        id: 'category-123',
        name: 'Innovation'
      });
      
      const creator = createUser({
        id: creatorId,
        firstName: 'Jane',
        lastName: 'Smith'
      });
      
      const expectedDTO = {
        id: kudosCardId,
        recipientName: 'John Doe',
        teamId: team.id,
        teamName: team.name,
        categoryId: category.id,
        categoryName: category.name,
        message: 'Great job!',
        createdBy: creatorId,
        creatorName: 'Jane Smith',
        senderName: 'Jane Smith',
        createdAt: kudosCard.createdAt
      };
      
      // Mock repository responses
      mockKudosCardRepo.findById.mockResolvedValue(kudosCard);
      mockTeamRepo.findById.mockResolvedValue(team);
      mockCategoryRepo.findById.mockResolvedValue(category);
      mockUserRepo.findById.mockResolvedValue(creator);
      
      // Set up the mock toDTO function to return our expected DTO
      mockToDTO.mockImplementation(() => expectedDTO);

      // Act
      const result = await getKudosCardByIdUseCase.execute(kudosCardId);

      // Assert
      expect(mockKudosCardRepo.findById).toHaveBeenCalledWith(kudosCardId);
      expect(mockTeamRepo.findById).toHaveBeenCalledWith(kudosCard.teamId);
      expect(mockCategoryRepo.findById).toHaveBeenCalledWith(kudosCard.categoryId);
      expect(mockUserRepo.findById).toHaveBeenCalledWith(kudosCard.createdBy);
      
      expect(mockToDTO).toHaveBeenCalledWith(
        kudosCard,
        team.name,
        category.name,
        'Jane Smith',
        'Jane Smith'
      );
      
      expect(result).toEqual(expectedDTO);
    });

    it('should handle kudos card with different creator and sender', async () => {
      // Arrange
      const kudosCardId = 'kudos-123';
      const creatorId = 'creator-123';
      const senderId = 'sender-123';
      const currentDate = new Date();
      
      const kudosCard = createKudosCard({
        id: kudosCardId,
        recipientName: 'John Doe',
        teamId: 'team-123',
        categoryId: 'category-123',
        message: 'Great job!',
        createdBy: creatorId,
        sentBy: senderId,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      
      const team = createTeam({
        id: 'team-123',
        name: 'Engineering'
      });
      
      const category = createCategory({
        id: 'category-123',
        name: 'Innovation'
      });
      
      const creator = createUser({
        id: creatorId,
        firstName: 'Admin',
        lastName: 'User'
      });
      
      const sender = createUser({
        id: senderId,
        firstName: 'Team',
        lastName: 'Member'
      });
      
      const expectedDTO = {
        id: kudosCardId,
        recipientName: 'John Doe',
        teamId: team.id,
        teamName: team.name,
        categoryId: category.id,
        categoryName: category.name,
        message: 'Great job!',
        createdBy: creatorId,
        creatorName: 'Admin User',
        senderName: 'Team Member',
        createdAt: kudosCard.createdAt
      };
      
      // Mock repository responses
      mockKudosCardRepo.findById.mockResolvedValue(kudosCard);
      mockTeamRepo.findById.mockResolvedValue(team);
      mockCategoryRepo.findById.mockResolvedValue(category);
      mockUserRepo.findById.mockImplementation((id: string) => {
        if (id === creatorId) return creator;
        if (id === senderId) return sender;
        return null;
      });
      
      // Set up the mock toDTO function to return our expected DTO
      mockToDTO.mockImplementation(() => expectedDTO);

      // Act
      const result = await getKudosCardByIdUseCase.execute(kudosCardId);

      // Assert
      expect(mockUserRepo.findById).toHaveBeenCalledWith(creatorId);
      expect(mockUserRepo.findById).toHaveBeenCalledWith(senderId);
      
      expect(mockToDTO).toHaveBeenCalledWith(
        kudosCard,
        team.name,
        category.name,
        'Admin User',
        'Team Member'
      );
      
      expect(result).toEqual(expectedDTO);
    });

    it('should throw KudosCardNotFoundError when kudos card does not exist', async () => {
      // Arrange
      const nonExistentId = 'non-existent-kudos';
      
      // Mock repository responses
      mockKudosCardRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(getKudosCardByIdUseCase.execute(nonExistentId))
        .rejects
        .toThrow(KudosCardNotFoundError);
      
      expect(mockKudosCardRepo.findById).toHaveBeenCalledWith(nonExistentId);
      expect(mockTeamRepo.findById).not.toHaveBeenCalled();
      expect(mockCategoryRepo.findById).not.toHaveBeenCalled();
      expect(mockUserRepo.findById).not.toHaveBeenCalled();
    });

    it('should throw TeamNotFoundError when team does not exist', async () => {
      // Arrange
      const kudosCardId = 'kudos-123';
      const nonExistentTeamId = 'non-existent-team';
      const currentDate = new Date();
      
      const kudosCard = createKudosCard({
        id: kudosCardId,
        teamId: nonExistentTeamId,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      
      // Mock repository responses
      mockKudosCardRepo.findById.mockResolvedValue(kudosCard);
      mockTeamRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(getKudosCardByIdUseCase.execute(kudosCardId))
        .rejects
        .toThrow(TeamNotFoundError);
      
      expect(mockKudosCardRepo.findById).toHaveBeenCalledWith(kudosCardId);
      expect(mockTeamRepo.findById).toHaveBeenCalledWith(nonExistentTeamId);
      expect(mockCategoryRepo.findById).not.toHaveBeenCalled();
    });

    it('should throw CategoryNotFoundError when category does not exist', async () => {
      // Arrange
      const kudosCardId = 'kudos-123';
      const teamId = 'team-123';
      const nonExistentCategoryId = 'non-existent-category';
      const currentDate = new Date();
      
      const kudosCard = createKudosCard({
        id: kudosCardId,
        teamId,
        categoryId: nonExistentCategoryId,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      
      const team = createTeam({
        id: teamId
      });
      
      // Mock repository responses
      mockKudosCardRepo.findById.mockResolvedValue(kudosCard);
      mockTeamRepo.findById.mockResolvedValue(team);
      mockCategoryRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(getKudosCardByIdUseCase.execute(kudosCardId))
        .rejects
        .toThrow(CategoryNotFoundError);
      
      expect(mockKudosCardRepo.findById).toHaveBeenCalledWith(kudosCardId);
      expect(mockTeamRepo.findById).toHaveBeenCalledWith(teamId);
      expect(mockCategoryRepo.findById).toHaveBeenCalledWith(nonExistentCategoryId);
    });

    it('should handle the case when creator user is not found', async () => {
      // Arrange
      const kudosCardId = 'kudos-123';
      const nonExistentCreatorId = 'deleted-user';
      const currentDate = new Date();
      
      const kudosCard = createKudosCard({
        id: kudosCardId,
        createdBy: nonExistentCreatorId,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      
      const team = createTeam({
        id: kudosCard.teamId
      });
      
      const category = createCategory({
        id: kudosCard.categoryId
      });
      
      const expectedDTO = {
        id: kudosCardId,
        createdBy: nonExistentCreatorId,
        creatorName: 'Unknown User'
      };
      
      // Mock repository responses
      mockKudosCardRepo.findById.mockResolvedValue(kudosCard);
      mockTeamRepo.findById.mockResolvedValue(team);
      mockCategoryRepo.findById.mockResolvedValue(category);
      mockUserRepo.findById.mockResolvedValue(null);
      
      // Set up the mock toDTO function to return our expected DTO
      mockToDTO.mockImplementation(() => expectedDTO);

      // Act
      const result = await getKudosCardByIdUseCase.execute(kudosCardId);

      // Assert
      expect(mockUserRepo.findById).toHaveBeenCalledWith(nonExistentCreatorId);
      
      expect(mockToDTO).toHaveBeenCalledWith(
        kudosCard,
        team.name,
        category.name,
        'Unknown User',
        'Unknown User'
      );
      
      expect(result).toEqual(expectedDTO);
    });
  });
}); 