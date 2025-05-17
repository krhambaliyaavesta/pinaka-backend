import { CategoryRepoFactory } from "../../infrastructure/repositories/CategoryRepoFactory";
import { CreateCategoryUseCase } from "./createCategory/CreateCategoryUseCase";
import { GetAllCategoriesUseCase } from "./getAllCategories/GetAllCategoriesUseCase";
import { GetCategoryByIdUseCase } from "./getCategory/GetCategoryByIdUseCase";
import { UpdateCategoryUseCase } from "./updateCategory/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "./deleteCategory/DeleteCategoryUseCase";

/**
 * Factory for creating category use case instances
 */
export class CategoryUseCaseFactory {
  /**
   * Create a new instance of CreateCategoryUseCase
   * @returns CreateCategoryUseCase instance
   */
  static createCreateCategoryUseCase(): CreateCategoryUseCase {
    const categoryRepo = CategoryRepoFactory.createCategoryRepo();
    return new CreateCategoryUseCase(categoryRepo);
  }

  /**
   * Create a new instance of GetAllCategoriesUseCase
   * @returns GetAllCategoriesUseCase instance
   */
  static createGetAllCategoriesUseCase(): GetAllCategoriesUseCase {
    const categoryRepo = CategoryRepoFactory.createCategoryRepo();
    return new GetAllCategoriesUseCase(categoryRepo);
  }

  /**
   * Create a new instance of GetCategoryByIdUseCase
   * @returns GetCategoryByIdUseCase instance
   */
  static createGetCategoryByIdUseCase(): GetCategoryByIdUseCase {
    const categoryRepo = CategoryRepoFactory.createCategoryRepo();
    return new GetCategoryByIdUseCase(categoryRepo);
  }

  /**
   * Create a new instance of UpdateCategoryUseCase
   * @returns UpdateCategoryUseCase instance
   */
  static createUpdateCategoryUseCase(): UpdateCategoryUseCase {
    const categoryRepo = CategoryRepoFactory.createCategoryRepo();
    return new UpdateCategoryUseCase(categoryRepo);
  }

  /**
   * Create a new instance of DeleteCategoryUseCase
   * @returns DeleteCategoryUseCase instance
   */
  static createDeleteCategoryUseCase(): DeleteCategoryUseCase {
    const categoryRepo = CategoryRepoFactory.createCategoryRepo();
    return new DeleteCategoryUseCase(categoryRepo);
  }
} 