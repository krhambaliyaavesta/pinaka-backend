/**
 * DTO for retrieving kudos card information (enriched with related data)
 */
export interface KudosCardDTO {
  id: string;
  recipientName: string;
  teamId: number;
  teamName: string;
  categoryId: number;
  categoryName: string;
  message: string;
  createdBy: string;
  creatorName: string;
  sentBy: string;
  senderName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a new kudos card
 */
export interface CreateKudosCardDTO {
  id: string;
  recipientName: string;
  teamId: number;
  categoryId: number;
  message: string;
}

/**
 * DTO for updating an existing kudos card
 */
export interface UpdateKudosCardDTO {
  recipientName?: string;
  teamId?: number;
  categoryId?: number;
  message?: string;
}

/**
 * DTO for filtering kudos cards in search/list operations
 */
export interface KudosCardFilterDTO {
  recipientName?: string;
  teamId?: number;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

/**
 * DTO for paginated response containing kudos cards
 */
export interface PaginatedKudosCardResponseDTO {
  kudosCards: KudosCardDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * DTO for top recipients analytics
 */
export interface TopRecipientsDTO {
  recipients: Array<{
    recipientName: string;
    count: number;
  }>;
  period: string;
  startDate: string;
  endDate: string;
}

/**
 * DTO for top teams analytics
 */
export interface TopTeamsDTO {
  teams: Array<{
    teamId: number;
    teamName: string;
    count: number;
  }>;
  period: string;
  startDate: string;
  endDate: string;
}

/**
 * DTO for trending categories analytics
 */
export interface TrendingCategoriesDTO {
  categories: Array<{
    categoryId: number;
    categoryName: string;
    count: number;
  }>;
  period: string;
  startDate: string;
  endDate: string;
}

/**
 * DTO for trending keywords analytics
 */
export interface TrendingKeywordsDTO {
  keywords: Array<{
    keyword: string;
    count: number;
  }>;
  period: string;
  startDate: string;
  endDate: string;
}
