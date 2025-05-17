import { Category } from "../../../domain/entities/Category";
import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { CategoryDTO, CategoryMapper } from "../../mappers/CategoryMapper";

/**
 * Use case for retrieving all categories
 */
export class GetAllCategoriesUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  /**
   * Execute the use case
   * @returns Promise resolving to array of category DTOs
   */
  async execute(): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepo.findAll();
    return categories.map(category => CategoryMapper.toDTO(category));
  }
} 