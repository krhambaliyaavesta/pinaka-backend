import { UserData } from './UserTypes';
import { Email } from '../valueObjects/Email';
import { Password } from '../valueObjects/Password';

export interface UserProps {
  id?: string;
  email: string | Email;
  password: string | Password;
  firstName: string;
  lastName: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id: string;
  public readonly email: Email;
  public readonly password: Password;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly role: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: {
    id: string;
    email: Email;
    password: Password;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.role = props.role;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Create a new user with hashed password
  public static async create(props: UserProps): Promise<User> {
    if (!props.email) {
      throw new Error('Email is required');
    }
    if (!props.password) {
      throw new Error('Password is required');
    }
    if (!props.firstName) {
      throw new Error('First name is required');
    }
    if (!props.lastName) {
      throw new Error('Last name is required');
    }

    // Convert string properties to value objects
    const email = props.email instanceof Email 
      ? props.email 
      : Email.create(props.email);
    
    const password = props.password instanceof Password
      ? await props.password.hash()
      : await Password.create(props.password).hash();

    return new User({
      id: props.id || crypto.randomUUID(),
      email,
      password,
      firstName: props.firstName,
      lastName: props.lastName,
      role: props.role || 'user',
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  // Create a user from database data
  public static fromData(data: UserData): User {
    return new User({
      id: data.id,
      email: Email.create(data.email),
      password: Password.fromHashed(data.password),
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      createdAt: data.created_at instanceof Date ? data.created_at : new Date(data.created_at),
      updatedAt: data.updated_at instanceof Date ? data.updated_at : new Date(data.updated_at)
    });
  }

  // Verify if a password matches the hashed password
  public async verifyPassword(plainPassword: string): Promise<boolean> {
    return this.password.compare(plainPassword);
  }

  // Convert to JSON for responses (exclude password)
  public toJSON() {
    return {
      id: this.id,
      email: this.email.toString(),
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      role: this.role,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
} 