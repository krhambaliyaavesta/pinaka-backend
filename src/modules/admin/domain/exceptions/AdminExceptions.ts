export class AdminError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdminError';
    Object.setPrototypeOf(this, AdminError.prototype);
  }
}

export class AdminOperationError extends AdminError {
  constructor(message: string) {
    super(message);
    this.name = 'AdminOperationError';
    Object.setPrototypeOf(this, AdminOperationError.prototype);
  }
}

export class NotAdminError extends AdminError {
  constructor() {
    super('Only admin users can perform this action');
    this.name = 'NotAdminError';
    Object.setPrototypeOf(this, NotAdminError.prototype);
  }
}