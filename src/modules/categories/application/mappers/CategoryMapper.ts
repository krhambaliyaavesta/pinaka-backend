import { Category, CategoryProps } from "../../domain/entities/Category";

/**
 * DTO for Category entity
 */
export interface CategoryDTO {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mapper class for converting between Category domain entities and DTOs
 */
export class CategoryMapper {
  /**
   * Converts a Category entity to a CategoryDTO
   * @param category The Category entity to convert
   * @returns A CategoryDTO representing the Category
   */
  public static toDTO(category: Category): CategoryDTO {
    // Convert entity to plain object to avoid 'props' property in response
    const categoryData = category.toObject();
    
    return {
      id: categoryData.id,
      name: categoryData.name,
      createdAt: categoryData.createdAt?.toISOString() || "",
      updatedAt: categoryData.updatedAt?.toISOString() || "",
    };
  }
} 