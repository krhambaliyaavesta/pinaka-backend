import { KudosCard } from "../../domain/entities/KudosCard";
import {
  KudosCardRepo,
  KudosCardFilters,
} from "../../domain/repositories/KudosCardRepo";
import { PostgresService } from "../../../../shared/services/PostgresService";
import { KudosCardNotFoundError } from "../../domain/exceptions/KudosCardExceptions";

/**
 * PostgreSQL implementation of the KudosCardRepo interface
 */
export class KudosCardRepoPgImpl implements KudosCardRepo {
  constructor(private db: PostgresService) {}

  async findAll(filters?: KudosCardFilters): Promise<KudosCard[]> {
    try {
      let query = `
        SELECT * FROM kudos_cards 
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 0;

      // By default, don't include soft-deleted items unless specifically requested
      if (!filters?.includeDeleted) {
        query += ` AND deleted_at IS NULL`;
      }

      if (filters?.recipientName) {
        paramIndex++;
        query += ` AND recipient_name ILIKE $${paramIndex}`;
        params.push(`%${filters.recipientName}%`);
      }

      if (filters?.teamId) {
        paramIndex++;
        query += ` AND team_id = $${paramIndex}`;
        params.push(filters.teamId);
      }

      if (filters?.categoryId) {
        paramIndex++;
        query += ` AND category_id = $${paramIndex}`;
        params.push(filters.categoryId);
      }

      if (filters?.createdBy) {
        paramIndex++;
        query += ` AND created_by = $${paramIndex}`;
        params.push(filters.createdBy);
      }

      if (filters?.sentBy) {
        paramIndex++;
        query += ` AND sent_by = $${paramIndex}`;
        params.push(filters.sentBy);
      }

      if (filters?.startDate) {
        paramIndex++;
        query += ` AND created_at >= $${paramIndex}`;
        params.push(filters.startDate);
      }

      if (filters?.endDate) {
        paramIndex++;
        query += ` AND created_at <= $${paramIndex}`;
        params.push(filters.endDate);
      }

      query += ` ORDER BY created_at DESC`;

      const [rows] = await this.db.query(query, params);
      return rows.map(this.mapToKudosCard);
    } catch (error) {
      console.error("Error in KudosCardRepoPgImpl.findAll:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<KudosCard | null> {
    try {
      const [rows] = await this.db.query(
        "SELECT * FROM kudos_cards WHERE id = $1",
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.mapToKudosCard(rows[0]);
    } catch (error) {
      console.error(`Error in KudosCardRepoPgImpl.findById(${id}):`, error);
      throw error;
    }
  }

  async create(
    kudosCard: Omit<KudosCard, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ): Promise<KudosCard> {
    try {
      const now = new Date();
      const [result] = await this.db.query(
        `INSERT INTO kudos_cards 
         (recipient_name, team_id, category_id, message, created_by, sent_by, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [
          kudosCard.recipientName,
          kudosCard.teamId,
          kudosCard.categoryId,
          kudosCard.message,
          kudosCard.createdBy,
          kudosCard.sentBy || kudosCard.createdBy,
          now,
          now,
        ]
      );

      return this.mapToKudosCard(result[0]);
    } catch (error) {
      console.error("Error in KudosCardRepoPgImpl.create:", error);
      throw error;
    }
  }

