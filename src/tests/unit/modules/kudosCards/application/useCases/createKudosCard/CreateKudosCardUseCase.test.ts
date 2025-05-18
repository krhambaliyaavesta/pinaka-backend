import { CreateKudosCardUseCase } from '../../../../../../../modules/kudosCards/application/useCases/createKudosCard/CreateKudosCardUseCase';
import { 
  KudosCardValidationError,
  InsufficientPermissionsError 
} from '../../../../../../../modules/kudosCards/domain/exceptions/KudosCardExceptions';
import { TeamNotFoundError } from '../../../../../../../modules/teams/domain/exceptions/TeamExceptions';
import { CategoryNotFoundError } from '../../../../../../../modules/categories/domain/exceptions/CategoryExceptions';
import { 
  createKudosCardDTO, 
  createUser, 
  createTeam, 
  createCategory,
  createKudosCard
} from '../../../../../../mocks/testFactories';
import { KudosCard } from '../../../../../../../modules/kudosCards/domain/entities/KudosCard';

/**
 * CreateKudosCardUseCase Unit Tests
 * 
 * These tests verify the business logic of the CreateKudosCardUseCase
 * without relying on external systems or database connections.
 */
describe('CreateKudosCardUseCase', () => {
  let createKudosCardUseCase: CreateKudosCardUseCase;
  let mockKudosCardRepo: any;
  let mockTeamRepo: any;
  let mockCategoryRepo: any;
  let mockUserRepo: any;

  // Mock the KudosCard.create static method
  const originalKudosCardCreate = KudosCard.create;
  
  beforeEach(() => {
    // Arrange (common setup)
    // Create fresh mock repos for each test to ensure isolation
    mockKudosCardRepo = {
      create: jest.fn()
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
    createKudosCardUseCase = new CreateKudosCardUseCase(
      mockKudosCardRepo,
      mockTeamRepo,
      mockCategoryRepo,
      mockUserRepo
    );
    
    // Mock KudosCard.create
    KudosCard.create = jest.fn();
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
    // Restore original KudosCard.create method
    KudosCard.create = originalKudosCardCreate;
  });

  describe('execute', () => {
    it('should create a kudos card successfully when called by admin', async () => {
      // Arrange
      const adminId = 'admin-123';
      const adminUser = createUser({ 
        id: adminId, 
        firstName: 'Admin',
        lastName: 'User',
        role: 1 // Admin role
      });
      
      const teamId = 1;
      const team = createTeam({ id: teamId, name: 'Engineering' });
      
      const categoryId = 1;
      const category = createCategory({ id: categoryId, name: 'Innovation' });
      
      const kudosCardDto = createKudosCardDTO({
        recipientName: 'John Doe',
        teamId,
        categoryId,
        message: 'Great job on the project!'
      });
      
      const currentDate = new Date();
      const createdKudosCard = createKudosCard({
        id: 'kudos-123',
        recipientName: kudosCardDto.recipientName,
        teamId: kudosCardDto.teamId,
        categoryId: kudosCardDto.categoryId,
        message: kudosCardDto.message,
        createdBy: adminId,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      
      // Mock repository responses
      mockUserRepo.findById.mockResolvedValue(adminUser);
      mockTeamRepo.findById.mockResolvedValue(team);
      mockCategoryRepo.findById.mockResolvedValue(category);
      
      // Mock KudosCard.create
      (KudosCard.create as jest.Mock).mockReturnValue(createdKudosCard);
      
      mockKudosCardRepo.create.mockResolvedValue(createdKudosCard);

      // Act
      const result = await createKudosCardUseCase.execute(kudosCardDto, adminId);

      // Assert
      expect(mockUserRepo.findById).toHaveBeenCalledWith(adminId);
      expect(mockTeamRepo.findById).toHaveBeenCalledWith(kudosCardDto.teamId);
      expect(mockCategoryRepo.findById).toHaveBeenCalledWith(kudosCardDto.categoryId);
      expect(KudosCard.create).toHaveBeenCalledWith(expect.objectContaining({
        recipientName: kudosCardDto.recipientName,
        teamId: kudosCardDto.teamId,
        categoryId: kudosCardDto.categoryId,
        message: kudosCardDto.message,
        createdBy: adminId
      }));
      expect(mockKudosCardRepo.create).toHaveBeenCalledWith(createdKudosCard);
      
      expect(result).toEqual(expect.objectContaining({
        id: createdKudosCard.id,
        recipientName: createdKudosCard.recipientName,
        teamName: team.name,
        categoryName: category.name
      }));
    });

    it('should create a kudos card successfully when called by tech lead', async () => {
      // Arrange
      const techLeadId = 'techlead-123';
      const techLeadUser = createUser({ 
        id: techLeadId, 
        firstName: 'Tech',
        lastName: 'Lead',
        role: 2 // Tech Lead role
      });
      
      const teamId = 1;
      const team = createTeam({ id: teamId, name: 'Engineering' });
      
      const categoryId = 1;
      const category = createCategory({ id: categoryId, name: 'Innovation' });
      
      const kudosCardDto = createKudosCardDTO({
        recipientName: 'Jane Doe',
        teamId,
        categoryId,
        message: 'Excellent problem solving!'
      });
      
      const currentDate = new Date();
      const createdKudosCard = {
        id: 'kudos-123',
        recipientName: kudosCardDto.recipientName,
        teamId: kudosCardDto.teamId,
        categoryId: kudosCardDto.categoryId,
        message: kudosCardDto.message,
        createdBy: techLeadId,
        createdAt: currentDate,
        updatedAt: currentDate,
        toObject: () => ({
          id: 'kudos-123',
          recipientName: kudosCardDto.recipientName,
          teamId: kudosCardDto.teamId,
          categoryId: kudosCardDto.categoryId,
          message: kudosCardDto.message,
          createdBy: techLeadId,
          createdAt: currentDate,
          updatedAt: currentDate
        })
      };
      
      // Mock repository responses
      mockUserRepo.findById.mockResolvedValue(techLeadUser);
      mockTeamRepo.findById.mockResolvedValue(team);
      mockCategoryRepo.findById.mockResolvedValue(category);
      
      // Mock KudosCard.create
      (KudosCard.create as jest.Mock).mockReturnValue(createdKudosCard);
      
      mockKudosCardRepo.create.mockResolvedValue(createdKudosCard);

      // Act
      const result = await createKudosCardUseCase.execute(kudosCardDto, techLeadId);

      // Assert
      expect(mockUserRepo.findById).toHaveBeenCalledWith(techLeadId);
      expect(result.id).toBe(createdKudosCard.id);
    });

    it('should throw InsufficientPermissionsError when called by regular team member', async () => {
      // Arrange
      const teamMemberId = 'member-123';
      const teamMemberUser = createUser({ 
        id: teamMemberId, 
        firstName: 'Team',
        lastName: 'Member',
        role: 3 // Regular team member role
      });
      
      const kudosCardDto = createKudosCardDTO();
      
      // Mock repository responses
      mockUserRepo.findById.mockResolvedValue(teamMemberUser);

      // Act & Assert
      await expect(createKudosCardUseCase.execute(kudosCardDto, teamMemberId))
        .rejects
        .toThrow(InsufficientPermissionsError);
      
      expect(mockUserRepo.findById).toHaveBeenCalledWith(teamMemberId);
      expect(mockTeamRepo.findById).not.toHaveBeenCalled();
      expect(mockCategoryRepo.findById).not.toHaveBeenCalled();
      expect(KudosCard.create).not.toHaveBeenCalled();
      expect(mockKudosCardRepo.create).not.toHaveBeenCalled();
    });

    it('should throw Error when user does not exist', async () => {
      // Arrange
      const nonExistentUserId = 'non-existent-user';
      const kudosCardDto = createKudosCardDTO();
      
      // Mock repository responses
      mockUserRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(createKudosCardUseCase.execute(kudosCardDto, nonExistentUserId))
        .rejects
        .toThrow('User not found');
      
      expect(mockUserRepo.findById).toHaveBeenCalledWith(nonExistentUserId);
      expect(mockTeamRepo.findById).not.toHaveBeenCalled();
      expect(mockCategoryRepo.findById).not.toHaveBeenCalled();
    });

    it('should throw TeamNotFoundError when team does not exist', async () => {
      // Arrange
      const adminId = 'admin-123';
      const adminUser = createUser({ 
        id: adminId, 
        role: 1 // Admin role
      });
      
      const nonExistentTeamId = 999;
      
      const kudosCardDto = createKudosCardDTO({
        teamId: nonExistentTeamId
      });
      
      // Mock repository responses
      mockUserRepo.findById.mockResolvedValue(adminUser);
      mockTeamRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(createKudosCardUseCase.execute(kudosCardDto, adminId))
        .rejects
        .toThrow(TeamNotFoundError);
      
      expect(mockUserRepo.findById).toHaveBeenCalledWith(adminId);
      expect(mockTeamRepo.findById).toHaveBeenCalledWith(nonExistentTeamId);
      expect(mockCategoryRepo.findById).not.toHaveBeenCalled();
      expect(KudosCard.create).not.toHaveBeenCalled();
      expect(mockKudosCardRepo.create).not.toHaveBeenCalled();
    });

    it('should throw CategoryNotFoundError when category does not exist', async () => {
      // Arrange
      const adminId = 'admin-123';
      const adminUser = createUser({ 
        id: adminId, 
        role: 1 // Admin role
      });
      
      const teamId = 1;
      const team = createTeam({ id: teamId });
      
      const nonExistentCategoryId = 999;
      
      const kudosCardDto = createKudosCardDTO({
        teamId,
        categoryId: nonExistentCategoryId
      });
      
      // Mock repository responses
      mockUserRepo.findById.mockResolvedValue(adminUser);
      mockTeamRepo.findById.mockResolvedValue(team);
      mockCategoryRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(createKudosCardUseCase.execute(kudosCardDto, adminId))
        .rejects
        .toThrow(CategoryNotFoundError);
      
      expect(mockUserRepo.findById).toHaveBeenCalledWith(adminId);
      expect(mockTeamRepo.findById).toHaveBeenCalledWith(teamId);
      expect(mockCategoryRepo.findById).toHaveBeenCalledWith(nonExistentCategoryId);
      expect(KudosCard.create).not.toHaveBeenCalled();
      expect(mockKudosCardRepo.create).not.toHaveBeenCalled();
    });

    it('should throw KudosCardValidationError when kudos card data is invalid', async () => {
      // Arrange
      const adminId = 'admin-123';
      const adminUser = createUser({ 
        id: adminId, 
        role: 1 // Admin role
      });
      
      const teamId = 1;
      const team = createTeam({ id: teamId });
      
      const categoryId = 1;
      const category = createCategory({ id: categoryId });
      
      const kudosCardDto = createKudosCardDTO({
        recipientName: '', // Invalid - empty recipient name
        teamId,
        categoryId
      });
      
      // Mock repository responses
      mockUserRepo.findById.mockResolvedValue(adminUser);
      mockTeamRepo.findById.mockResolvedValue(team);
      mockCategoryRepo.findById.mockResolvedValue(category);
      
      // Mock KudosCard.create to throw validation error
      (KudosCard.create as jest.Mock).mockImplementation(() => {
        throw new Error('Recipient name cannot be empty');
      });

      // Act & Assert
      await expect(createKudosCardUseCase.execute(kudosCardDto, adminId))
        .rejects
        .toThrow(KudosCardValidationError);
      
      expect(mockKudosCardRepo.create).not.toHaveBeenCalled();
    });

    it('should handle creating kudos card on behalf of another user (sentBy)', async () => {
      // Arrange
      const adminId = 'admin-123';
      const adminUser = createUser({ 
        id: adminId, 
        firstName: 'Admin',
        lastName: 'User',
        role: 1 // Admin role
      });
      
      const teamMemberId = 'member-123';
      const teamMemberUser = createUser({ 
        id: teamMemberId, 
        firstName: 'Team',
        lastName: 'Member',
        role: 3 // Regular team member
      });
      
      const teamId = 1;
      const team = createTeam({ id: teamId, name: 'Engineering' });
      
      const categoryId = 1;
      const category = createCategory({ id: categoryId, name: 'Innovation' });
      
      // Kudos card sent by admin on behalf of team member
      const kudosCardDto = createKudosCardDTO({
        recipientName: 'Bob Smith',
        teamId,
        categoryId,
        message: 'Great collaboration!',
        sentBy: teamMemberId
      });
      
      const currentDate = new Date();
      const createdKudosCard = {
        id: 'kudos-456',
        recipientName: kudosCardDto.recipientName,
        teamId: kudosCardDto.teamId,
        categoryId: kudosCardDto.categoryId,
        message: kudosCardDto.message,
        createdBy: adminId,
        sentBy: teamMemberId,
        createdAt: currentDate,
        updatedAt: currentDate,
        toObject: () => ({
          id: 'kudos-456',
          recipientName: kudosCardDto.recipientName,
          teamId: kudosCardDto.teamId,
          categoryId: kudosCardDto.categoryId,
          message: kudosCardDto.message,
          createdBy: adminId,
          sentBy: teamMemberId,
          createdAt: currentDate,
          updatedAt: currentDate
        })
      };
      
      // Mock repository responses
      mockUserRepo.findById.mockImplementation((id: string) => {
        if (id === adminId) return adminUser;
        if (id === teamMemberId) return teamMemberUser;
        return null;
      });
      
      mockTeamRepo.findById.mockResolvedValue(team);
      mockCategoryRepo.findById.mockResolvedValue(category);
      
      // Mock KudosCard.create
      (KudosCard.create as jest.Mock).mockReturnValue(createdKudosCard);
      
      mockKudosCardRepo.create.mockResolvedValue(createdKudosCard);

      // Act
      const result = await createKudosCardUseCase.execute(kudosCardDto, adminId);

      // Assert
      expect(mockUserRepo.findById).toHaveBeenCalledWith(adminId);
      expect(mockUserRepo.findById).toHaveBeenCalledWith(teamMemberId);
      expect(result.id).toBe(createdKudosCard.id);
      expect(result.senderName).toBe('Team Member'); // Should have the name of the team member
    });
  });
}); 