import { User } from "../../../auth/domain/entities/User";
import {
  UserData,
  ApprovalStatus,
} from "../../../auth/domain/entities/UserTypes";
import {
  AdminUserRepo,
  UserSearchFilters,
} from "../../domain/repositories/AdminUserRepo";
import { PostgresService } from "../../../../shared/services/PostgresService";

export class AdminUserRepoPgImpl implements AdminUserRepo {
  constructor(private db: PostgresService) {}

  async findPendingUsers(
    limit: number = 10,
    offset: number = 0
  ): Promise<User[]> {
    try {
      const [rows] = await this.db.query(
        "SELECT * FROM users WHERE approval_status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
        [ApprovalStatus.PENDING, limit, offset]
      );

      return rows.map((row: any) => this.mapToUser(row));
    } catch (error) {
      console.error("Error in findPendingUsers:", error);
      throw error;
    }
  }

  async countPendingUsers(): Promise<number> {
    try {
      const [result] = await this.db.query(
        "SELECT COUNT(*) as count FROM users WHERE approval_status = $1",
        [ApprovalStatus.PENDING]
      );

      return parseInt(result[0].count, 10);
    } catch (error) {
      console.error("Error in countPendingUsers:", error);
      throw error;
    }
  }

  async searchUsers(filters?: UserSearchFilters): Promise<User[]> {
    try {
      let query = `SELECT * FROM users WHERE 1=1`;
      const params: any[] = [];
      let paramIndex = 0;

      // Apply filters if provided
      if (filters) {
        // Search by query (in firstName, lastName, email)
        if (filters.query) {
          paramIndex++;
          query += ` AND (
            first_name ILIKE $${paramIndex} OR 
            last_name ILIKE $${paramIndex} OR 
            email ILIKE $${paramIndex}
          )`;
          params.push(`%${filters.query}%`);
        }

        // Filter by role
        if (filters.role !== undefined) {
          paramIndex++;
          query += ` AND role = $${paramIndex}`;
          params.push(filters.role);
        }

        // Filter by approval status
        if (filters.approvalStatus !== undefined) {
          paramIndex++;
          query += ` AND approval_status = $${paramIndex}`;
          params.push(filters.approvalStatus);
        }
      }

      // Add order by and pagination
      query += ` ORDER BY created_at DESC`;

      if (filters?.limit) {
        paramIndex++;
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
      }

      if (filters?.offset) {
        paramIndex++;
        query += ` OFFSET $${paramIndex}`;
        params.push(filters.offset);
      }

      const [rows] = await this.db.query(query, params);
      return rows.map((row: any) => this.mapToUser(row));
    } catch (error) {
      console.error("Error in searchUsers:", error);
      throw error;
    }
  }

  async countUsers(filters?: UserSearchFilters): Promise<number> {
    try {
      let query = `SELECT COUNT(*) as count FROM users WHERE 1=1`;
      const params: any[] = [];
      let paramIndex = 0;

      // Apply filters if provided
      if (filters) {
        // Search by query (in firstName, lastName, email)
        if (filters.query) {
          paramIndex++;
          query += ` AND (
            first_name ILIKE $${paramIndex} OR 
            last_name ILIKE $${paramIndex} OR 
            email ILIKE $${paramIndex}
          )`;
          params.push(`%${filters.query}%`);
        }

        // Filter by role
        if (filters.role !== undefined) {
          paramIndex++;
          query += ` AND role = $${paramIndex}`;
          params.push(filters.role);
        }

        // Filter by approval status
        if (filters.approvalStatus !== undefined) {
          paramIndex++;
          query += ` AND approval_status = $${paramIndex}`;
          params.push(filters.approvalStatus);
        }
      }

      const [result] = await this.db.query(query, params);
      return parseInt(result[0].count, 10);
    } catch (error) {
      console.error("Error in countUsers:", error);
      throw error;
    }
  }

  private mapToUser(row: any): User {
    const userData: UserData = {
      id: row.id,
      email: row.email,
      password: row.password,
      first_name: row.first_name,
      last_name: row.last_name,
      role: row.role,
      job_title: row.job_title,
      approval_status: row.approval_status as ApprovalStatus,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    return User.fromData(userData);
  }
}
