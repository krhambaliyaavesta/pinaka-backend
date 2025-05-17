import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";
import { CategoryMapper } from "../../mappers/CategoryMapper";
import { CreateCategoryDTO, CategoryDTO } from "../../dtos/CategoryDTOs";
import { Category } from "../../../domain/entities/Category";
import { KudosCardValidationError } from "../../../domain/exceptions/KudosCardExceptions";

/**
 * Use case for creating a new category
 */
export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  /**
   * Execute the use case
   * @param createCategoryDTO The data for creating a new category
   * @returns Promise resolving to the created CategoryDTO
   */
  async execute(createCategoryDTO: CreateCategoryDTO): Promise<CategoryDTO> {
    try {
      // Convert DTO to domain entity props
      const categoryProps = CategoryMapper.toDomain(createCategoryDTO);

      // Create the domain entity
      const category = Category.create(categoryProps);

      // Save to repository
      const savedCategory = await this.categoryRepository.create(category);

      // Return DTO
      return CategoryMapper.toDTO(savedCategory);
    } catch (error) {
      if (error instanceof Error) {
        throw new KudosCardValidationError(error.message);
      }
      throw error;
    }
  }
}
