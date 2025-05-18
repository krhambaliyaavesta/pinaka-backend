import { Password } from "../../../../../modules/auth/domain/valueObjects/Password";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs", () => ({
  genSalt: jest.fn().mockResolvedValue("salt"),
  hash: jest.fn().mockResolvedValue("$2a$10$hashed_password"),
  compare: jest.fn().mockResolvedValue(true),
}));

describe("Password Value Object", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create method", () => {
    it("should create a valid Password object with plain text password", () => {
      // Arrange
      const plainPassword = "password123";

      // Act
      const password = Password.create(plainPassword);

      // Assert
      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(plainPassword);
      expect(password.isHashed).toBe(false);
    });

    it("should create a valid Password object with already hashed password", () => {
      // Arrange
      const hashedPassword =
        "$2a$10$ASD8Ah0UasVlGYZLF5sH8.YGI.FII3wq9yRBOJYcYTZ/6wdlN/JzG";

      // Act
      const password = Password.create(hashedPassword);

      // Assert
      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(hashedPassword);
      expect(password.isHashed).toBe(true);
    });

    it("should throw an error for too short password", () => {
      // Arrange
      const shortPassword = "12345";

      // Act & Assert
      expect(() => Password.create(shortPassword)).toThrow(
        "Password must be at least 6 characters long"
      );
    });
  });

  describe("isValid method", () => {
    it("should return true for valid passwords", () => {
      // Arrange & Act & Assert
      expect(Password.isValid("password123")).toBe(true);
      expect(
        Password.isValid(
          "$2a$10$ASD8Ah0UasVlGYZLF5sH8.YGI.FII3wq9yRBOJYcYTZ/6wdlN/JzG"
        )
      ).toBe(true);
    });

    it("should return false for invalid passwords", () => {
      // Arrange & Act & Assert
      expect(Password.isValid("12345")).toBe(false);
      expect(Password.isValid("")).toBe(false);
    });
  });

  describe("fromHashed method", () => {
    it("should create a Password object with hashed value", () => {
      // Arrange
      const hashedValue =
        "$2a$10$ASD8Ah0UasVlGYZLF5sH8.YGI.FII3wq9yRBOJYcYTZ/6wdlN/JzG";

      // Act
      const password = Password.fromHashed(hashedValue);

      // Assert
      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(hashedValue);
      expect(password.isHashed).toBe(true);
    });
  });

  describe("compare method", () => {
    it("should return true when comparing a plain password to a matching hashed password", async () => {
      // Arrange
      const hashedPassword = Password.fromHashed("$2a$10$hashed_password");
      const plainPassword = "password123";

      // Act
      const result = await hashedPassword.compare(plainPassword);

      // Assert
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainPassword,
        "$2a$10$hashed_password"
      );
    });

    it("should return true when comparing a plain password with itself", async () => {
      // Arrange
      const plainPassword = "password123";
      const password = Password.create(plainPassword);

      // Act
      const result = await password.compare(plainPassword);

      // Assert
      expect(result).toBe(true);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("should return false when comparing a plain password with a different plain password", async () => {
      // Arrange
      const password = Password.create("password123");

      // Act
      const result = await password.compare("differentPassword");

      // Assert
      expect(result).toBe(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe("hash method", () => {
    it("should return a new hashed Password object when hashing a plain password", async () => {
      // Arrange
      const plainPassword = Password.create("password123");

      // Act
      const hashedPassword = await plainPassword.hash();

      // Assert
      expect(hashedPassword).toBeInstanceOf(Password);
      expect(hashedPassword.value).toBe("$2a$10$hashed_password");
      expect(hashedPassword.isHashed).toBe(true);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
    });

    it("should return the same Password object when password is already hashed", async () => {
      // Arrange
      const hashedPassword = Password.fromHashed("$2a$10$hashed_password");

      // Act
      const result = await hashedPassword.hash();

      // Assert
      expect(result).toBe(hashedPassword);
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});
