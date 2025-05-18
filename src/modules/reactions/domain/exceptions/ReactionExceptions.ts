export class ReactionNotFoundError extends Error {
  constructor(id: string) {
    super(`Reaction with ID ${id} not found`);
    this.name = "ReactionNotFoundError";
  }
}

export class DuplicateReactionError extends Error {
  constructor(userId: string, type: string) {
    super(`User ${userId} already reacted with ${type}`);
    this.name = "DuplicateReactionError";
  }
}

export class UnauthorizedReactionError extends Error {
  constructor(userId: string, reactionId: string) {
    super(`User ${userId} is not authorized to modify reaction ${reactionId}`);
    this.name = "UnauthorizedReactionError";
  }
}

export class KudosCardNotFoundError extends Error {
  constructor(id: string) {
    super(`Kudos card with ID ${id} not found`);
    this.name = "KudosCardNotFoundError";
  }
}
