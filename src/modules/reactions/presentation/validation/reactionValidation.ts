import Joi from "joi";
import { ReactionType } from "../../domain/entities/Reaction";

export const addReactionSchema = Joi.object({
  kudosCardId: Joi.string().uuid().required(),
  type: Joi.string()
    .valid(...Object.values(ReactionType))
    .required(),
});

export const removeReactionSchema = Joi.object({
  reactionId: Joi.string().uuid().required(),
});

export const getReactionsSchema = Joi.object({
  kudosCardId: Joi.string().uuid().required(),
});
