import { ApprovalStatus } from '../../../../auth/domain/entities/UserTypes';

export interface UpdateUserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: number;
  jobTitle: string;
  approvalStatus: ApprovalStatus;
  updatedAt: string;
} 