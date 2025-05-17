import { Category } from "../entities/Category";

/**
 * Repo interface for Category entity operations
 */
export interface CategoryRepo {
  /**
   * Find a category by its ID
   * @param id The category ID
   * @returns Promise resolving to Category or null if not found
   */
  findById(id: number): Promise<Category | null>;

  /**
   * Find all categories
   * @returns Promise resolving to array of Categories
   */
  findAll(): Promise<Category[]>;

  /**
   * Create a new category
   * @param category The category entity to create
   * @returns Promise resolving to the created Category
   */
  create(category: Category): Promise<Category>;

  /**
   * Update an existing category
   * @param category The category entity with updated values
   * @returns Promise resolving to the updated Category
   */
  update(category: Category): Promise<Category>;

  /**
   * Delete a category by ID
   * @param id The category ID to delete
   * @returns Promise resolving to true if successful, false otherwise
   */
  delete(id: number): Promise<boolean>;
}
