import { ApprovalStatus } from '../../../../auth/domain/entities/UserTypes';

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: number;
  jobTitle: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
}

export interface GetPendingUsersResponseDto {
  users: UserDto[];
  total: number;
} 