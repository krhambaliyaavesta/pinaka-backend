export class CommentNotFoundError extends Error {
  constructor(id: string) {
    super(`Comment with ID ${id} not found`);
    this.name = "CommentNotFoundError";
  }
}

export class UnauthorizedCommentAccessError extends Error {
  constructor(userId: string, commentId: string) {
    super(`User ${userId} is not authorized to access comment ${commentId}`);
    this.name = "UnauthorizedCommentAccessError";
  }
}

export class KudosCardNotFoundError extends Error {
  constructor(id: string) {
    super(`Kudos card with ID ${id} not found`);
    this.name = "KudosCardNotFoundError";
  }
}
