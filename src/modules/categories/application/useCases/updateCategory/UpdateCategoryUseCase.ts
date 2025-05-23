import { Category } from "../../../domain/entities/Category";
import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { CategoryNotFoundError, CategoryValidationError } from "../../../domain/exceptions/CategoryExceptions";
import { CategoryDTO, CategoryMapper } from "../../mappers/CategoryMapper";

interface UpdateCategoryInput {
  name?: string;
}

/**
 * Use case for updating an existing category
 */
export class UpdateCategoryUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  /**
   * Execute the use case
   * @param id Category ID to update
   * @param input Category update data
   * @returns Promise resolving to the updated category DTO
   */
  async execute(id: number, input: UpdateCategoryInput): Promise<CategoryDTO> {
    // Find the category
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    try {
      // Update category attributes if provided
      if (input.name !== undefined) {
        category.updateName(input.name);
      }

      // Persist the updated category
      const updatedCategory = await this.categoryRepo.update(category);
      
      // Transform to DTO and return
      return CategoryMapper.toDTO(updatedCategory);
    } catch (error) {
      if (error instanceof Error) {
        throw new CategoryValidationError(error.message);
      }
      throw error;
    }
  }
} 