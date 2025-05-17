import { ApprovalStatus } from '../../../domain/entities/UserTypes';

export interface SignInResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: number;
    jobTitle: string;
    approvalStatus: ApprovalStatus;
  };
} 