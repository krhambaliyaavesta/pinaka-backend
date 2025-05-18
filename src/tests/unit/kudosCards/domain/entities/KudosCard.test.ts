import { KudosCard } from "../../../../../modules/kudosCards/domain/entities/KudosCard";
import {
  validKudosCardProps,
  invalidKudosCardProps,
  kudosCardUpdateProps,
} from "../../../../fixtures/kudosCards.fixtures";

describe("KudosCard Entity", () => {
  // Mock crypto for randomUUID if needed
  global.crypto = {
    ...global.crypto,
    randomUUID: jest
      .fn()
      .mockReturnValue("123e4567-e89b-12d3-a456-426614174000"),
  } as any;

  describe("create method", () => {
    it("should create a valid KudosCard entity with all required properties", () => {
      // Act
      const kudosCard = KudosCard.create(validKudosCardProps);

      // Assert
      expect(kudosCard).toBeDefined();
      expect(kudosCard.id).toBe(validKudosCardProps.id);
      expect(kudosCard.recipientName).toBe(validKudosCardProps.recipientName);
      expect(kudosCard.teamId).toBe(validKudosCardProps.teamId);
      expect(kudosCard.categoryId).toBe(validKudosCardProps.categoryId);
      expect(kudosCard.message).toBe(validKudosCardProps.message);
      expect(kudosCard.createdBy).toBe(validKudosCardProps.createdBy);
      expect(kudosCard.createdAt).toEqual(validKudosCardProps.createdAt);
      expect(kudosCard.updatedAt).toEqual(validKudosCardProps.updatedAt);
      expect(kudosCard.deletedAt).toBeNull();
      expect(kudosCard.isDeleted).toBe(false);
    });

    it("should throw error when recipient name is empty", () => {
      // Arrange
      const props = { ...invalidKudosCardProps, recipientName: "" };

      // Act & Assert
      expect(() => KudosCard.create(props)).toThrow(
        "Recipient name cannot be empty"
      );
    });

    it("should throw error when recipient name exceeds maximum length", () => {
      // Arrange
      const props = {
        ...validKudosCardProps,
        recipientName: "a".repeat(256), // Create a string that's too long
      };

      // Act & Assert
      expect(() => KudosCard.create(props)).toThrow(
        "Recipient name cannot exceed 255 characters"
      );
    });

    it("should throw error when message is empty", () => {
      // Arrange
      const props = { ...validKudosCardProps, message: "" };

      // Act & Assert
      expect(() => KudosCard.create(props)).toThrow(
        "Kudos message cannot be empty"
      );
    });

    it("should throw error when createdBy is missing", () => {
      // Arrange
      const props = {
        ...validKudosCardProps,
        createdBy: "",
      };

      // Act & Assert
      expect(() => KudosCard.create(props)).toThrow("Creator ID is required");
    });
  });

  describe("update method", () => {
    it("should update the KudosCard properties correctly", () => {
      // Arrange
      const kudosCard = KudosCard.create(validKudosCardProps);
      const originalUpdatedAt = kudosCard.updatedAt;

      // Wait to ensure updated timestamp will be different
      jest.advanceTimersByTime(1000);

      // Act
      kudosCard.update(kudosCardUpdateProps);

      // Assert
      expect(kudosCard.recipientName).toBe(kudosCardUpdateProps.recipientName);
      expect(kudosCard.teamId).toBe(kudosCardUpdateProps.teamId);
      expect(kudosCard.categoryId).toBe(kudosCardUpdateProps.categoryId);
      expect(kudosCard.message).toBe(kudosCardUpdateProps.message);
      expect(kudosCard.updatedAt).not.toEqual(originalUpdatedAt);
    });

    it("should throw error when updating with empty recipient name", () => {
      // Arrange
      const kudosCard = KudosCard.create(validKudosCardProps);

      // Act & Assert
      expect(() => kudosCard.update({ recipientName: "" })).toThrow(
        "Recipient name cannot be empty"
      );
    });

    it("should throw error when updating with too long recipient name", () => {
      // Arrange
      const kudosCard = KudosCard.create(validKudosCardProps);

      // Act & Assert
      expect(() =>
        kudosCard.update({ recipientName: "a".repeat(256) })
      ).toThrow("Recipient name cannot exceed 255 characters");
    });

    it("should throw error when updating with empty message", () => {
      // Arrange
      const kudosCard = KudosCard.create(validKudosCardProps);

      // Act & Assert
      expect(() => kudosCard.update({ message: "" })).toThrow(
        "Kudos message cannot be empty"
      );
    });
  });

  describe("softDelete and restore methods", () => {
    it("should mark the KudosCard as deleted when softDelete is called", () => {
      // Arrange
      const kudosCard = KudosCard.create(validKudosCardProps);
      expect(kudosCard.isDeleted).toBe(false);
      expect(kudosCard.deletedAt).toBeNull();

      // Act
      kudosCard.softDelete();

      // Assert
      expect(kudosCard.isDeleted).toBe(true);
      expect(kudosCard.deletedAt).toBeInstanceOf(Date);
    });

    it("should restore a deleted KudosCard when restore is called", () => {
      // Arrange
      const kudosCard = KudosCard.create(validKudosCardProps);
      kudosCard.softDelete();
      expect(kudosCard.isDeleted).toBe(true);

      // Act
      kudosCard.restore();

      // Assert
      expect(kudosCard.isDeleted).toBe(false);
      expect(kudosCard.deletedAt).toBeNull();
    });
  });

  describe("toObject method", () => {
    it("should return a plain object representation of the KudosCard", () => {
      // Arrange
      const kudosCard = KudosCard.create(validKudosCardProps);

      // Act
      const obj = kudosCard.toObject();

      // Assert
      expect(obj).toEqual(validKudosCardProps);
    });
  });
});