  async update(
    id: string,
    kudosCardData: Partial<KudosCard>
  ): Promise<KudosCard | null> {
    try {
      // First check if kudos card exists
      const kudosCard = await this.findById(id);
      if (!kudosCard) {
        return null;
      }

      // Build the update query dynamically based on what fields are being updated
      let query = "UPDATE kudos_cards SET updated_at = $1";
      const params: any[] = [new Date()];
      let paramIndex = 1;

      if (kudosCardData.recipientName !== undefined) {
        paramIndex++;
        query += `, recipient_name = $${paramIndex}`;
        params.push(kudosCardData.recipientName);
      }

      if (kudosCardData.teamId !== undefined) {
        paramIndex++;
        query += `, team_id = $${paramIndex}`;
        params.push(kudosCardData.teamId);
      }

      if (kudosCardData.categoryId !== undefined) {
        paramIndex++;
        query += `, category_id = $${paramIndex}`;
        params.push(kudosCardData.categoryId);
      }

      if (kudosCardData.message !== undefined) {
        paramIndex++;
        query += `, message = $${paramIndex}`;
        params.push(kudosCardData.message);
      }

      paramIndex++;
      query += ` WHERE id = $${paramIndex} RETURNING *`;
      params.push(id);

      const [result] = await this.db.query(query, params);
      return this.mapToKudosCard(result[0]);
    } catch (error) {
      console.error(`Error in KudosCardRepoPgImpl.update(${id}):`, error);
      throw error;
    }
  }

  async softDelete(id: string): Promise<boolean> {
    try {
      // First check if kudos card exists and isn't already deleted
      const kudosCard = await this.findById(id);
      if (!kudosCard || kudosCard.isDeleted) {
        return false;
      }

      const now = new Date();
      const [result] = await this.db.query(
        "UPDATE kudos_cards SET deleted_at = $1, updated_at = $2 WHERE id = $3 RETURNING id",
        [now, now, id]
      );

      return result && result.length > 0;
    } catch (error) {
      console.error(`Error in KudosCardRepoPgImpl.softDelete(${id}):`, error);
      throw error;
    }
  }

