import { Comment } from "../entities/Comment";

export interface CommentRepo {
  /**
   * Add a comment to a kudos card
   */
  add(
    comment: Omit<Comment, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ): Promise<Comment>;

  /**
   * Update an existing comment
   */
  update(id: string, content: string): Promise<Comment | null>;

  /**
   * Soft delete a comment
   */
  softDelete(id: string): Promise<boolean>;

  /**
   * Find a comment by ID
   */
  findById(id: string): Promise<Comment | null>;

  /**
   * Get all comments for a kudos card
   */
  findByKudosCardId(
    kudosCardId: string,
    includeDeleted?: boolean
  ): Promise<Comment[]>;

  /**
   * Get comments count for a kudos card
   */
  getCommentCountByKudosCardId(kudosCardId: string): Promise<number>;
}
