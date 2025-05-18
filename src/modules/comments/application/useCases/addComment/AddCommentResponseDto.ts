export interface CommentDto {
  id: string;
  kudosCardId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddCommentResponseDto {
  comment: CommentDto;
  totalComments: number;
}
