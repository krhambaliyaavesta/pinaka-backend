import { Request, Response, NextFunction } from "express";
import { CategoryUseCaseFactory } from "../../application/useCases/CategoryUseCaseFactory";
import { AppError } from "../../../../shared/errors/AppError";
import {
  CategoryNotFoundError,
  CategoryValidationError
} from "../../domain/exceptions/CategoryExceptions";

/**
 * Controller for handling category-related API requests
 */
export class CategoryController {
  /**
   * Get all categories
   */
  async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const useCase = CategoryUseCaseFactory.createGetAllCategoriesUseCase();
      const categories = await useCase.execute();

      res.status(200).json({
        status: "success",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a category by ID
   */
  async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const useCase = CategoryUseCaseFactory.createGetCategoryByIdUseCase();
      const category = await useCase.execute(id);

      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  }

  /**
   * Create a new category
   */
  async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const useCase = CategoryUseCaseFactory.createCreateCategoryUseCase();
      const category = await useCase.execute(req.body);

      res.status(201).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      if (error instanceof CategoryValidationError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  /**
   * Update an existing category
   */
  async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const useCase = CategoryUseCaseFactory.createUpdateCategoryUseCase();
      const category = await useCase.execute(id, req.body);

      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        next(new AppError(error.message, 404));
      } else if (error instanceof CategoryValidationError) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const useCase = CategoryUseCaseFactory.createDeleteCategoryUseCase();
      await useCase.execute(id);

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  }
} 