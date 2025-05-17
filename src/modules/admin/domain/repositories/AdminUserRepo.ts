import { User } from '../../../auth/domain/entities/User';
import { ApprovalStatus } from '../../../auth/domain/entities/UserTypes';

export interface AdminUserRepo {
  findPendingUsers(limit?: number, offset?: number): Promise<User[]>;
  countPendingUsers(): Promise<number>;
} 