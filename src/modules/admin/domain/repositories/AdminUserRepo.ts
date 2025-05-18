import { User } from "../../../auth/domain/entities/User";
import { ApprovalStatus } from "../../../auth/domain/entities/UserTypes";

/**
 * Filter options for user search queries
 */
export interface UserSearchFilters {
  query?: string; // Search in email, firstName, lastName
  role?: number; // Filter by specific role
  approvalStatus?: ApprovalStatus;
  limit?: number; // For pagination
  offset?: number; // For pagination
}

export interface AdminUserRepo {
  findPendingUsers(limit?: number, offset?: number): Promise<User[]>;
  countPendingUsers(): Promise<number>;

  // New methods for searching users
  searchUsers(filters?: UserSearchFilters): Promise<User[]>;
  countUsers(filters?: UserSearchFilters): Promise<number>;
}
