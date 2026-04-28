import JobRepositories from "../repositories/job-repositories.js";
import response from "../../../utils/response.js";
import {uuidv7} from "uuidv7";
import {NotFoundError} from "../../../exceptions/index.js";

const jobRepositories = new JobRepositories();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function addJob(req, res, next) {
  const {
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible,
    status,
  } = req.body;

  const id = uuidv7();
  await jobRepositories.addJob({
    id,
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible,
    status,
  });
  return response(
    res,
    201,
    "Company created successfully",
    {
      id
    }
  );
}

export async function getAllJob(req, res, next) {
  const query = res.locals.validatedQuery ?? req.query;

  const jobs = await jobRepositories.getAllJob({
    title: query.title,
    companyName: query["company-name"],
  });

  return response(
    res,
    200,
    "Job retrieved successfully",
    {
      jobs
    }
  );
}

export async function getJobByCompanyId(req, res) {
  const { jobCompanyId } = req.params;

  if (!uuidRegex.test(jobCompanyId)) {
    return response(
      res,
      200,
      "Job retrieved successfully",
      {
        jobs: [],
      }
    );
  }

  const jobs = await jobRepositories.getJobByCompanyId(jobCompanyId);

  return response(
    res,
    200,
    "Job retrieved successfully",
    {
      jobs,
    }
  );
}

export async function getJobByCategoryId(req, res) {
  const { jobCategoryId } = req.params;

  if (!uuidRegex.test(jobCategoryId)) {
    return response(
      res,
      200,
      "Job retrieved successfully",
      {
        jobs: [],
      }
    );
  }

  const jobs = await jobRepositories.getJobByCategoryId(jobCategoryId);

  return response(
    res,
    200,
    "Job retrieved successfully",
    {
      jobs,
    }
  );
}

export async function getJobById(req, res, next) {
  const { id } = req.params;

  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Job tidak ditemukan"));
  }

  const job = await jobRepositories.getJobById(id);
  if (!job) {
    return response(
      res,
      404,
      "Job not found"
    );
  }
  return response(
    res,
    200,
    "Job retrieved successfully",
    job
  );
}

export async function updateJob(req, res, next) {
  const { id } = req.params;

  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Job tidak ditemukan"));
  }

  const existingJob = await jobRepositories.getJobById(id);

  if (!existingJob) {
    return next(new NotFoundError("Job not found"));
  }

  const updatedData = {
    ...existingJob,
    ...req.body,
  };

  await jobRepositories.updateJob(id, updatedData);
  return response(
    res,
    200,
    "Job updated successfully"
  );
}

export async function deleteJob(req, res, next) {
  const { id } = req.params;

  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Job tidak ditemukan"));
  }

  await jobRepositories.deleteJob(id);
  return response(
    res,
    200,
    "Job deleted successfully"
  )
}