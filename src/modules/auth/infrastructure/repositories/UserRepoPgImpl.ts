import { User } from '../../domain/entities/User';
import { UserData } from '../../domain/entities/UserTypes';
import { UserRepo } from '../../domain/repositories/UserRepo';
import { PostgresService } from '../../../../shared/services/PostgresService';

export class UserRepoPgImpl implements UserRepo {
  constructor(private db: PostgresService) {}

  async findById(id: string): Promise<User | null> {
    try {
      const [rows] = await this.db.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.mapToUser(rows[0]);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await this.db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.mapToUser(rows[0]);
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }

  async create(user: User): Promise<User> {
    try {
      const [result] = await this.db.query(
        'INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [
          user.id,
          user.email.toString(),
          user.password.value,
          user.firstName,
          user.lastName,
          user.role,
          user.createdAt,
          user.updatedAt
        ]
      );

      // Return the user as is or the newly created user from the database
      if (result && result.length > 0) {
        return this.mapToUser(result[0]);
      }
      return user;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async update(user: User): Promise<User> {
    try {
      const [result] = await this.db.query(
        'UPDATE users SET email = $1, password = $2, first_name = $3, last_name = $4, role = $5, updated_at = $6 WHERE id = $7 RETURNING *',
        [
          user.email.toString(),
          user.password.value,
          user.firstName,
          user.lastName,
          user.role,
          user.updatedAt,
          user.id
        ]
      );

      // Return the updated user from the database or the passed user
      if (result && result.length > 0) {
        return this.mapToUser(result[0]);
      }
      return user;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [result] = await this.db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
      return result && result.length > 0;
    } catch (error) {
      console.error('Error in delete:', error);
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
      created_at: row.created_at,
      updated_at: row.updated_at
    };
    
    return User.fromData(userData);
  }
} 