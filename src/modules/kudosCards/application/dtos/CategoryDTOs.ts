/**
 * DTO for retrieving category information
 */
export interface CategoryDTO {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO for creating a new category
 */
export interface CreateCategoryDTO {
  name: string;
}

/**
 * DTO for updating an existing category
 */
export interface UpdateCategoryDTO {
  name?: string;
}
