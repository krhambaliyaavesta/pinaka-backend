interface KudosCardDto {
  id: number;
  recipientName: string;
  teamId: number;
  teamName: string;
  categoryId: number;
  categoryName: string;
  message: string;
  createdBy: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetKudosCardsResponseDto {
  kudosCards: KudosCardDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
} 