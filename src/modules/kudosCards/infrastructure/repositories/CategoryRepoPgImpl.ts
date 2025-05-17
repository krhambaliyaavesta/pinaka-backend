import { Category } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";
import { PostgresService } from "../../../../shared/services/PostgresService";
import { CategoryNotFoundError } from "../../domain/exceptions/KudosCardExceptions";

/**
 * PostgreSQL implementation of the CategoryRepository interface
 */
export class CategoryRepoPgImpl implements CategoryRepository {
  constructor(private db: PostgresService) {}

  async findAll(): Promise<Category[]> {
    try {
      const [rows] = await this.db.query(
        "SELECT * FROM categories ORDER BY name ASC"
      );

      return rows.map(this.mapToCategory);
    } catch (error) {
      console.error("Error in CategoryRepoPgImpl.findAll:", error);
      throw error;
    }
  }

  async findById(id: number): Promise<Category | null> {
    try {
      const [rows] = await this.db.query(
        "SELECT * FROM categories WHERE id = $1",
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.mapToCategory(rows[0]);
    } catch (error) {
      console.error(`Error in CategoryRepoPgImpl.findById(${id}):`, error);
      throw error;
    }
  }

  async create(
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    try {
      const now = new Date();
      const [result] = await this.db.query(
        "INSERT INTO categories (name, created_at, updated_at) VALUES ($1, $2, $3) RETURNING *",
        [category.name, now, now]
      );

      return this.mapToCategory(result[0]);
    } catch (error) {
      console.error("Error in CategoryRepoPgImpl.create:", error);
      throw error;
    }
  }

  async update(
    id: number,
    categoryData: Partial<Category>
  ): Promise<Category | null> {
    try {
      // First check if category exists
      const category = await this.findById(id);
      if (!category) {
        return null;
      }

      // Update the category
      const [result] = await this.db.query(
        "UPDATE categories SET name = $1, updated_at = $2 WHERE id = $3 RETURNING *",
        [categoryData.name || category.name, new Date(), id]
      );

      return this.mapToCategory(result[0]);
    } catch (error) {
      console.error(`Error in CategoryRepoPgImpl.update(${id}):`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // Check if category exists
      const category = await this.findById(id);
      if (!category) {
        return false;
      }

      // Check if this category has any kudos cards
      const [kudosCards] = await this.db.query(
        "SELECT COUNT(*) FROM kudos_cards WHERE category_id = $1",
        [id]
      );

      if (kudosCards[0].count > 0) {
        throw new Error(
          `Cannot delete category with ID ${id} because there are kudos cards associated with it`
        );
      }

      const [result] = await this.db.query(
        "DELETE FROM categories WHERE id = $1 RETURNING id",
        [id]
      );

      return result && result.length > 0;
    } catch (error) {
      console.error(`Error in CategoryRepoPgImpl.delete(${id}):`, error);
      throw error;
    }
  }

  /**
   * Maps a database row to a Category entity
   */
  private mapToCategory(row: any): Category {
    return Category.create({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
