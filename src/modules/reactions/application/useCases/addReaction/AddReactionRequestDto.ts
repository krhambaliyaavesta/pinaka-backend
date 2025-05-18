import { ReactionType } from "../../../domain/entities/Reaction";

export interface AddReactionRequestDto {
  kudosCardId: string;
  type: ReactionType;
}