  async restore(id: string): Promise<boolean> {
    try {
      // First check if kudos card exists
      const [rows] = await this.db.query(
        "SELECT * FROM kudos_cards WHERE id = $1",
        [id]
      );

      if (rows.length === 0) {
        return false;
      }

      const now = new Date();
      const [result] = await this.db.query(
        "UPDATE kudos_cards SET deleted_at = NULL, updated_at = $1 WHERE id = $2 RETURNING id",
        [now, id]
      );

      return result && result.length > 0;
    } catch (error) {
      console.error(`Error in KudosCardRepoPgImpl.restore(${id}):`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [result] = await this.db.query(
        "DELETE FROM kudos_cards WHERE id = $1 RETURNING id",
        [id]
      );

      return result && result.length > 0;
    } catch (error) {
      console.error(`Error in KudosCardRepoPgImpl.delete(${id}):`, error);
      throw error;
    }
  }

  async getTopRecipients(
    limit: number,
    period?: string
  ): Promise<{ recipientName: string; count: number }[]> {
    try {
      let query = `
        SELECT recipient_name, COUNT(*) as count
        FROM kudos_cards
        WHERE deleted_at IS NULL
      `;

      const params: any[] = [];
      let paramIndex = 0;

      // Add time period filtering if provided
      if (period) {
        paramIndex++;
        query += ` AND created_at >= $${paramIndex}`;

        const startDate = this.getStartDateForPeriod(period);
        params.push(startDate);
      }

      query += `
        GROUP BY recipient_name
        ORDER BY count DESC
        LIMIT $${paramIndex + 1}
      `;

      params.push(limit);

      const [rows] = await this.db.query(query, params);

      return rows.map((row: any) => ({
        recipientName: row.recipient_name,
        count: parseInt(row.count, 10),
      }));
    } catch (error) {
      console.error(`Error in KudosCardRepoPgImpl.getTopRecipients:`, error);
      throw error;
    }
  }

  async getTopTeams(
    limit: number,
    period?: string
  ): Promise<{ teamId: number; teamName: string; count: number }[]> {
    try {
      let query = `
        SELECT kc.team_id, t.name as team_name, COUNT(*) as count
        FROM kudos_cards kc
        JOIN teams t ON t.id = kc.team_id
        WHERE kc.deleted_at IS NULL
      `;

      const params: any[] = [];
      let paramIndex = 0;

      // Add time period filtering if provided
      if (period) {
        paramIndex++;
        query += ` AND kc.created_at >= $${paramIndex}`;

        const startDate = this.getStartDateForPeriod(period);
        params.push(startDate);
      }

      query += `
        GROUP BY kc.team_id, t.name
        ORDER BY count DESC
        LIMIT $${paramIndex + 1}
      `;

      params.push(limit);

      const [rows] = await this.db.query(query, params);

      return rows.map((row: any) => ({
        teamId: row.team_id,
        teamName: row.team_name,
        count: parseInt(row.count, 10),
      }));
    } catch (error) {
      console.error(`Error in KudosCardRepoPgImpl.getTopTeams:`, error);
      throw error;
    }
  }

  async getTrendingCategories(
    limit: number,
    period?: string
  ): Promise<{ categoryId: number; categoryName: string; count: number }[]> {
    try {
      let query = `
        SELECT kc.category_id, c.name as category_name, COUNT(*) as count
        FROM kudos_cards kc
        JOIN categories c ON c.id = kc.category_id
        WHERE kc.deleted_at IS NULL
      `;

      const params: any[] = [];
      let paramIndex = 0;

      // Add time period filtering if provided
      if (period) {
        paramIndex++;
        query += ` AND kc.created_at >= $${paramIndex}`;

        const startDate = this.getStartDateForPeriod(period);
        params.push(startDate);
      }

      query += `
        GROUP BY kc.category_id, c.name
        ORDER BY count DESC
        LIMIT $${paramIndex + 1}
      `;

      params.push(limit);

      const [rows] = await this.db.query(query, params);

      return rows.map((row: any) => ({
        categoryId: row.category_id,
        categoryName: row.category_name,
        count: parseInt(row.count, 10),
      }));
    } catch (error) {
      console.error(
        `Error in KudosCardRepoPgImpl.getTrendingCategories:`,
        error
      );
      throw error;
    }
  }

  async getTrendingKeywords(
    limit: number,
    period?: string
  ): Promise<{ keyword: string; count: number }[]> {
    try {
      // This is a simplified implementation without full text search
      // In a real-world application, you might want to use a proper text search index

      let query = `
        SELECT word, COUNT(*) as count
        FROM (
          SELECT regexp_split_to_table(lower(message), '\\s+') as word
          FROM kudos_cards
          WHERE deleted_at IS NULL
      `;

      const params: any[] = [];
      let paramIndex = 0;

      // Add time period filtering if provided
      if (period) {
        paramIndex++;
        query += ` AND created_at >= $${paramIndex}`;

        const startDate = this.getStartDateForPeriod(period);
        params.push(startDate);
      }

      query += `
        ) words
        WHERE length(word) > 3
        AND word NOT IN ('this', 'that', 'with', 'from', 'have', 'were', 'they', 'their', 'your', 'thank', 'thanks', 'for', 'and', 'the', 'are', 'was')
        GROUP BY word
        ORDER BY count DESC
        LIMIT $${paramIndex + 1}
      `;

      params.push(limit);

      const [rows] = await this.db.query(query, params);

      return rows.map((row: any) => ({
        keyword: row.word,
        count: parseInt(row.count, 10),
      }));
    } catch (error) {
      console.error(`Error in KudosCardRepoPgImpl.getTrendingKeywords:`, error);
      throw error;
    }
  }

  /**
   * Maps a database row to a KudosCard entity
   */
  private mapToKudosCard(row: any): KudosCard {
    return KudosCard.create({
      id: row.id,
      recipientName: row.recipient_name,
      teamId: row.team_id,
      categoryId: row.category_id,
      message: row.message,
      createdBy: row.created_by,
      sentBy: row.sent_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    });
  }

  /**
   * Helper method to calculate start date based on period string
   */
  private getStartDateForPeriod(period: string): Date {
    const now = new Date();
    const startDate = new Date(now);

    switch (period.toLowerCase()) {
      case "daily":
        startDate.setDate(now.getDate() - 1);
        break;
      case "weekly":
        startDate.setDate(now.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "quarterly":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "yearly":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30); // Default to last 30 days
    }

    return startDate;
  }
}
