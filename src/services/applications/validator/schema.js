import Joi from "joi";

export const applicationPayloadSchema = Joi.object({
  job_id: Joi.string().required(),
  status: Joi.string().optional(),
});

export const applicationUpdatePayloadSchema = Joi.object({ status: Joi.string().required() });