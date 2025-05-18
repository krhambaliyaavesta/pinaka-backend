import { UpdateUserUseCase } from '../../../../../../../modules/admin/application/useCases/updateUser/UpdateUserUseCase';
import { UnauthorizedRoleError } from '../../../../../../../modules/admin/domain/exceptions/AdminExceptions';
import { UserNotFoundError } from '../../../../../../../modules/auth/domain/exceptions/AuthExceptions';
import { UnauthorizedActionError } from '../../../../../../../modules/auth/domain/exceptions/AuthExceptions';
import { ApprovalStatus } from '../../../../../../../modules/auth/domain/entities/UserTypes';
import { User } from '../../../../../../../modules/auth/domain/entities/User';

// Mock the User class
jest.mock('../../../../../../../modules/auth/domain/entities/User', () => {
  return {
    User: {
      fromData: jest.fn().mockImplementation((data) => {
        return {
          id: data.id,
          email: { toString: () => data.email },
          password: { value: 'hashed_password' },
          firstName: data.first_name,
          lastName: data.last_name,
          fullName: `${data.first_name} ${data.last_name}`,
          role: data.role,
          jobTitle: data.job_title,
          approvalStatus: data.approval_status,
          createdAt: new Date(),
          updatedAt: new Date(),
          toJSON: jest.fn().mockReturnValue({
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            fullName: `${data.first_name} ${data.last_name}`,
            role: data.role,
            jobTitle: data.job_title,
            approvalStatus: data.approval_status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        };
      })
    }
  };
});

/**
 * UpdateUserUseCase Unit Tests
 * 
 * These tests verify the business logic of the UpdateUserUseCase
 * without relying on external systems or database connections.
 */
describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockAdminUserRepo: any;

  // Helper function to create a mock user
  const createMockUser = (data: any) => {
    return User.fromData({
      id: data.id || 'user-123',
      email: data.email || 'test@example.com',
      password: 'hashed_password',
      first_name: data.firstName || 'Test',
      last_name: data.lastName || 'User',
      role: data.role !== undefined ? data.role : 3,
      job_title: data.jobTitle || 'Software Engineer',
      approval_status: data.approvalStatus || ApprovalStatus.PENDING,
      created_at: new Date(),
      updated_at: new Date()
    });
  };

  beforeEach(() => {
    // Arrange (common setup)
    // Create fresh mock repos for each test to ensure isolation
    mockAdminUserRepo = {
      findById: jest.fn(),
      update: jest.fn()
    };
    
    // Mock the implementation of update to return a mock user
    mockAdminUserRepo.update.mockImplementation((user: any) => {
      return Promise.resolve(user);
    });
    
    // Initialize use case with mock repository
    updateUserUseCase = new UpdateUserUseCase(mockAdminUserRepo);
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update a user when called by admin', async () => {
      // Arrange
      const adminRole = 1; // Admin role
      const adminUserId = 'admin-123'; // Admin user ID
      const userId = 'user-123'; // User being updated ID (different from admin)
      const updateData = {
        role: 3, // TEAM_MEMBER role as number
        approvalStatus: ApprovalStatus.APPROVED
      };
      
      const existingUser = createMockUser({ 
        id: userId, 
        role: 0, // PENDING role as number
        approvalStatus: ApprovalStatus.PENDING 
      });
      
      mockAdminUserRepo.findById.mockResolvedValue(existingUser);

      // Act
      const result = await updateUserUseCase.execute({
        userId,
        role: updateData.role,
        approvalStatus: updateData.approvalStatus
      }, adminUserId, adminRole); // Admin user ID is different from the user being updated

      // Assert
      expect(mockAdminUserRepo.findById).toHaveBeenCalledWith(userId);
      expect(mockAdminUserRepo.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw UnauthorizedActionError when called by regular user', async () => {
      // Arrange
      const regularUserRole = 3; // Regular user role
      const regularUserId = 'regular-123'; // Regular user ID
      const userId = 'user-123'; // User being updated ID
      const updateData = {
        role: 3, // TEAM_MEMBER role as number
        approvalStatus: ApprovalStatus.APPROVED
      };

      // Act & Assert
      await expect(updateUserUseCase.execute({
        userId,
        role: updateData.role,
        approvalStatus: updateData.approvalStatus
      }, regularUserId, regularUserRole))
        .rejects
        .toThrow(UnauthorizedActionError);
      
      expect(mockAdminUserRepo.findById).not.toHaveBeenCalled();
      expect(mockAdminUserRepo.update).not.toHaveBeenCalled();
    });
    
    it('should throw UserNotFoundError when user does not exist', async () => {
      // Arrange
      const adminRole = 1;
      const adminUserId = 'admin-123'; // Admin user ID
      const userId = 'non-existent-user';
      const updateData = {
        role: 3, // TEAM_MEMBER role as number
        approvalStatus: ApprovalStatus.APPROVED
      };
      
      mockAdminUserRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(updateUserUseCase.execute({
        userId,
        role: updateData.role,
        approvalStatus: updateData.approvalStatus
      }, adminUserId, adminRole))
        .rejects
        .toThrow(UserNotFoundError);
      
      expect(mockAdminUserRepo.findById).toHaveBeenCalledWith(userId);
      expect(mockAdminUserRepo.update).not.toHaveBeenCalled();
    });
    
    it('should handle partial updates', async () => {
      // Arrange
      const adminRole = 1;
      const adminUserId = 'admin-123'; // Admin user ID
      const userId = 'user-123'; // User being updated ID
      const updateData = {
        approvalStatus: ApprovalStatus.APPROVED
      };
      
      const existingUser = createMockUser({ 
        id: userId, 
        role: 0, // PENDING role as number
        approvalStatus: ApprovalStatus.PENDING 
      });
      
      mockAdminUserRepo.findById.mockResolvedValue(existingUser);

      // Act
      const result = await updateUserUseCase.execute({
        userId,
        approvalStatus: updateData.approvalStatus
      }, adminUserId, adminRole);

      // Assert
      expect(mockAdminUserRepo.findById).toHaveBeenCalledWith(userId);
      expect(mockAdminUserRepo.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    
    it('should be callable by a tech lead', async () => {
      // Arrange
      const techLeadRole = 2; // Tech Lead role
      const techLeadId = 'lead-123'; // Tech lead ID
      const userId = 'user-456'; // User being updated ID
      const updateData = {
        approvalStatus: ApprovalStatus.REJECTED
      };
      
      const existingUser = createMockUser({ 
        id: userId, 
        role: 0, // PENDING role as number
        approvalStatus: ApprovalStatus.PENDING 
      });
      
      mockAdminUserRepo.findById.mockResolvedValue(existingUser);

      // Act
      const result = await updateUserUseCase.execute({
        userId,
        approvalStatus: updateData.approvalStatus
      }, techLeadId, techLeadRole);

      // Assert
      expect(mockAdminUserRepo.findById).toHaveBeenCalledWith(userId);
      expect(mockAdminUserRepo.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
}); 