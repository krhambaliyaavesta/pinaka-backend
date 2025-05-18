import { ApprovalStatus } from "../../../../auth/domain/entities/UserTypes";

export interface SearchUsersRequestDto {
  query?: string; // Search term for user names or email
  role?: number; // Filter by role
  approvalStatus?: ApprovalStatus; // Filter by approval status
  limit?: number; // Pagination limit
  offset?: number; // Pagination offset
}
