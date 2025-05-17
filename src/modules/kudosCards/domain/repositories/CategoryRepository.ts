import { Category } from "../entities/Category";

/**
 * Repository interface for Category entity operations.
 * This defines the contract for data access operations related to categories.
 */
export interface CategoryRepository {
  /**
   * Find all categories in the system
   * @returns Promise resolving to array of Category entities
   */
  findAll(): Promise<Category[]>;

  /**
   * Find a category by its ID
   * @param id The category ID to search for
   * @returns Promise resolving to the Category entity if found, or null if not found
   */
  findById(id: number): Promise<Category | null>;

  /**
   * Create a new category
   * @param category The category data to create
   * @returns Promise resolving to the created Category entity
   */
  create(
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category>;

  /**
   * Update an existing category
   * @param id The ID of the category to update
   * @param category The category data to update
   * @returns Promise resolving to the updated Category entity, or null if not found
   */
  update(id: number, category: Partial<Category>): Promise<Category | null>;

  /**
   * Delete a category by its ID
   * @param id The ID of the category to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: number): Promise<boolean>;
}
