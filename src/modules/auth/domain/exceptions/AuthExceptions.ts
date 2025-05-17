export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class UserNotFoundError extends AuthError {
  constructor(identifier?: string) {
    super(`User${identifier ? ` with identifier ${identifier}` : ''} not found`);
    this.name = 'UserNotFoundError';
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

export class EmailAlreadyExistsError extends AuthError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'EmailAlreadyExistsError';
    Object.setPrototypeOf(this, EmailAlreadyExistsError.prototype);
  }
}

export class InvalidTokenError extends AuthError {
  constructor() {
    super('Invalid or expired token');
    this.name = 'InvalidTokenError';
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

export class InvalidUserDataError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserDataError';
    Object.setPrototypeOf(this, InvalidUserDataError.prototype);
  }
}

export class UnauthorizedActionError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedActionError';
    Object.setPrototypeOf(this, UnauthorizedActionError.prototype);
  }
} 