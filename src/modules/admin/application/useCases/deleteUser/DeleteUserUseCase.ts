import { UserRepo } from '../../../../auth/domain/repositories/UserRepo';
import { UserNotFoundError, UnauthorizedActionError } from '../../../../auth/domain/exceptions/AuthExceptions';
import { DeleteUserRequestDto } from './DeleteUserRequestDto';
import { DeleteUserResponseDto } from './DeleteUserResponseDto';

export class DeleteUserUseCase {
  constructor(private userRepo: UserRepo) {}

  async execute(dto: DeleteUserRequestDto, currentUserId: string, currentUserRole: number): Promise<DeleteUserResponseDto> {
    // Check if currentUser is admin (role = 1)
    const isAdmin = currentUserRole === 1;
    
    if (!isAdmin) {
      throw new UnauthorizedActionError('Only admin users can delete user accounts');
    }
    
    // Admin should not be able to delete their own account through this endpoint
    if (currentUserId === dto.userId) {
      throw new UnauthorizedActionError('Admin cannot delete their own account');
    }
    
    // Find user to delete
    const existingUser = await this.userRepo.findById(dto.userId);
    if (!existingUser) {
      throw new UserNotFoundError(dto.userId);
    }
    
    // If the user to be deleted is also an admin, prevent deletion
    if (existingUser.role === 1) {
      throw new UnauthorizedActionError('Cannot delete another admin account');
    }
    
    // Delete the user
    const deleted = await this.userRepo.delete(dto.userId);
    
    if (!deleted) {
      throw new Error('Failed to delete user');
    }
    
    // Return success response
    return {
      success: true,
      message: `User with ID ${dto.userId} has been deleted successfully`
    };
  }
} 