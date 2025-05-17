import { KudosCardsModuleFactory } from "../../../../../shared/factories/KudosCardsModuleFactory";
import { GetAllCategoriesUseCase } from "./GetAllCategoriesUseCase";
import { GetCategoryByIdUseCase } from "./GetCategoryByIdUseCase";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";
import { UpdateCategoryUseCase } from "./UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "./DeleteCategoryUseCase";

/**
 * Factory for creating category-related use cases
 */
export class CategoryUseCaseFactory {
  /**
   * Creates a use case for getting all categories
   */
  static createGetAllCategoriesUseCase(): GetAllCategoriesUseCase {
    const categoryRepo = KudosCardsModuleFactory.getCategoryRepo();
    return new GetAllCategoriesUseCase(categoryRepo);
  }

  /**
   * Creates a use case for getting a category by ID
   */
  static createGetCategoryByIdUseCase(): GetCategoryByIdUseCase {
    const categoryRepo = KudosCardsModuleFactory.getCategoryRepo();
    return new GetCategoryByIdUseCase(categoryRepo);
  }

  /**
   * Creates a use case for creating a category
   */
  static createCreateCategoryUseCase(): CreateCategoryUseCase {
    const categoryRepo = KudosCardsModuleFactory.getCategoryRepo();
    return new CreateCategoryUseCase(categoryRepo);
  }

  /**
   * Creates a use case for updating a category
   */
  static createUpdateCategoryUseCase(): UpdateCategoryUseCase {
    const categoryRepo = KudosCardsModuleFactory.getCategoryRepo();
    return new UpdateCategoryUseCase(categoryRepo);
  }

  /**
   * Creates a use case for deleting a category
   */
  static createDeleteCategoryUseCase(): DeleteCategoryUseCase {
    const categoryRepo = KudosCardsModuleFactory.getCategoryRepo();
    return new DeleteCategoryUseCase(categoryRepo);
  }
}
