import bcrypt from 'bcryptjs';

export class Password {
  private constructor(public readonly value: string, public readonly isHashed: boolean) {}

  public static create(password: string): Password {
    if (!Password.isValid(password)) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    const isHashed = Password.isPasswordHashed(password);
    return new Password(password, isHashed);
  }

  public static isValid(password: string): boolean {
    return password.length >= 6;
  }

  public static fromHashed(hashedPassword: string): Password {
    return new Password(hashedPassword, true);
  }

  // Check if a password is already hashed
  private static isPasswordHashed(password: string): boolean {
    return password.startsWith('$2a$') || password.startsWith('$2b$');
  }

  public async compare(plainPassword: string): Promise<boolean> {
    if (!this.isHashed) {
      return this.value === plainPassword;
    }
    return bcrypt.compare(plainPassword, this.value);
  }

  public async hash(): Promise<Password> {
    if (this.isHashed) {
      return this;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedValue = await bcrypt.hash(this.value, salt);
    return new Password(hashedValue, true);
  }
} 