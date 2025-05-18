import { ReactionType } from "../../../domain/entities/Reaction";

export interface RemoveReactionResponseDto {
  success: boolean;
  kudosCardId: string;
  reactionCounts: { type: ReactionType; count: number }[];
}
