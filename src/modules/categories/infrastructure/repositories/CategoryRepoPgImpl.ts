import { PostgresService } from "../../../../shared/services/PostgresService";
import { CategoryRepo } from "../../domain/repositories/CategoryRepo";
import { Category } from "../../domain/entities/Category";

/**
 * PostgreSQL implementation of CategoryRepo
 */
export class CategoryRepoPgImpl implements CategoryRepo {
  constructor(private dbService: PostgresService) {}

  /**
   * Find all categories
   * @returns Promise resolving to array of Categories
   */
  async findAll(): Promise<Category[]> {
    const query = `
      SELECT * FROM categories
      ORDER BY name ASC
    `;
    const [rows] = await this.dbService.query(query);
    return rows.map(this.mapToCategory);
  }

  /**
   * Find a category by its ID
   * @param id The category ID
   * @returns Promise resolving to Category or null if not found
   */
  async findById(id: number): Promise<Category | null> {
    const query = `
      SELECT * FROM categories
      WHERE id = $1
    `;
    const [rows] = await this.dbService.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    return this.mapToCategory(rows[0]);
  }

  /**
   * Create a new category
   * @param category The category entity to create
   * @returns Promise resolving to the created Category
   */
  async create(category: Category): Promise<Category> {
    const query = `
      INSERT INTO categories (name, created_at, updated_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const [rows] = await this.dbService.query(query, [
      category.name,
      category.createdAt,
      category.updatedAt,
    ]);
    return this.mapToCategory(rows[0]);
  }

  /**
   * Update an existing category
   * @param category The category entity with updated values
   * @returns Promise resolving to the updated Category
   */
  async update(category: Category): Promise<Category> {
    const query = `
      UPDATE categories
      SET name = $1, updated_at = $2
      WHERE id = $3
      RETURNING *
    `;
    const [rows] = await this.dbService.query(query, [
      category.name,
      category.updatedAt,
      category.id,
    ]);
    if (rows.length === 0) {
      throw new Error(`Category with ID ${category.id} not found`);
    }
    return this.mapToCategory(rows[0]);
  }

  /**
   * Delete a category by ID
   * @param id The category ID to delete
   * @returns Promise resolving to true if successful, false otherwise
   */
  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM categories
      WHERE id = $1
      RETURNING id
    `;
    const [rows] = await this.dbService.query(query, [id]);
    return rows.length > 0;
  }

  /**
   * Map database row to Category entity
   * @param row Database row
   * @returns Category entity
   */
  private mapToCategory(row: any): Category {
    return Category.create({
      id: row.id,
      name: row.name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
} 