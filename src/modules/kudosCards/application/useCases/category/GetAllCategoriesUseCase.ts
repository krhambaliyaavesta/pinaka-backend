import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { CategoryMapper } from "../../mappers/CategoryMapper";
import { CategoryDTO } from "../../dtos/CategoryDTOs";

/**
 * Use case for retrieving all categories
 */
export class GetAllCategoriesUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  /**
   * Execute the use case
   * @returns Promise resolving to an array of CategoryDTOs
   */
  async execute(): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepo.findAll();
    return CategoryMapper.toDTOList(categories);
  }
}
