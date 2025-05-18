import { GetPendingUsersUseCase } from '../../../../../../../modules/admin/application/useCases/getPendingUsers/GetPendingUsersUseCase';
import { UnauthorizedRoleError } from '../../../../../../../modules/admin/domain/exceptions/AdminExceptions';
import { createUser } from '../../../../../../mocks/testFactories';

/**
 * GetPendingUsersUseCase Unit Tests
 * 
 * These tests verify the business logic of the GetPendingUsersUseCase
 * without relying on external systems or database connections.
 */
describe('GetPendingUsersUseCase', () => {
  let getPendingUsersUseCase: GetPendingUsersUseCase;
  let mockAdminUserRepo: any;

  beforeEach(() => {
    // Arrange (common setup)
    // Create fresh mock repos for each test to ensure isolation
    mockAdminUserRepo = {
      findPendingUsers: jest.fn(),
      countPendingUsers: jest.fn()
    };
    
    // Initialize use case with mock repository
    getPendingUsersUseCase = new GetPendingUsersUseCase(mockAdminUserRepo);
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return pending users when called by admin', async () => {
      // Arrange
      const adminRole = 1; // Admin role
      const mockPendingUsers = [
        createUser({ 
          id: 'user-1', 
          firstName: 'John', 
          lastName: 'Doe', 
          fullName: 'John Doe', 
          approvalStatus: 'PENDING',
          createdAt: new Date()
        }),
        createUser({ 
          id: 'user-2', 
          firstName: 'Jane', 
          lastName: 'Smith', 
          fullName: 'Jane Smith', 
          approvalStatus: 'PENDING',
          createdAt: new Date()
        })
      ];
      const totalCount = 2;
      
      mockAdminUserRepo.findPendingUsers.mockResolvedValue(mockPendingUsers);
      mockAdminUserRepo.countPendingUsers.mockResolvedValue(totalCount);
      
      const requestDto = { limit: 10, offset: 0 };

      // Act
      const result = await getPendingUsersUseCase.execute(requestDto, adminRole);

      // Assert
      expect(mockAdminUserRepo.findPendingUsers).toHaveBeenCalledWith(
        requestDto.limit, 
        requestDto.offset
      );
      expect(mockAdminUserRepo.countPendingUsers).toHaveBeenCalled();
      expect(result).toEqual({
        users: expect.arrayContaining([
          expect.objectContaining({
            id: 'user-1',
            fullName: 'John Doe',
            approvalStatus: 'PENDING'
          }),
          expect.objectContaining({
            id: 'user-2',
            fullName: 'Jane Smith',
            approvalStatus: 'PENDING'
          })
        ]),
        total: totalCount
      });
      expect(result.users.length).toBe(2);
    });

    it('should return pending users when called by lead', async () => {
      // Arrange
      const leadRole = 2; // Lead role
      const mockPendingUsers = [
        createUser({ 
          id: 'user-1', 
          approvalStatus: 'PENDING',
          createdAt: new Date()
        })
      ];
      const totalCount = 1;
      
      mockAdminUserRepo.findPendingUsers.mockResolvedValue(mockPendingUsers);
      mockAdminUserRepo.countPendingUsers.mockResolvedValue(totalCount);
      
      const requestDto = { limit: 10, offset: 0 };

      // Act
      const result = await getPendingUsersUseCase.execute(requestDto, leadRole);

      // Assert
      expect(mockAdminUserRepo.findPendingUsers).toHaveBeenCalledWith(
        requestDto.limit, 
        requestDto.offset
      );
      expect(mockAdminUserRepo.countPendingUsers).toHaveBeenCalled();
      expect(result).toEqual({
        users: expect.arrayContaining([
          expect.objectContaining({
            id: 'user-1',
            approvalStatus: 'PENDING'
          })
        ]),
        total: totalCount
      });
    });

    it('should throw UnauthorizedRoleError when called by regular user', async () => {
      // Arrange
      const regularUserRole = 3; // Regular user role
      const requestDto = { limit: 10, offset: 0 };

      // Act & Assert
      await expect(getPendingUsersUseCase.execute(requestDto, regularUserRole))
        .rejects
        .toThrow(UnauthorizedRoleError);
    });

    it('should return empty array when no pending users exist', async () => {
      // Arrange
      const adminRole = 1;
      mockAdminUserRepo.findPendingUsers.mockResolvedValue([]);
      mockAdminUserRepo.countPendingUsers.mockResolvedValue(0);
      
      const requestDto = { limit: 10, offset: 0 };

      // Act
      const result = await getPendingUsersUseCase.execute(requestDto, adminRole);

      // Assert
      expect(result).toEqual({
        users: [],
        total: 0
      });
    });

    it('should respect pagination parameters', async () => {
      // Arrange
      const adminRole = 1;
      const mockPendingUsers = [
        createUser({ 
          id: 'user-3', 
          approvalStatus: 'PENDING',
          createdAt: new Date()
        })
      ];
      const totalCount = 15; // Total count higher than returned results
      
      mockAdminUserRepo.findPendingUsers.mockResolvedValue(mockPendingUsers);
      mockAdminUserRepo.countPendingUsers.mockResolvedValue(totalCount);
      
      const requestDto = { limit: 5, offset: 10 };

      // Act
      const result = await getPendingUsersUseCase.execute(requestDto, adminRole);

      // Assert
      expect(mockAdminUserRepo.findPendingUsers).toHaveBeenCalledWith(5, 10);
      expect(result).toEqual({
        users: expect.arrayContaining([
          expect.objectContaining({
            id: 'user-3'
          })
        ]),
        total: totalCount
      });
    });
  });
}); 