import { UserRepo } from '../../../domain/repositories/UserRepo';
import { UserNotFoundError, UnauthorizedActionError, InvalidUserDataError } from '../../../domain/exceptions/AuthExceptions';
import { UpdateUserRequestDto } from './UpdateUserRequestDto';
import { UpdateUserResponseDto } from './UpdateUserResponseDto';
import { User } from '../../../domain/entities/User';
import { ApprovalStatus } from '../../../domain/entities/UserTypes';

export class UpdateUserUseCase {
  constructor(private userRepo: UserRepo) {}

  async execute(dto: UpdateUserRequestDto, currentUserId: string, currentUserRole: number): Promise<UpdateUserResponseDto> {
    // Check if currentUser is admin (role = 1) or is trying to update their own account
    const isAdmin = currentUserRole === 1;
    const isLead = currentUserRole === 2;
    const isSelfUpdate = currentUserId === dto.userId;
    
    if (!isAdmin && !isSelfUpdate) {
      throw new UnauthorizedActionError('Only admin users can update other users');
    }
    
    // If user is not admin and trying to change role, deny the action
    if (!isAdmin && dto.role !== undefined) {
      throw new UnauthorizedActionError('Only admin users can change user roles');
    }
    
    // If trying to update approval status, check if user is admin or lead
    if (dto.approvalStatus !== undefined) {
      // Only admins and leads can update approval status
      if (!isAdmin && !isLead) {
        throw new UnauthorizedActionError('Only admins and leads can update user approval status');
      }
      
      // Prevent users from updating their own approval status
      if (isSelfUpdate) {
        throw new UnauthorizedActionError('You cannot update your own approval status');
      }
      
      // Validate that it's a valid approval status value
      if (!Object.values(ApprovalStatus).includes(dto.approvalStatus)) {
        throw new InvalidUserDataError(`Invalid approval status. Must be one of: ${Object.values(ApprovalStatus).join(', ')}`);
      }
    }
    
    // Find user to update
    const existingUser = await this.userRepo.findById(dto.userId);
    if (!existingUser) {
      throw new UserNotFoundError(dto.userId);
    }
    
    // Create a new user object with updated values
    // We're using the fromData and toJSON methods to ensure we have a fresh user object
    const userData = existingUser.toJSON();
    
    // Apply updates
    const updates = {
      email: dto.email !== undefined ? dto.email : userData.email,
      firstName: dto.firstName !== undefined ? dto.firstName : userData.firstName,
      lastName: dto.lastName !== undefined ? dto.lastName : userData.lastName,
      jobTitle: dto.jobTitle !== undefined ? dto.jobTitle : userData.jobTitle,
      role: dto.role !== undefined ? dto.role : userData.role,
      approvalStatus: dto.approvalStatus !== undefined ? dto.approvalStatus : userData.approvalStatus
    };
    
    // Create the updated user
    // Note: We're not changing the password here, that should be a separate use case
    const userProps = {
      id: existingUser.id,
      email: updates.email,
      password: existingUser.password,
      firstName: updates.firstName,
      lastName: updates.lastName,
      role: updates.role,
      jobTitle: updates.jobTitle,
      approvalStatus: updates.approvalStatus,
      createdAt: existingUser.createdAt,
      updatedAt: new Date()
    };
    
    // Create a new User entity with the updated values
    const userToUpdate = User.fromData({
      id: userProps.id,
      email: userProps.email,
      password: userProps.password.value,
      first_name: userProps.firstName,
      last_name: userProps.lastName,
      role: userProps.role,
      job_title: userProps.jobTitle,
      approval_status: userProps.approvalStatus,
      created_at: userProps.createdAt,
      updated_at: userProps.updatedAt
    });
    
    // Update the user in the database
    const updatedUser = await this.userRepo.update(userToUpdate);
    
    // Return user info
    return {
      id: updatedUser.id,
      email: updatedUser.email.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
      jobTitle: updatedUser.jobTitle,
      approvalStatus: updatedUser.approvalStatus,
      updatedAt: updatedUser.updatedAt.toISOString()
    };
  }
} 