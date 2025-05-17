import { AdminUserRepo } from '../../../domain/repositories/AdminUserRepo';
import { GetPendingUsersUseCase } from './GetPendingUsersUseCase';

export class GetPendingUsersFactory {
  static create(adminUserRepo: AdminUserRepo): GetPendingUsersUseCase {
    return new GetPendingUsersUseCase(adminUserRepo);
  }
} 