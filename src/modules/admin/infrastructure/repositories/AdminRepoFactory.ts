import { PostgresService } from '../../../../shared/services/PostgresService';
import { AdminUserRepo } from '../../domain/repositories/AdminUserRepo';
import { AdminUserRepoPgImpl } from './AdminUserRepoPgImpl';

export class AdminRepoFactory {
  static getUserRepo(dbService: PostgresService): AdminUserRepo {
    return new AdminUserRepoPgImpl(dbService);
  }
} 