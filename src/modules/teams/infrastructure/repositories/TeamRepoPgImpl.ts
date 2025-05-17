import { PostgresService } from "../../../../shared/services/PostgresService";
import { TeamRepo } from "../../domain/repositories/TeamRepo";
import { Team } from "../../domain/entities/Team";

/**
 * PostgreSQL implementation of TeamRepo
 */
export class TeamRepoPgImpl implements TeamRepo {
  constructor(private dbService: PostgresService) {}

  /**
   * Find all teams
   * @returns Promise resolving to array of Teams
   */
  async findAll(): Promise<Team[]> {
    const query = `
      SELECT * FROM teams
      ORDER BY name ASC
    `;
    const [rows] = await this.dbService.query(query);
    return rows.map(this.mapToTeam);
  }

  /**
   * Find a team by its ID
   * @param id The team ID
   * @returns Promise resolving to Team or null if not found
   */
  async findById(id: number): Promise<Team | null> {
    const query = `
      SELECT * FROM teams
      WHERE id = $1
    `;
    const [rows] = await this.dbService.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    return this.mapToTeam(rows[0]);
  }

  /**
   * Create a new team
   * @param team The team entity to create
   * @returns Promise resolving to the created Team
   */
  async create(team: Team): Promise<Team> {
    const query = `
      INSERT INTO teams (name, created_at, updated_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const [rows] = await this.dbService.query(query, [
      team.name,
      team.createdAt,
      team.updatedAt,
    ]);
    return this.mapToTeam(rows[0]);
  }

  /**
   * Update an existing team
   * @param team The team entity with updated values
   * @returns Promise resolving to the updated Team
   */
  async update(team: Team): Promise<Team> {
    const query = `
      UPDATE teams
      SET name = $1, updated_at = $2
      WHERE id = $3
      RETURNING *
    `;
    const [rows] = await this.dbService.query(query, [
      team.name,
      team.updatedAt,
      team.id,
    ]);
    if (rows.length === 0) {
      throw new Error(`Team with ID ${team.id} not found`);
    }
    return this.mapToTeam(rows[0]);
  }

  /**
   * Delete a team by ID
   * @param id The team ID to delete
   * @returns Promise resolving to true if successful, false otherwise
   */
  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM teams
      WHERE id = $1
      RETURNING id
    `;
    const [rows] = await this.dbService.query(query, [id]);
    return rows.length > 0;
  }

  /**
   * Map database row to Team entity
   * @param row Database row
   * @returns Team entity
   */
  private mapToTeam(row: any): Team {
    return Team.create({
      id: row.id,
      name: row.name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
} 