import { Reaction, ReactionType } from "../entities/Reaction";

export interface ReactionRepo {
  /**
   * Add a reaction to a kudos card
   */
  add(reaction: Omit<Reaction, "id" | "createdAt">): Promise<Reaction>;

  /**
   * Remove a reaction from a kudos card
   */
  remove(id: string): Promise<boolean>;

  /**
   * Find a reaction by ID
   */
  findById(id: string): Promise<Reaction | null>;

  /**
   * Find a specific user's reaction to a kudos card by type
   */
  findByUserAndType(
    kudosCardId: string,
    userId: string,
    type: ReactionType
  ): Promise<Reaction | null>;

  /**
   * Get all reactions for a kudos card
   */
  findByKudosCardId(kudosCardId: string): Promise<Reaction[]>;

  /**
   * Get reaction counts for a kudos card grouped by type
   */
  getReactionCountsByKudosCardId(
    kudosCardId: string
  ): Promise<{ type: ReactionType; count: number }[]>;
}
