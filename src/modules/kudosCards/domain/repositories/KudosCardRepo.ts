import { KudosCard } from "../entities/KudosCard";

/**
 * Filter options for kudos card queries
 */
export interface KudosCardFilters {
  recipientName?: string;
  teamId?: number;
  categoryId?: number;
  startDate?: Date;
  endDate?: Date;
  createdBy?: string;
  sentBy?: string;
  includeDeleted?: boolean;
}

/**
 * Repo interface for KudosCard entity operations.
 * This defines the contract for data access operations related to kudos cards.
 */
export interface KudosCardRepo {
  /**
   * Find all kudos cards based on optional filters
   * @param filters Optional filtering criteria
   * @returns Promise resolving to array of KudosCard entities
   */
  findAll(filters?: KudosCardFilters): Promise<KudosCard[]>;

  /**
   * Find a kudos card by its ID
   * @param id The kudos card ID to search for
   * @returns Promise resolving to the KudosCard entity if found, or null if not found
   */
  findById(id: string): Promise<KudosCard | null>;

  /**
   * Create a new kudos card
   * @param kudosCard The kudos card data to create
   * @returns Promise resolving to the created KudosCard entity
   */
  create(
    kudosCard: Omit<KudosCard, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ): Promise<KudosCard>;

  /**
   * Update an existing kudos card
   * @param id The ID of the kudos card to update
   * @param kudosCard The kudos card data to update
   * @returns Promise resolving to the updated KudosCard entity, or null if not found
   */
  update(id: string, kudosCard: Partial<KudosCard>): Promise<KudosCard | null>;

  /**
   * Soft delete a kudos card by setting its deletedAt timestamp
   * @param id The ID of the kudos card to soft delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  softDelete(id: string): Promise<boolean>;

  /**
   * Restore a soft-deleted kudos card by clearing its deletedAt timestamp
   * @param id The ID of the kudos card to restore
   * @returns Promise resolving to true if restored, false if not found
   */
  restore(id: string): Promise<boolean>;

  /**
   * Permanently delete a kudos card
   * @param id The ID of the kudos card to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Get top recipients of kudos cards
   * @param limit Maximum number of recipients to return
   * @param period Optional time period for filtering (e.g., 'weekly', 'monthly')
   * @returns Promise resolving to array of recipients with counts
   */
  getTopRecipients(
    limit: number,
    period?: string
  ): Promise<{ recipientName: string; count: number }[]>;

  /**
   * Get top teams receiving kudos cards
   * @param limit Maximum number of teams to return
   * @param period Optional time period for filtering
   * @returns Promise resolving to array of teams with counts
   */
  getTopTeams(
    limit: number,
    period?: string
  ): Promise<{ teamId: number; teamName: string; count: number }[]>;

  /**
   * Get trending categories used in kudos cards
   * @param limit Maximum number of categories to return
   * @param period Optional time period for filtering
   * @returns Promise resolving to array of categories with counts
   */
  getTrendingCategories(
    limit: number,
    period?: string
  ): Promise<{ categoryId: number; categoryName: string; count: number }[]>;

  /**
   * Get trending keywords from kudos card messages
   * @param limit Maximum number of keywords to return
   * @param period Optional time period for filtering
   * @returns Promise resolving to array of keywords with counts
   */
  getTrendingKeywords(
    limit: number,
    period?: string
  ): Promise<{ keyword: string; count: number }[]>;
}
