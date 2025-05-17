import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";
import { CategoryMapper } from "../../mappers/CategoryMapper";
import { CategoryDTO } from "../../dtos/CategoryDTOs";

/**
 * Use case for retrieving all categories
 */
export class GetAllCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  /**
   * Execute the use case
   * @returns Promise resolving to an array of CategoryDTOs
   */
  async execute(): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepository.findAll();
    return CategoryMapper.toDTOList(categories);
  }
}
