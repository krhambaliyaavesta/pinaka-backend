import { Category } from "../../../domain/entities/Category";
import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";

/**
 * Use case for retrieving all categories
 */
export class GetAllCategoriesUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  /**
   * Execute the use case
   * @returns Promise resolving to array of categories
   */
  async execute(): Promise<Category[]> {
    return await this.categoryRepo.findAll();
  }
} 