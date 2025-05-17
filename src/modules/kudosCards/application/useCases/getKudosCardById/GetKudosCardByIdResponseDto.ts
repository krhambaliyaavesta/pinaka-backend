/**
 * DTO for kudos card details response
 */
export interface GetKudosCardByIdResponseDto {
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