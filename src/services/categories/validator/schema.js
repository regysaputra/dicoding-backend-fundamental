import Joi from "joi";

export const categoryPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

export const categoryUpdatePayloadSchema = Joi.object({ name: Joi.string() });