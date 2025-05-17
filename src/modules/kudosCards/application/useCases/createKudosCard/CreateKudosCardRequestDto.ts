/**
 * DTO for creating a new kudos card
 */
export interface CreateKudosCardRequestDto {
  recipientName: string;
  teamId: number;
  categoryId: number;
  message: string;
} 