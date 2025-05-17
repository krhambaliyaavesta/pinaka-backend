import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { CategoryMapper } from "../../mappers/CategoryMapper";
import { CategoryDTO } from "../../dtos/CategoryDTOs";
import { CategoryNotFoundError } from "../../../domain/exceptions/KudosCardExceptions";

/**
 * Use case for retrieving a category by ID
 */
export class GetCategoryByIdUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  /**
   * Execute the use case
   * @param id The ID of the category to retrieve
   * @returns Promise resolving to a CategoryDTO
   * @throws CategoryNotFoundError if the category with the given ID doesn't exist
   */
  async execute(id: number): Promise<CategoryDTO> {
    const category = await this.categoryRepo.findById(id);

    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    return CategoryMapper.toDTO(category);
  }
}
