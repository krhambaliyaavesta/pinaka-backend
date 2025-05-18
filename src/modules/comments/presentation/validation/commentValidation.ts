import Joi from "joi";

export const addCommentSchema = Joi.object({
  kudosCardId: Joi.string().uuid().required(),
  content: Joi.string().min(1).max(500).required(),
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
});

export const getCommentsSchema = Joi.object({
  kudosCardId: Joi.string().uuid().required(),
});
