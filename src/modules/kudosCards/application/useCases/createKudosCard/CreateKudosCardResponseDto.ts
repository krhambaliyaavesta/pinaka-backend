/**
 * DTO for kudos card creation response
 */
export interface CreateKudosCardResponseDto {
  id: number;
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
