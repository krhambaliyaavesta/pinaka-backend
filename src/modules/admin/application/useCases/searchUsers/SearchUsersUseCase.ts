import {
  AdminUserRepo,
  UserSearchFilters,
} from "../../../domain/repositories/AdminUserRepo";
import { SearchUsersRequestDto } from "./SearchUsersRequestDto";
import { SearchUsersResponseDto, UserDto } from "./SearchUsersResponseDto";
import { UnauthorizedRoleError } from "../../../domain/exceptions/AdminExceptions";

export class SearchUsersUseCase {
  constructor(private adminUserRepo: AdminUserRepo) {}

  async execute(
    dto: SearchUsersRequestDto,
    currentUserRole: number
  ): Promise<SearchUsersResponseDto> {
    // Check if user is admin (role = 1) or lead (role = 2)
    const isAdmin = currentUserRole === 1;
    const isLead = currentUserRole === 2;

    if (!isAdmin && !isLead) {
      throw new UnauthorizedRoleError("Only admins and leads can search users");
    }

    // Map request DTO to domain filter
    const filters: UserSearchFilters = {
      query: dto.query,
      role: dto.role,
      approvalStatus: dto.approvalStatus,
      limit: dto.limit ?? 10,
      offset: dto.offset ?? 0,
    };

    // Get filtered users
    const users = await this.adminUserRepo.searchUsers(filters);

    // Count total matching users (for pagination)
    const total = await this.adminUserRepo.countUsers(filters);

    // Map domain entities to DTOs
    const userDtos: UserDto[] = users.map((user) => ({
      id: user.id,
      email: user.email.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      jobTitle: user.jobTitle,
      approvalStatus: user.approvalStatus,
      createdAt: user.createdAt.toISOString(),
    }));

    return {
      users: userDtos,
      total,
    };
  }
}
