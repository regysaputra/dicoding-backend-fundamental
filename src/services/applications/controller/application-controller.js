import ApplicationRepositories from "../repositories/application-repositories.js";
import response from "../../../utils/response.js";
import {NotFoundError} from "../../../exceptions/index.js";
import {uuidv7} from "uuidv7";

const applicationRepositories = new ApplicationRepositories();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getAllApplication(req, res, next) {
  const applications = await applicationRepositories.getAllApplication();
  return response(
    res,
    200,
    "Retrieved all applications",
    {
      applications,
    }
  );
}

export async function getApplicationById(req, res, next) {
  const { id } = req.params;

  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Application tidak ditemukan"));
  }

  const application = await applicationRepositories.getApplicationById(id);
  return response(
    res,
    200,
    "Retrieved application with id: " + id,
    application,
  );
}

export async function getApplicationByUserId(req, res, next) {
  const { userId } = req.params;

  if (!uuidRegex.test(userId)) {
    return response(
      res,
      200,
      `Retrieved all applications for user with id: ${userId}`,
      {
        applications: [],
      }
    );
  }

  const applications = await applicationRepositories.getApplicationByUserId(userId);
  return response(
    res,
    200,
    "Retrieved all applications for user with id: " + userId,
    {
      applications,
    }
  );
}

export async function getApplicationByJobId(req, res, next) {
  const { jobId } = req.params;

  if (!uuidRegex.test(jobId)) {
    return response(
      res,
      200,
      `Retrieved all applications for job with id: ${jobId}`,
      {
        applications: [],
      }
    );
  }

  const applications = await applicationRepositories.getApplicationByJobId(jobId);
  return response(
    res,
    200,
    "Retrieved all applications for job with id: " + jobId,
    {
      applications,
    }
  )
}

export async function addApplication(req, res, next) {
  const { user_id, job_id, status } = req.body;
  const id = uuidv7();

  await applicationRepositories.addApplication({ id, userId: user_id, jobId: job_id, status });
  return response(
    res,
    201,
    "Application created successfully",
    {
      id
    }
  );
}

export async function updateApplication(req, res, next) {
  const { id } = req.params;
  const { status } = req.body;
  await applicationRepositories.updateApplication(id, status);
  return response(
    res,
    200,
    "Application updated successfully"
  );
}

export async function deleteApplication(req, res, next) {
  const { id } = req.params;
  await applicationRepositories.deleteApplication(id);
  return response(
    res,
    200,
    "Application deleted successfully"
  )
}