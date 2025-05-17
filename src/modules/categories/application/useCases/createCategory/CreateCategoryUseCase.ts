import { Category } from "../../../domain/entities/Category";
import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { CategoryValidationError } from "../../../domain/exceptions/CategoryExceptions";
import { CategoryDTO, CategoryMapper } from "../../mappers/CategoryMapper";

interface CreateCategoryInput {
  name: string;
}

/**
 * Use case for creating a new category
 */
export class CreateCategoryUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  /**
   * Execute the use case
   * @param input Category creation input data
   * @returns Promise resolving to the created category DTO
   */
  async execute(input: CreateCategoryInput): Promise<CategoryDTO> {
    try {
      // Create the category entity with a temporary ID
      const category = Category.create({
        id: 0, // Temporary ID that will be replaced by the database
        name: input.name,
      });

      // Persist the category and get the result
      const createdCategory = await this.categoryRepo.create(category);
      
      // Transform to DTO and return
      return CategoryMapper.toDTO(createdCategory);
    } catch (error) {
      if (error instanceof Error) {
        throw new CategoryValidationError(error.message);
      }
      throw error;
    }
  }
} 