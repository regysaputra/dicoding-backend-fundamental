import Joi from "joi";

export const jobPayloadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  job_type: Joi.string().required(),
  experience_level: Joi.string().required(),
  location_type: Joi.string().required(),
  location_city: Joi.string(),
  salary_min: Joi.number(),
  salary_max: Joi.number(),
  is_salary_visible: Joi.boolean(),
  status: Joi.string().required(),
});

export const jobUpdatePayloadSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  job_type: Joi.string(),
  experience_level: Joi.string(),
  location_type: Joi.string(),
  location_city: Joi.string(),
  salary_min: Joi.number(),
  salary_max: Joi.number(),
  is_salary_visible: Joi.boolean(),
  status: Joi.string(),
});

export const jobQueryParamsSchema = Joi.object({
  title: Joi.string().trim().empty(""),
  "company-name": Joi.string().trim().empty(""),
});

export const jobCompanyParamsSchema = Joi.object({
  jobCompanyId: Joi.string().trim().required(),
});

export const jobCategoryParamsSchema = Joi.object({
  jobCategoryId: Joi.string().trim().required(),
});

