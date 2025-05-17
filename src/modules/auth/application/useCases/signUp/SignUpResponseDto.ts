import { ApprovalStatus } from '../../../domain/entities/UserTypes';

export interface SignUpResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: number;
  jobTitle: string;
  approvalStatus: ApprovalStatus;
} 