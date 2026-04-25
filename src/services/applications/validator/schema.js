import Joi from "joi";

export const applicationPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().required(),
});

export const applicationUpdatePayloadSchema = Joi.object({ status: Joi.string().required() });