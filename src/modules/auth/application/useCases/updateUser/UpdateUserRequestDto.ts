import { ApprovalStatus } from '../../../domain/entities/UserTypes';

export interface UpdateUserRequestDto {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  role?: number;
  approvalStatus?: ApprovalStatus;
} 