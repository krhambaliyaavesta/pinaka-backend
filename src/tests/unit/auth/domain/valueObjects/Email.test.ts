import { Email } from "../../../../../modules/auth/domain/valueObjects/Email";

describe("Email Value Object", () => {
  describe("create method", () => {
    it("should create a valid Email object with correct email", () => {
      // Arrange
      const validEmail = "test@example.com";

      // Act
      const email = Email.create(validEmail);

      // Assert
      expect(email).toBeInstanceOf(Email);
      expect(email.value).toBe(validEmail);
    });

    it("should throw an error for invalid email format", () => {
      // Arrange
      const invalidEmails = [
        "invalid-email",
        "test@",
        "@example.com",
        "test@example",
        "",
        "test@example.",
        "test.com",
      ];

      // Act & Assert
      invalidEmails.forEach((invalidEmail) => {
        expect(() => Email.create(invalidEmail)).toThrow(
          "Invalid email format"
        );
      });
    });
  });

  describe("isValid method", () => {
    it("should return true for valid emails", () => {
      // Arrange
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "firstname.lastname@company.org",
        "email@subdomain.domain.com",
      ];

      // Act & Assert
      validEmails.forEach((validEmail) => {
        expect(Email.isValid(validEmail)).toBe(true);
      });
    });

    it("should return false for invalid emails", () => {
      // Arrange
      const invalidEmails = [
        "invalid-email",
        "test@",
        "@example.com",
        "test@example",
        "",
        "test@example.",
        "test.com",
      ];

      // Act & Assert
      invalidEmails.forEach((invalidEmail) => {
        expect(Email.isValid(invalidEmail)).toBe(false);
      });
    });
  });

  describe("equals method", () => {
    it("should return true when emails are equal", () => {
      // Arrange
      const email1 = Email.create("test@example.com");
      const email2 = Email.create("test@example.com");

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });

    it("should return false when emails are not equal", () => {
      // Arrange
      const email1 = Email.create("test1@example.com");
      const email2 = Email.create("test2@example.com");

      // Act & Assert
      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe("toString method", () => {
    it("should return the email string value", () => {
      // Arrange
      const emailStr = "test@example.com";
      const email = Email.create(emailStr);

      // Act & Assert
      expect(email.toString()).toBe(emailStr);
    });
  });
});
