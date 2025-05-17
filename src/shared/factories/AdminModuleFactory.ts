import { PostgresService } from '../services/PostgresService';
import { AdminRepoFactory } from '../../modules/admin/infrastructure/repositories/AdminRepoFactory';
import { AdminUserRepo } from '../../modules/admin/domain/repositories/AdminUserRepo';

export class AdminModuleFactory {
  static getUserRepo(): AdminUserRepo {
    const dbService = PostgresService.getInstance();
    return AdminRepoFactory.getUserRepo(dbService);
  }
} 