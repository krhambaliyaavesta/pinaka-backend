import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { CategoryMapper } from "../../mappers/CategoryMapper";
import { UpdateCategoryDTO, CategoryDTO } from "../../dtos/CategoryDTOs";
import {
  CategoryNotFoundError,
  KudosCardValidationError,
} from "../../../domain/exceptions/KudosCardExceptions";
import { Category } from "../../../domain/entities/Category";

/**
 * Use case for updating an existing category
 */
export class UpdateCategoryUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  /**
   * Execute the use case
   * @param id The ID of the category to update
   * @param updateCategoryDTO The data for updating the category
   * @returns Promise resolving to the updated CategoryDTO
   * @throws CategoryNotFoundError if the category with the given ID doesn't exist
   */
  async execute(
    id: number,
    updateCategoryDTO: UpdateCategoryDTO
  ): Promise<CategoryDTO> {
    try {
      // First check if category exists
      const existingCategory = await this.categoryRepo.findById(id);
      if (!existingCategory) {
        throw new CategoryNotFoundError(id);
      }

      // Update the category entity
      if (updateCategoryDTO.name) {
        existingCategory.updateName(updateCategoryDTO.name);
      }

      // Update the category
      const updatedCategory = await this.categoryRepo.update(existingCategory);

      // Return DTO
      return CategoryMapper.toDTO(updatedCategory);
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new KudosCardValidationError(error.message);
      }
      throw error;
    }
  }
}
