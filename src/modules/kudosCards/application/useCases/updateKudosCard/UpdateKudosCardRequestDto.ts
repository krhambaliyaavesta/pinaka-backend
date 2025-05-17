export interface UpdateKudosCardRequestDto {
  id: number;
  recipientName?: string;
  teamId?: number;
  categoryId?: number;
  message?: string;
} 