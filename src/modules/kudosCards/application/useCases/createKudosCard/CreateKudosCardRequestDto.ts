/**
 * DTO for creating a new kudos card
 */
export interface CreateKudosCardRequestDto {
  recipientName: string;
  teamId: number;
  categoryId: number;
  message: string;
  sentBy?: string; // Optional ID of user sending the kudos (if different from creator)
}
