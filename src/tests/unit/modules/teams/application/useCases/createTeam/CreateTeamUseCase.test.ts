import { CreateTeamUseCase } from '../../../../../../../modules/teams/application/useCases/createTeam/CreateTeamUseCase';
import { TeamValidationError } from '../../../../../../../modules/teams/domain/exceptions/TeamExceptions';
import { Team } from '../../../../../../../modules/teams/domain/entities/Team';

/**
 * CreateTeamUseCase Unit Tests
 * 
 * These tests verify the business logic of the CreateTeamUseCase
 * without relying on external systems or database connections.
 */
describe('CreateTeamUseCase', () => {
  let createTeamUseCase: CreateTeamUseCase;
  let mockTeamRepo: any;

  beforeEach(() => {
    // Arrange (common setup)
    // Create a fresh mock repository for each test to ensure isolation
    mockTeamRepo = {
      create: jest.fn(),
      findByName: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    
    // Initialize use case with mock repository
    createTeamUseCase = new CreateTeamUseCase(mockTeamRepo);
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a team successfully', async () => {
      // Arrange
      const teamInput = { name: 'Engineering' };
      
      // Mock the create method to return a team with a generated ID
      const createdTeam = {
        id: 1,
        name: teamInput.name
      };
      mockTeamRepo.create.mockResolvedValue(createdTeam);
      
      // Mock the Team.create method
      const originalCreate = Team.create;
      Team.create = jest.fn().mockReturnValue({
        id: 0,
        name: teamInput.name
      });

      // Act
      const result = await createTeamUseCase.execute(teamInput);

      // Assert
      expect(mockTeamRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        id: 0,
        name: teamInput.name
      }));
      expect(result).toEqual(createdTeam);
      
      // Restore the original method
      Team.create = originalCreate;
    });

    it('should throw TeamValidationError when team creation fails due to validation', async () => {
      // Arrange
      const teamInput = { name: '' }; // Invalid input
      
      // Mock Team.create to throw an error
      const originalCreate = Team.create;
      Team.create = jest.fn().mockImplementation(() => {
        throw new Error('Team name cannot be empty');
      });

      // Act & Assert
      await expect(createTeamUseCase.execute(teamInput))
        .rejects
        .toThrow(TeamValidationError);
      expect(mockTeamRepo.create).not.toHaveBeenCalled();
      
      // Restore the original method
      Team.create = originalCreate;
    });
    
    it('should propagate unknown errors', async () => {
      // Arrange
      const teamInput = { name: 'Test Team' };
      
      // Mock Team.create to not throw
      const originalCreate = Team.create;
      Team.create = jest.fn().mockReturnValue({
        id: 0,
        name: teamInput.name
      });
      
      // But mock the repository to throw a different error
      const unknownError = new Error('Database connection failed');
      mockTeamRepo.create.mockRejectedValue(unknownError);

      // Act & Assert
      await expect(createTeamUseCase.execute(teamInput))
        .rejects
        .toThrow('Database connection failed');
      
      // Restore the original method
      Team.create = originalCreate;
    });
    
    it('should create a team with trimmed name', async () => {
      // Arrange
      const teamInput = { name: '  Product Team  ' };
      const trimmedName = 'Product Team';
      
      // Mock the create method
      const createdTeam = {
        id: 1,
        name: trimmedName
      };
      mockTeamRepo.create.mockResolvedValue(createdTeam);
      
      // Mock Team.create to handle trimming the name (simulating actual behavior)
      const originalCreate = Team.create;
      Team.create = jest.fn().mockImplementation((data) => {
        return {
          id: data.id,
          name: data.name.trim()
        };
      });

      // Act
      const result = await createTeamUseCase.execute(teamInput);

      // Assert
      expect(mockTeamRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        name: trimmedName
      }));
      expect(result).toEqual(createdTeam);
      
      // Restore the original method
      Team.create = originalCreate;
    });
    
    it('should handle team names with special characters', async () => {
      // Arrange
      const teamInput = { name: 'Team & Operations (2023)' };
      
      // Mock the create method
      const createdTeam = {
        id: 1,
        name: teamInput.name
      };
      mockTeamRepo.create.mockResolvedValue(createdTeam);
      
      // Mock Team.create
      const originalCreate = Team.create;
      Team.create = jest.fn().mockReturnValue({
        id: 0,
        name: teamInput.name
      });

      // Act
      const result = await createTeamUseCase.execute(teamInput);

      // Assert
      expect(mockTeamRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        name: teamInput.name
      }));
      expect(result).toEqual(createdTeam);
      
      // Restore the original method
      Team.create = originalCreate;
    });
  });
}); 