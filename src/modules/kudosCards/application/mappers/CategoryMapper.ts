import { Category, CategoryProps } from "../../domain/entities/Category";
import {
  CategoryDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../dtos/CategoryDTOs";

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
    return {
      id: category.id as number,
      name: category.name,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an array of Category entities to CategoryDTOs
   * @param categories The Category entities to convert
   * @returns An array of CategoryDTOs
   */
  public static toDTOList(categories: Category[]): CategoryDTO[] {
    return categories.map((category) => this.toDTO(category));
  }

  /**
   * Converts a CreateCategoryDTO to Category entity properties
   * @param createCategoryDTO The DTO containing category creation data
   * @returns Category properties ready for entity creation
   */
  public static toDomain(createCategoryDTO: CreateCategoryDTO): CategoryProps {
    return {
      name: createCategoryDTO.name,
    };
  }

  /**
   * Extracts update properties from UpdateCategoryDTO
   * @param updateCategoryDTO The DTO containing category update data
   * @returns Partial Category properties for entity update
   */
  public static toUpdateDomain(
    updateCategoryDTO: UpdateCategoryDTO
  ): Partial<CategoryProps> {
    const updateProps: Partial<CategoryProps> = {};

    if (updateCategoryDTO.name !== undefined) {
      updateProps.name = updateCategoryDTO.name;
    }

    return updateProps;
  }
}
