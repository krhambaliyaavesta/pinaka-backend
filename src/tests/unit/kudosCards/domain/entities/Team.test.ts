import { Team } from "../../../../../modules/kudosCards/domain/entities/Team";
import {
  validTeamProps,
  invalidTeamProps,
} from "../../../../fixtures/kudosCards.fixtures";

describe("Team Entity", () => {
  describe("create method", () => {
    it("should create a valid Team entity with all required properties", () => {
      // Act
      const team = Team.create(validTeamProps);

      // Assert
      expect(team).toBeDefined();
      expect(team.id).toBe(validTeamProps.id);
      expect(team.name).toBe(validTeamProps.name);
      expect(team.createdAt).toEqual(validTeamProps.createdAt);
      expect(team.updatedAt).toEqual(validTeamProps.updatedAt);
    });

    it("should throw error when name is empty", () => {
      // Act & Assert
      expect(() => Team.create(invalidTeamProps)).toThrow(
        "Team name cannot be empty"
      );
    });

    it("should throw error when name exceeds maximum length", () => {
      // Arrange
      const props = {
        ...validTeamProps,
        name: "a".repeat(101), // Create a string that's too long
      };

      // Act & Assert
      expect(() => Team.create(props)).toThrow(
        "Team name cannot exceed 100 characters"
      );
    });

    it("should create a team with default timestamps if not provided", () => {
      // Arrange
      const props = {
        name: "Marketing",
      };

      // Act
      const team = Team.create(props);

      // Assert
      expect(team.createdAt).toBeInstanceOf(Date);
      expect(team.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("updateName method", () => {
    it("should update the team name correctly", () => {
      // Arrange
      const team = Team.create(validTeamProps);
      const newName = "Product Development";
      const originalUpdatedAt = team.updatedAt;

      // Wait to ensure updated timestamp will be different
      jest.advanceTimersByTime(1000);

      // Act
      team.updateName(newName);

      // Assert
      expect(team.name).toBe(newName);
      expect(team.updatedAt).not.toEqual(originalUpdatedAt);
    });

    it("should throw error when updating with empty name", () => {
      // Arrange
      const team = Team.create(validTeamProps);

      // Act & Assert
      expect(() => team.updateName("")).toThrow("Team name cannot be empty");
    });

    it("should throw error when updating with too long name", () => {
      // Arrange
      const team = Team.create(validTeamProps);

      // Act & Assert
      expect(() => team.updateName("a".repeat(101))).toThrow(
        "Team name cannot exceed 100 characters"
      );
    });
  });

  describe("toObject method", () => {
    it("should return a plain object representation of the Team", () => {
      // Arrange
      const team = Team.create(validTeamProps);

      // Act
      const obj = team.toObject();

      // Assert
      expect(obj).toEqual(validTeamProps);
    });
  });
});
