import { Category } from "../../../domain/entities/Category";
import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { CategoryNotFoundError } from "../../../domain/exceptions/CategoryExceptions";
import { CategoryDTO, CategoryMapper } from "../../mappers/CategoryMapper";

/**
 * Use case for retrieving a category by ID
 */
export class GetCategoryByIdUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  /**
   * Execute the use case
   * @param id Category ID
   * @returns Promise resolving to the category DTO
   */
  async execute(id: number): Promise<CategoryDTO> {
    const category = await this.categoryRepo.findById(id);
    
    if (!category) {
      throw new CategoryNotFoundError(id);
    }
    
    return CategoryMapper.toDTO(category);
  }
} 