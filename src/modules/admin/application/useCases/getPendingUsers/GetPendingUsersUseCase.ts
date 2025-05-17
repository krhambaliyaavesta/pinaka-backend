import { AdminUserRepo } from '../../../domain/repositories/AdminUserRepo';
import { GetPendingUsersRequestDto } from './GetPendingUsersRequestDto';
import { GetPendingUsersResponseDto, UserDto } from './GetPendingUsersResponseDto';
import { UnauthorizedRoleError } from '../../../domain/exceptions/AdminExceptions';

export class GetPendingUsersUseCase {
  constructor(private adminUserRepo: AdminUserRepo) {}

  async execute(
    dto: GetPendingUsersRequestDto,
    currentUserRole: number
  ): Promise<GetPendingUsersResponseDto> {
    // Check if user is admin (role = 1) or lead (role = 2)
    const isAdmin = currentUserRole === 1;
    const isLead = currentUserRole === 2;
    
    if (!isAdmin && !isLead) {
      throw new UnauthorizedRoleError('admins and leads');
    }

    // Get users with PENDING status
    const pendingUsers = await this.adminUserRepo.findPendingUsers(
      dto.limit, 
      dto.offset
    );
    
    // Count total pending users (for pagination)
    const total = await this.adminUserRepo.countPendingUsers();

    // Map domain entities to DTOs
    const userDtos: UserDto[] = pendingUsers.map(user => ({
      id: user.id,
      email: user.email.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      jobTitle: user.jobTitle,
      approvalStatus: user.approvalStatus,
      createdAt: user.createdAt.toISOString()
    }));

    return {
      users: userDtos,
      total
    };
  }
} 