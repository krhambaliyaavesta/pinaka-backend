import { Team } from "../../domain/entities/Team";
import { TeamRepository } from "../../domain/repositories/TeamRepository";
import { PostgresService } from "../../../../shared/services/PostgresService";
import { TeamNotFoundError } from "../../domain/exceptions/KudosCardExceptions";

/**
 * PostgreSQL implementation of the TeamRepository interface
 */
export class TeamRepoPgImpl implements TeamRepository {
  constructor(private db: PostgresService) {}

  async findAll(): Promise<Team[]> {
    try {
      const [rows] = await this.db.query(
        "SELECT * FROM teams ORDER BY name ASC"
      );

      return rows.map(this.mapToTeam);
    } catch (error) {
      console.error("Error in TeamRepoPgImpl.findAll:", error);
      throw error;
    }
  }

  async findById(id: number): Promise<Team | null> {
    try {
      const [rows] = await this.db.query("SELECT * FROM teams WHERE id = $1", [
        id,
      ]);

      if (rows.length === 0) {
        return null;
      }

      return this.mapToTeam(rows[0]);
    } catch (error) {
      console.error(`Error in TeamRepoPgImpl.findById(${id}):`, error);
      throw error;
    }
  }

  async create(
    team: Omit<Team, "id" | "createdAt" | "updatedAt">
  ): Promise<Team> {
    try {
      const now = new Date();
      const [result] = await this.db.query(
        "INSERT INTO teams (name, created_at, updated_at) VALUES ($1, $2, $3) RETURNING *",
        [team.name, now, now]
      );

      return this.mapToTeam(result[0]);
    } catch (error) {
      console.error("Error in TeamRepoPgImpl.create:", error);
      throw error;
    }
  }

  async update(id: number, teamData: Partial<Team>): Promise<Team | null> {
    try {
      // First check if team exists
      const team = await this.findById(id);
      if (!team) {
        return null;
      }

      // Update the team
      const [result] = await this.db.query(
        "UPDATE teams SET name = $1, updated_at = $2 WHERE id = $3 RETURNING *",
        [teamData.name || team.name, new Date(), id]
      );

      return this.mapToTeam(result[0]);
    } catch (error) {
      console.error(`Error in TeamRepoPgImpl.update(${id}):`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // Check if team exists
      const team = await this.findById(id);
      if (!team) {
        return false;
      }

      // Check if this team has any kudos cards
      const [kudosCards] = await this.db.query(
        "SELECT COUNT(*) FROM kudos_cards WHERE team_id = $1",
        [id]
      );

      if (kudosCards[0].count > 0) {
        throw new Error(
          `Cannot delete team with ID ${id} because there are kudos cards associated with it`
        );
      }

      const [result] = await this.db.query(
        "DELETE FROM teams WHERE id = $1 RETURNING id",
        [id]
      );

      return result && result.length > 0;
    } catch (error) {
      console.error(`Error in TeamRepoPgImpl.delete(${id}):`, error);
      throw error;
    }
  }

  /**
   * Maps a database row to a Team entity
   */
  private mapToTeam(row: any): Team {
    return Team.create({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
