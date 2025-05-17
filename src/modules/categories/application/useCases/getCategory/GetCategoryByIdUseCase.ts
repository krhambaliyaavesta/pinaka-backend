import { Category } from "../../../domain/entities/Category";
import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { CategoryNotFoundError } from "../../../domain/exceptions/CategoryExceptions";

/**
 * Use case for retrieving a category by ID
 */
export class GetCategoryByIdUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  /**
   * Execute the use case
   * @param id Category ID
   * @returns Promise resolving to the category
   */
  async execute(id: number): Promise<Category> {
    const category = await this.categoryRepo.findById(id);
    
    if (!category) {
      throw new CategoryNotFoundError(id);
    }
    
    return category;
  }
} 