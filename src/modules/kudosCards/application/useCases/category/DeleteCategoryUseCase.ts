import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";
import { CategoryNotFoundError } from "../../../domain/exceptions/KudosCardExceptions";

/**
 * Use case for deleting a category
 */
export class DeleteCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  /**
   * Execute the use case
   * @param id The ID of the category to delete
   * @returns Promise resolving to a boolean indicating success
   * @throws CategoryNotFoundError if the category with the given ID doesn't exist
   */
  async execute(id: number): Promise<boolean> {
    // First check if category exists
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new CategoryNotFoundError(id);
    }

    // Delete the category
    const result = await this.categoryRepository.delete(id);

    if (!result) {
      throw new Error(`Failed to delete category with ID ${id}`);
    }

    return true;
  }
}
