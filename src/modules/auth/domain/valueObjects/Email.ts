export class Email {
  private constructor(public readonly value: string) {}

  public static create(email: string): Email {
    if (!Email.isValid(email)) {
      throw new Error('Invalid email format');
    }
    return new Email(email);
  }

  public static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
} 