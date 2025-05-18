import { GetAllCategoriesUseCase } from '../../../../../../../modules/categories/application/useCases/getAllCategories/GetAllCategoriesUseCase';
import { createCategory } from '../../../../../../mocks/testFactories';

/**
 * GetAllCategoriesUseCase Unit Tests
 * 
 * These tests verify the business logic of the GetAllCategoriesUseCase
 * without relying on external systems or database connections.
 */
describe('GetAllCategoriesUseCase', () => {
  let getAllCategoriesUseCase: GetAllCategoriesUseCase;
  let mockCategoryRepo: any;

  beforeEach(() => {
    // Arrange (common setup)
    // Create a fresh mock repository for each test to ensure isolation
    mockCategoryRepo = {
      findAll: jest.fn()
    };
    
    // Initialize use case with mock repository
    getAllCategoriesUseCase = new GetAllCategoriesUseCase(mockCategoryRepo);
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return all categories successfully', async () => {
      // Arrange
      const mockCategories = [
        createCategory({ id: 'category-1', name: 'Innovation' }),
        createCategory({ id: 'category-2', name: 'Teamwork' }),
        createCategory({ id: 'category-3', name: 'Leadership' })
      ];
      
      mockCategoryRepo.findAll.mockResolvedValue(mockCategories);

      // Act
      const result = await getAllCategoriesUseCase.execute();

      // Assert
      expect(mockCategoryRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('Innovation');
      expect(result[1].name).toBe('Teamwork');
      expect(result[2].name).toBe('Leadership');
    });

    it('should return empty array when no categories exist', async () => {
      // Arrange
      mockCategoryRepo.findAll.mockResolvedValue([]);

      // Act
      const result = await getAllCategoriesUseCase.execute();

      // Assert
      expect(mockCategoryRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle errors from the repository', async () => {
      // Arrange
      const repositoryError = new Error('Database error');
      mockCategoryRepo.findAll.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(getAllCategoriesUseCase.execute())
        .rejects
        .toThrow('Database error');
    });
    
    it('should return categories in the correct order', async () => {
      // Arrange - categories with different creation dates or priorities
      const mockCategories = [
        createCategory({ id: 'category-1', name: 'Innovation', createdAt: new Date('2023-01-15') }),
        createCategory({ id: 'category-2', name: 'Teamwork', createdAt: new Date('2023-01-10') }),
        createCategory({ id: 'category-3', name: 'Leadership', createdAt: new Date('2023-01-05') })
      ];
      
      // Assume the repository returns categories in a specific order
      mockCategoryRepo.findAll.mockResolvedValue(mockCategories);

      // Act
      const result = await getAllCategoriesUseCase.execute();

      // Assert
      expect(mockCategoryRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
      // Check the order is maintained
      expect(result[0].id).toBe('category-1');
      expect(result[1].id).toBe('category-2');
      expect(result[2].id).toBe('category-3');
    });
    
    it('should handle a large number of categories', async () => {
      // Arrange - create many categories to test performance/behavior with large datasets
      const mockCategories = Array.from({ length: 100 }, (_, index) => 
        createCategory({ 
          id: `category-${index + 1}`, 
          name: `Category ${index + 1}` 
        })
      );
      
      mockCategoryRepo.findAll.mockResolvedValue(mockCategories);

      // Act
      const result = await getAllCategoriesUseCase.execute();

      // Assert
      expect(mockCategoryRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
      expect(result.length).toBe(100);
      expect(result[0].name).toBe('Category 1');
      expect(result[99].name).toBe('Category 100');
    });
  });
}); 