import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";
import { CategoryMapper } from "../../mappers/CategoryMapper";
import { UpdateCategoryDTO, CategoryDTO } from "../../dtos/CategoryDTOs";
import {
  CategoryNotFoundError,
  KudosCardValidationError,
} from "../../../domain/exceptions/KudosCardExceptions";

/**
 * Use case for updating an existing category
 */
export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

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
      const existingCategory = await this.categoryRepository.findById(id);
      if (!existingCategory) {
        throw new CategoryNotFoundError(id);
      }

      // Convert DTO to domain entity props
      const updateProps = CategoryMapper.toUpdateDomain(updateCategoryDTO);

      // Update the category
      const updatedCategory = await this.categoryRepository.update(
        id,
        updateProps
      );

      if (!updatedCategory) {
        throw new CategoryNotFoundError(id);
      }

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
