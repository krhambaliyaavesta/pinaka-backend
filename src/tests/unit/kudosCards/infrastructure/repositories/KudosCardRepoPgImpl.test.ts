import { KudosCardRepoPgImpl } from "../../../../../modules/kudosCards/infrastructure/repositories/KudosCardRepoPgImpl";
import { PostgresService } from "../../../../../shared/services/PostgresService";
import { KudosCard } from "../../../../../modules/kudosCards/domain/entities/KudosCard";
import {
  validKudosCardProps,
  kudosCardDbResponse,
} from "../../../../fixtures/kudosCards.fixtures";

describe("KudosCardRepoPgImpl", () => {
  // Define a mock PostgresService type
  interface MockPostgresService {
    query: jest.Mock;
  }

  let mockDb: MockPostgresService;
  let kudosCardRepo: KudosCardRepoPgImpl;
  let mockKudosCard: KudosCard;

  beforeEach(() => {
    // Create a mock PostgresService
    mockDb = {
      query: jest.fn(),
    };

    // Create the repo with the mock DB
    kudosCardRepo = new KudosCardRepoPgImpl(
      mockDb as unknown as PostgresService
    );

    // Create a mock KudosCard entity
    mockKudosCard = KudosCard.create(validKudosCardProps);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should insert a new kudos card into the database", async () => {
      // Arrange
      mockDb.query.mockResolvedValueOnce([[kudosCardDbResponse], []]);

      // Act
      const result = await kudosCardRepo.create(mockKudosCard);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(kudosCardDbResponse.id);
      expect(result.recipientName).toBe(kudosCardDbResponse.recipient_name);
      expect(result.teamId).toBe(kudosCardDbResponse.team_id);
      expect(result.categoryId).toBe(kudosCardDbResponse.category_id);
      expect(result.message).toBe(kudosCardDbResponse.message);
      expect(result.createdBy).toBe(kudosCardDbResponse.created_by);

      // Verify SQL query
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/INSERT INTO kudos_cards/),
        expect.arrayContaining([
          mockKudosCard.id,
          mockKudosCard.recipientName,
          mockKudosCard.teamId,
          mockKudosCard.categoryId,
          mockKudosCard.message,
          mockKudosCard.createdBy,
        ])
      );
    });

    it("should handle errors when creating a kudos card", async () => {
      // Arrange
      const dbError = new Error("Database error");
      mockDb.query.mockRejectedValueOnce(dbError);

      // Act & Assert
      await expect(kudosCardRepo.create(mockKudosCard)).rejects.toThrow(
        dbError
      );
    });
  });

  describe("findById", () => {
    it("should return a kudos card when found by id", async () => {
      // Arrange
      mockDb.query.mockResolvedValueOnce([[kudosCardDbResponse], []]);

      // Act
      const result = await kudosCardRepo.findById(kudosCardDbResponse.id);

      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe(kudosCardDbResponse.id);
      expect(result?.recipientName).toBe(kudosCardDbResponse.recipient_name);
      expect(result?.teamId).toBe(kudosCardDbResponse.team_id);
      expect(result?.categoryId).toBe(kudosCardDbResponse.category_id);
      expect(result?.message).toBe(kudosCardDbResponse.message);
      expect(result?.createdBy).toBe(kudosCardDbResponse.created_by);

      // Verify SQL query
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(
          /SELECT.*FROM kudos_cards WHERE id = \$1 AND deleted_at IS NULL/
        ),
        [kudosCardDbResponse.id]
      );
    });

    it("should return null when kudos card not found by id", async () => {
      // Arrange
      mockDb.query.mockResolvedValueOnce([[], []]);

      // Act
      const result = await kudosCardRepo.findById("non-existent-id");

      // Assert
      expect(result).toBeNull();
    });

    it("should propagate errors from the database", async () => {
      // Arrange
      const dbError = new Error("Database connection error");
      mockDb.query.mockRejectedValueOnce(dbError);

      // Act & Assert
      await expect(kudosCardRepo.findById("some-id")).rejects.toThrow(dbError);
    });
  });

  describe("update", () => {
    it("should update an existing kudos card in the database", async () => {
      // Arrange
      const updatedProps = {
        recipientName: "Jane Doe",
        message: "Updated message",
      };

      const updatedDbResponse = {
        ...kudosCardDbResponse,
        recipient_name: "Jane Doe",
        message: "Updated message",
        updated_at: new Date(),
      };

      mockDb.query.mockResolvedValueOnce([[updatedDbResponse], []]);

      // Act
      const result = await kudosCardRepo.update(
        mockKudosCard.id!,
        updatedProps
      );

      // Assert
      expect(result).toBeDefined();
      expect(result?.recipientName).toBe("Jane Doe");
      expect(result?.message).toBe("Updated message");

      // Verify SQL query
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE kudos_cards SET/),
        expect.arrayContaining([
          expect.anything(), // This should be the updated_at timestamp
          updatedProps.recipientName,
          updatedProps.message,
          mockKudosCard.id,
        ])
      );
    });

    it("should return the kudos card as is when no rows are updated", async () => {
      // Arrange
      mockDb.query.mockResolvedValueOnce([[], []]);

      // Act
      const result = await kudosCardRepo.update(mockKudosCard.id!, {
        message: "Updated message",
      });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should soft delete a kudos card from the database", async () => {
      // Arrange
      mockDb.query.mockResolvedValueOnce([[{ affected_rows: 1 }], []]);

      // Act
      const result = await kudosCardRepo.delete(mockKudosCard.id!);

      // Assert
      expect(result).toBe(true);

      // Verify SQL query
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(
          /UPDATE kudos_cards SET deleted_at = NOW\(\) WHERE id = \$1/
        ),
        [mockKudosCard.id]
      );
    });

    it("should return false when kudos card not found for deletion", async () => {
      // Arrange
      mockDb.query.mockResolvedValueOnce([[{ affected_rows: 0 }], []]);

      // Act
      const result = await kudosCardRepo.delete("non-existent-id");

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("findAll", () => {
    it("should return all kudos cards with no filters", async () => {
      // Arrange
      mockDb.query.mockResolvedValueOnce([[kudosCardDbResponse], []]);

      // Act
      const result = await kudosCardRepo.findAll();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(kudosCardDbResponse.id);

      // Verify SQL query
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(
          /SELECT.*FROM kudos_cards WHERE deleted_at IS NULL/
        ),
        []
      );
    });

    it("should apply filters when provided", async () => {
      // Arrange
      mockDb.query.mockResolvedValueOnce([[kudosCardDbResponse], []]);
      const filters = {
        teamId: 1,
        categoryId: 1,
        recipientName: "John",
      };

      // Act
      const result = await kudosCardRepo.findAll(filters);

      // Assert
      expect(result).toHaveLength(1);

      // Verify SQL query includes filters
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringMatching(
          /WHERE.*team_id = \$\d+.*AND.*category_id = \$\d+.*AND.*recipient_name ILIKE \$\d+/
        ),
        expect.arrayContaining([1, 1, "%John%"])
      );
    });
  });

  // Additional tests for analytics methods could be added here
  // getTopRecipients, getTopTeams, getTrendingCategories, getTrendingKeywords
});
