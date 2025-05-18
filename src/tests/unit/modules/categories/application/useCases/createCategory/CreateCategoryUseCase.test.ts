import { CreateCategoryUseCase } from '../../../../../../../modules/categories/application/useCases/createCategory/CreateCategoryUseCase';
import { CategoryValidationError } from '../../../../../../../modules/categories/domain/exceptions/CategoryExceptions';
import { Category } from '../../../../../../../modules/categories/domain/entities/Category';

/**
 * CreateCategoryUseCase Unit Tests
 * 
 * These tests verify the business logic of the CreateCategoryUseCase
 * without relying on external systems or database connections.
 */
describe('CreateCategoryUseCase', () => {
  let createCategoryUseCase: CreateCategoryUseCase;
  let mockCategoryRepo: any;

  beforeEach(() => {
    // Arrange (common setup)
    // Create a fresh mock repository for each test to ensure isolation
    mockCategoryRepo = {
      create: jest.fn(),
      findByName: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    
    // Initialize use case with mock repository
    createCategoryUseCase = new CreateCategoryUseCase(mockCategoryRepo);
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a category successfully', async () => {
      // Arrange
      const categoryInput = { name: 'Innovation' };
      
      // Mock the create method to return a category with a generated ID
      const createdCategory = {
        id: 1,
        name: categoryInput.name
      };
      mockCategoryRepo.create.mockResolvedValue(createdCategory);
      
      // Mock the Category.create method
      const originalCreate = Category.create;
      Category.create = jest.fn().mockReturnValue({
        id: 0,
        name: categoryInput.name
      });

      // Act
      const result = await createCategoryUseCase.execute(categoryInput);

      // Assert
      expect(mockCategoryRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        id: 0,
        name: categoryInput.name
      }));
      expect(result).toEqual(createdCategory);
      
      // Restore the original method
      Category.create = originalCreate;
    });

    it('should throw CategoryValidationError when category creation fails due to validation', async () => {
      // Arrange
      const categoryInput = { name: '' }; // Invalid input
      
      // Mock Category.create to throw an error
      const originalCreate = Category.create;
      Category.create = jest.fn().mockImplementation(() => {
        throw new Error('Category name cannot be empty');
      });

      // Act & Assert
      await expect(createCategoryUseCase.execute(categoryInput))
        .rejects
        .toThrow(CategoryValidationError);
      expect(mockCategoryRepo.create).not.toHaveBeenCalled();
      
      // Restore the original method
      Category.create = originalCreate;
    });
    
    it('should propagate unknown errors', async () => {
      // Arrange
      const categoryInput = { name: 'Test Category' };
      
      // Mock Category.create to not throw
      const originalCreate = Category.create;
      Category.create = jest.fn().mockReturnValue({
        id: 0,
        name: categoryInput.name
      });
      
      // But mock the repository to throw a different error
      const unknownError = new Error('Database connection failed');
      mockCategoryRepo.create.mockRejectedValue(unknownError);

      // Act & Assert
      await expect(createCategoryUseCase.execute(categoryInput))
        .rejects
        .toThrow('Database connection failed');
      
      // Restore the original method
      Category.create = originalCreate;
    });
    
    it('should create a category with trimmed name', async () => {
      // Arrange
      const categoryInput = { name: '  Leadership  ' };
      const trimmedName = 'Leadership';
      
      // Mock the create method
      const createdCategory = {
        id: 1,
        name: trimmedName
      };
      mockCategoryRepo.create.mockResolvedValue(createdCategory);
      
      // Mock Category.create to handle trimming the name (simulating actual behavior)
      const originalCreate = Category.create;
      Category.create = jest.fn().mockImplementation((data) => {
        return {
          id: data.id,
          name: data.name.trim()
        };
      });

      // Act
      const result = await createCategoryUseCase.execute(categoryInput);

      // Assert
      expect(mockCategoryRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        name: trimmedName
      }));
      expect(result).toEqual(createdCategory);
      
      // Restore the original method
      Category.create = originalCreate;
    });
  });
}); 