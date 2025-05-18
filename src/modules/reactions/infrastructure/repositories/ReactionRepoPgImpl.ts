import { v4 as uuidv4 } from "uuid";
import { Reaction, ReactionType } from "../../domain/entities/Reaction";
import { ReactionRepo } from "../../domain/repositories/ReactionRepo";
import { PostgresService } from "../../../../shared/services/PostgresService";

export class ReactionRepoPgImpl implements ReactionRepo {
  constructor(private db: PostgresService) {}

  async add(reaction: Omit<Reaction, "id" | "createdAt">): Promise<Reaction> {
    try {
      const id = uuidv4();
      const createdAt = new Date();

      const [results] = await this.db.query(
        `INSERT INTO reactions (id, kudos_card_id, user_id, type, created_at)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [id, reaction.kudosCardId, reaction.userId, reaction.type, createdAt]
      );

      const result = results[0];

      return Reaction.create({
        id: result.id,
        kudosCardId: result.kudos_card_id,
        userId: result.user_id,
        type: result.type as ReactionType,
        createdAt: result.created_at,
      });
    } catch (error) {
      console.error("Error in ReactionRepoPgImpl.add:", error);
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const [results] = await this.db.query(
        `DELETE FROM reactions
         WHERE id = $1
         RETURNING id`,
        [id]
      );

      return results.length > 0;
    } catch (error) {
      console.error("Error in ReactionRepoPgImpl.remove:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Reaction | null> {
    try {
      const [rows] = await this.db.query(
        `SELECT * FROM reactions
         WHERE id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return Reaction.create({
        id: rows[0].id,
        kudosCardId: rows[0].kudos_card_id,
        userId: rows[0].user_id,
        type: rows[0].type as ReactionType,
        createdAt: rows[0].created_at,
      });
    } catch (error) {
      console.error("Error in ReactionRepoPgImpl.findById:", error);
      throw error;
    }
  }

  async findByUserAndType(
    kudosCardId: string,
    userId: string,
    type: ReactionType
  ): Promise<Reaction | null> {
    try {
      const [rows] = await this.db.query(
        `SELECT * FROM reactions
         WHERE kudos_card_id = $1 AND user_id = $2 AND type = $3`,
        [kudosCardId, userId, type]
      );

      if (rows.length === 0) {
        return null;
      }

      return Reaction.create({
        id: rows[0].id,
        kudosCardId: rows[0].kudos_card_id,
        userId: rows[0].user_id,
        type: rows[0].type as ReactionType,
        createdAt: rows[0].created_at,
      });
    } catch (error) {
      console.error("Error in ReactionRepoPgImpl.findByUserAndType:", error);
      throw error;
    }
  }

  async findByKudosCardId(kudosCardId: string): Promise<Reaction[]> {
    try {
      const [rows] = await this.db.query(
        `SELECT * FROM reactions
         WHERE kudos_card_id = $1
         ORDER BY created_at DESC`,
        [kudosCardId]
      );

      return rows.map((row) =>
        Reaction.create({
          id: row.id,
          kudosCardId: row.kudos_card_id,
          userId: row.user_id,
          type: row.type as ReactionType,
          createdAt: row.created_at,
        })
      );
    } catch (error) {
      console.error("Error in ReactionRepoPgImpl.findByKudosCardId:", error);
      throw error;
    }
  }

  async getReactionCountsByKudosCardId(
    kudosCardId: string
  ): Promise<{ type: ReactionType; count: number }[]> {
    try {
      const [rows] = await this.db.query(
        `SELECT type, COUNT(*) as count
         FROM reactions
         WHERE kudos_card_id = $1
         GROUP BY type
         ORDER BY count DESC`,
        [kudosCardId]
      );

      return rows.map((row) => ({
        type: row.type as ReactionType,
        count: parseInt(row.count, 10),
      }));
    } catch (error) {
      console.error(
        "Error in ReactionRepoPgImpl.getReactionCountsByKudosCardId:",
        error
      );
      throw error;
    }
  }
}
