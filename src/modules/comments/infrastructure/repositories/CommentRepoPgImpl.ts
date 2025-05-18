import { v4 as uuidv4 } from "uuid";
import { Comment } from "../../domain/entities/Comment";
import { CommentRepo } from "../../domain/repositories/CommentRepo";
import { PostgresService } from "../../../../shared/services/PostgresService";

export class CommentRepoPgImpl implements CommentRepo {
  constructor(private db: PostgresService) {}

  async add(
    comment: Omit<Comment, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ): Promise<Comment> {
    try {
      const id = uuidv4();
      const now = new Date();

      const [results] = await this.db.query(
        `INSERT INTO comments (id, kudos_card_id, user_id, content, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [id, comment.kudosCardId, comment.userId, comment.content, now, now]
      );

      const result = results[0];

      return Comment.create({
        id: result.id,
        kudosCardId: result.kudos_card_id,
        userId: result.user_id,
        content: result.content,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        deletedAt: result.deleted_at,
      });
    } catch (error) {
      console.error("Error in CommentRepoPgImpl.add:", error);
      throw error;
    }
  }

  async update(id: string, content: string): Promise<Comment | null> {
    try {
      const now = new Date();

      const [results] = await this.db.query(
        `UPDATE comments
         SET content = $1, updated_at = $2
         WHERE id = $3 AND deleted_at IS NULL
         RETURNING *`,
        [content, now, id]
      );

      if (results.length === 0) {
        return null;
      }

      const result = results[0];

      return Comment.create({
        id: result.id,
        kudosCardId: result.kudos_card_id,
        userId: result.user_id,
        content: result.content,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        deletedAt: result.deleted_at,
      });
    } catch (error) {
      console.error("Error in CommentRepoPgImpl.update:", error);
      throw error;
    }
  }

  async softDelete(id: string): Promise<boolean> {
    try {
      const now = new Date();

      const [results] = await this.db.query(
        `UPDATE comments
         SET deleted_at = $1
         WHERE id = $2 AND deleted_at IS NULL
         RETURNING id`,
        [now, id]
      );

      return results.length > 0;
    } catch (error) {
      console.error("Error in CommentRepoPgImpl.softDelete:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Comment | null> {
    try {
      const [results] = await this.db.query(
        `SELECT * FROM comments
         WHERE id = $1`,
        [id]
      );

      if (results.length === 0) {
        return null;
      }

      const result = results[0];

      return Comment.create({
        id: result.id,
        kudosCardId: result.kudos_card_id,
        userId: result.user_id,
        content: result.content,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        deletedAt: result.deleted_at,
      });
    } catch (error) {
      console.error("Error in CommentRepoPgImpl.findById:", error);
      throw error;
    }
  }

  async findByKudosCardId(
    kudosCardId: string,
    includeDeleted: boolean = false
  ): Promise<Comment[]> {
    try {
      let query = `
        SELECT * FROM comments
        WHERE kudos_card_id = $1
      `;

      if (!includeDeleted) {
        query += ` AND deleted_at IS NULL`;
      }

      query += ` ORDER BY created_at ASC`;

      const [results] = await this.db.query(query, [kudosCardId]);

      return results.map((result) =>
        Comment.create({
          id: result.id,
          kudosCardId: result.kudos_card_id,
          userId: result.user_id,
          content: result.content,
          createdAt: result.created_at,
          updatedAt: result.updated_at,
          deletedAt: result.deleted_at,
        })
      );
    } catch (error) {
      console.error("Error in CommentRepoPgImpl.findByKudosCardId:", error);
      throw error;
    }
  }

  async getCommentCountByKudosCardId(kudosCardId: string): Promise<number> {
    try {
      const [results] = await this.db.query(
        `SELECT COUNT(*) as count
         FROM comments
         WHERE kudos_card_id = $1 AND deleted_at IS NULL`,
        [kudosCardId]
      );

      return parseInt(results[0].count, 10);
    } catch (error) {
      console.error(
        "Error in CommentRepoPgImpl.getCommentCountByKudosCardId:",
        error
      );
      throw error;
    }
  }
}
