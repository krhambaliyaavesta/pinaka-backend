import { ReactionType } from "../../../domain/entities/Reaction";

export interface ReactionDto {
  id: string;
  kudosCardId: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
}

export interface AddReactionResponseDto {
  reaction: ReactionDto;
  reactionCounts: { type: ReactionType; count: number }[];
}
