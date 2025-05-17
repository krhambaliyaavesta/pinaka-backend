import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { CategoryNotFoundError } from "../../../domain/exceptions/CategoryExceptions";

/**
 * Use case for deleting a category
 */
export class DeleteCategoryUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  /**
   * Execute the use case
   * @param id Category ID to delete
   * @returns Promise resolving to void
   */
  async execute(id: number): Promise<void> {
    // First check if the category exists
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    // Delete the category
    const result = await this.categoryRepo.delete(id);
    if (!result) {
      throw new Error(`Failed to delete category with ID ${id}`);
    }
  }
} 