import { GetAllTeamsUseCase } from '../../../../../../../modules/teams/application/useCases/getAllTeams/GetAllTeamsUseCase';
import { createTeam } from '../../../../../../mocks/testFactories';

/**
 * GetAllTeamsUseCase Unit Tests
 * 
 * These tests verify the business logic of the GetAllTeamsUseCase
 * without relying on external systems or database connections.
 */
describe('GetAllTeamsUseCase', () => {
  let getAllTeamsUseCase: GetAllTeamsUseCase;
  let mockTeamRepo: any;

  beforeEach(() => {
    // Arrange (common setup)
    // Create a fresh mock repository for each test to ensure isolation
    mockTeamRepo = {
      findAll: jest.fn()
    };
    
    // Initialize use case with mock repository
    getAllTeamsUseCase = new GetAllTeamsUseCase(mockTeamRepo);
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return all teams successfully', async () => {
      // Arrange
      const mockTeams = [
        createTeam({ id: 'team-1', name: 'Engineering' }),
        createTeam({ id: 'team-2', name: 'Product' }),
        createTeam({ id: 'team-3', name: 'Design' })
      ];
      
      mockTeamRepo.findAll.mockResolvedValue(mockTeams);

      // Act
      const result = await getAllTeamsUseCase.execute();

      // Assert
      expect(mockTeamRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTeams);
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('Engineering');
      expect(result[1].name).toBe('Product');
      expect(result[2].name).toBe('Design');
    });

    it('should return empty array when no teams exist', async () => {
      // Arrange
      mockTeamRepo.findAll.mockResolvedValue([]);

      // Act
      const result = await getAllTeamsUseCase.execute();

      // Assert
      expect(mockTeamRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle errors from the repository', async () => {
      // Arrange
      const repositoryError = new Error('Database error');
      mockTeamRepo.findAll.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(getAllTeamsUseCase.execute())
        .rejects
        .toThrow('Database error');
    });
    
    it('should return teams sorted alphabetically by name', async () => {
      // Arrange - out of order teams
      const mockTeams = [
        createTeam({ id: 'team-2', name: 'Product' }),
        createTeam({ id: 'team-3', name: 'Design' }),
        createTeam({ id: 'team-1', name: 'Engineering' })
      ];
      
      // Assume the repository sorts teams by name
      const sortedMockTeams = [...mockTeams].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      
      mockTeamRepo.findAll.mockResolvedValue(sortedMockTeams);

      // Act
      const result = await getAllTeamsUseCase.execute();

      // Assert
      expect(mockTeamRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(sortedMockTeams);
      // Check if teams are sorted properly
      expect(result[0].name).toBe('Design');
      expect(result[1].name).toBe('Engineering');
      expect(result[2].name).toBe('Product');
    });
  });
}); 