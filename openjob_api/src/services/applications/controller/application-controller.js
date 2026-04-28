import ApplicationRepositories from "../repositories/application-repositories.js";
import response from "../../../utils/response.js";
import {InvariantError, NotFoundError} from "../../../exceptions/index.js";
import {uuidv7} from "uuidv7";
import MessageProducer from "../../message-queue/producers/service.js";

const applicationRepositories = new ApplicationRepositories();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getAllApplication(req, res) {
  const applications = await applicationRepositories.getAllApplication();

  const newApplications = applications.map(({ reviewed_by, reviewed_at, ...rest }) => rest);

  return response(
    res,
    200,
    "Retrieved all applications",
    {
      applications: newApplications,
    }
  );
}

export async function getApplicationById(req, res, next) {
  const { id } = req.params;

  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Application tidak ditemukan"));
  }

  const result = await applicationRepositories.getApplicationById(id);

  if (!result?.application) {
    return response(
      res,
      404,
      "Application not found"
    );
  }

  if (result.source) {
    res.setHeader("X-Data-Source", result.source);
  }

  const { review_by, review_at, ...newApplication } = result.application;

  return response(
    res,
    200,
    "Retrieved application with id: " + id,
    newApplication,
  );
}

export async function getApplicationByUserId(req, res) {
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

  const result = await applicationRepositories.getApplicationByUserId(userId);

  res.setHeader("X-Data-Source", result.source);

  return response(
    res,
    200,
    "Retrieved all applications for user with id: " + userId,
    {
      applications: result.applications,
    }
  );
}

export async function getApplicationByJobId(req, res) {
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

  const result = await applicationRepositories.getApplicationByJobId(jobId);

  res.setHeader("X-Data-Source", result.source);

  return response(
    res,
    200,
    "Retrieved all applications for job with id: " + jobId,
    {
      applications: result.applications,
    }
  )
}

export async function addApplication(req, res) {
  const { job_id } = req.body;
  const { id: userId } = req.user;
  const status = req.body.status ?? "pending";
  const id = uuidv7();

  try {
    await applicationRepositories.addApplication({ id, userId, jobId: job_id, status });
  } catch (error) {
    if (error.code === "23505") {
      throw new InvariantError("Application already exists for this user and job");
    }

    if (error.code === "23503") {
      return response(res, 404, "Job not found", null);
    }

    throw error;
  }

  await MessageProducer.sendMessage("applications:created", JSON.stringify({ application_id: id }));

  return response(
    res,
    201,
    "Application created successfully",
    {
      id,
      user_id: userId,
      job_id,
      status,
    }
  );
}

export async function updateApplication(req, res) {
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

  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Application tidak ditemukan"));
  }

  const deletedCount = await applicationRepositories.deleteApplication(id);

  if (deletedCount === 0) {
    return response(
      res,
      404,
      "Application not found"
    );
  }

  return response(
    res,
    200,
    "Application deleted successfully"
  );
}