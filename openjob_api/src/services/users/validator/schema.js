import Joi from "joi";

export const userPayloadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("admin", "user").required(),
});

export const jobQuerySchema = Joi.object({
  title: Joi.string().empty(),
  companyName: Joi.string().empty(),
});

export const parametersSchema = Joi.object({
  id: Joi.string().guid(),
  userId: Joi.string().guid(),
  jobId: Joi.string().guid(),
  companyId: Joi.string().guid(),
  categoryId: Joi.string().guid(),
});