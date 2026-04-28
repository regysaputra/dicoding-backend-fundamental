import CompanyRepositories from "../repositories/company-repositories.js";
import response from "../../../utils/response.js";
import {uuidv7} from "uuidv7";
import {NotFoundError} from "../../../exceptions/index.js";

const companyRepositories = new CompanyRepositories();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 const COMPANY_NOT_FOUND_MESSAGE = "Company not found";

function validateCompanyId(id, next) {
  if (!uuidRegex.test(id)) {
    next(new NotFoundError("Company tidak ditemukan"));
    return false;
  }

  return true;
}

function sendCompanyNotFound(res) {
  return response(res, 404, COMPANY_NOT_FOUND_MESSAGE);
}

export async function addCompany(req, res) {
  const { name, location, description } = req.body;
  const ownerUserId = req.user?.id ?? null;

  const companyRecord = await companyRepositories.getCompanyByNameAndLocation(name, location);
  if (companyRecord.length > 0) {
    return response(res, 400, "Company already exists");
  }

  const id = uuidv7();
  await companyRepositories.addCompany({ id, name, location, description, ownerUserId });

  return response(res, 201, "Company created successfully", { id });
}

export async function getAllCompanies(req, res) {
  const companies = await companyRepositories.getAllCompanies();

  const newCompanies = companies.map(({ website, ...rest }) => rest);

  return response(res, 200, "Company retrieved successfully", { companies: newCompanies });
}

export async function getCompanyById(req, res, next) {
  const { id } = req.params;

  if (!validateCompanyId(id, next)) {
    return;
  }

  const result = await companyRepositories.getCompanyById(id);
  if (!result?.company) {
    return sendCompanyNotFound(res);
  }

  if (result.source) {
    res.setHeader("X-Data-Source", result.source);
  }

  return response(res, 200, "Company retrieved successfully", result.company);
}

export async function updateCompany(req, res, next) {
  const { id } = req.params;

  if (!validateCompanyId(id, next)) {
    return;
  }

  const { name, location, description } = req.body;
  const updatedCount = await companyRepositories.updateCompany(id, name, location, description);

  if (updatedCount === 0) {
    return sendCompanyNotFound(res);
  }

  return response(res, 200, "Company updated successfully");
}

export async function deleteCompany(req, res, next) {
  const { id } = req.params;

  if (!validateCompanyId(id, next)) {
    return;
  }

  const deleteCount = await companyRepositories.deleteCompany(id);

  if (deleteCount === 0) {
    return sendCompanyNotFound(res);
  }

  return response(res, 200, "Company deleted successfully");
}