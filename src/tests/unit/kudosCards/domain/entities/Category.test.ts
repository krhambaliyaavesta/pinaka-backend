import { Category } from "../../../../../modules/kudosCards/domain/entities/Category";
import {
  validCategoryProps,
  invalidCategoryProps,
} from "../../../../fixtures/kudosCards.fixtures";

describe("Category Entity", () => {
  describe("create method", () => {
    it("should create a valid Category entity with all required properties", () => {
      // Act
      const category = Category.create(validCategoryProps);

      // Assert
      expect(category).toBeDefined();
      expect(category.id).toBe(validCategoryProps.id);
      expect(category.name).toBe(validCategoryProps.name);
      expect(category.createdAt).toEqual(validCategoryProps.createdAt);
      expect(category.updatedAt).toEqual(validCategoryProps.updatedAt);
    });

    it("should throw error when name is empty", () => {
      // Act & Assert
      expect(() => Category.create(invalidCategoryProps)).toThrow(
        "Category name cannot be empty"
      );
    });

    it("should throw error when name exceeds maximum length", () => {
      // Arrange
      const props = {
        ...validCategoryProps,
        name: "a".repeat(101), // Create a string that's too long
      };

      // Act & Assert
      expect(() => Category.create(props)).toThrow(
        "Category name cannot exceed 100 characters"
      );
    });

    it("should create a category with default timestamps if not provided", () => {
      // Arrange
      const props = {
        name: "Innovation",
      };

      // Act
      const category = Category.create(props);

      // Assert
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("updateName method", () => {
    it("should update the category name correctly", () => {
      // Arrange
      const category = Category.create(validCategoryProps);
      const newName = "Innovation";
      const originalUpdatedAt = category.updatedAt;

      // Wait to ensure updated timestamp will be different
      jest.advanceTimersByTime(1000);

      // Act
      category.updateName(newName);

      // Assert
      expect(category.name).toBe(newName);
      expect(category.updatedAt).not.toEqual(originalUpdatedAt);
    });

    it("should throw error when updating with empty name", () => {
      // Arrange
      const category = Category.create(validCategoryProps);

      // Act & Assert
      expect(() => category.updateName("")).toThrow(
        "Category name cannot be empty"
      );
    });

    it("should throw error when updating with too long name", () => {
      // Arrange
      const category = Category.create(validCategoryProps);

      // Act & Assert
      expect(() => category.updateName("a".repeat(101))).toThrow(
        "Category name cannot exceed 100 characters"
      );
    });
  });

  describe("toObject method", () => {
    it("should return a plain object representation of the Category", () => {
      // Arrange
      const category = Category.create(validCategoryProps);

      // Act
      const obj = category.toObject();

      // Assert
      expect(obj).toEqual(validCategoryProps);
    });
  });
});
