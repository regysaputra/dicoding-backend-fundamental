import Joi from "joi";

export const companyPayloadSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required()
});

export const companyUpdatePayloadSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  location: Joi.string()
});