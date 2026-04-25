import CompanyRepositories from "../repositories/company-repositories.js";
import response from "../../../utils/response.js";
import {uuidv7} from "uuidv7";
import {NotFoundError} from "../../../exceptions/index.js";

const companyRepositories = new CompanyRepositories();

export async function addCompany(req, res, next) {
  const { name, location, description } = req.body;

  // Check if the company already exists
  const companyRecord = await companyRepositories.getCompanyByNameAndLocation(name, location);
  console.log("companyRecord :", companyRecord);
  if (companyRecord.length > 0) {
    return response(
      res,
      400,
      "Company already exists"
    );
  }

  const id = uuidv7();
  await companyRepositories.addCompany({ id, name, location, description });
  return response(
    res,
    201,
    "Company created successfully",
    {
      id
    }
  );
}

export async function getAllCompanies(req, res, next) {
  const companies = await companyRepositories.getAllCompanies();
  return response(
    res,
    200,
    "Company retrieved successfully",
    {
      companies
    }
  );
}

export async function getCompanyById(req, res, next) {
  const { id } = req.params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Company tidak ditemukan"));
  }

  const company = await companyRepositories.getCompanyById(id);
  if (!company) {
    return response(
      res,
      404,
      "Company not found"
    );
  }
  return response(
    res,
    200,
    "Company retrieved successfully",
    company
  );
}

export async function updateCompany(req, res, next) {
  const { id } = req.params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Company tidak ditemukan"));
  }

  const { name, location, description } = req.body;
  await companyRepositories.updateCompany(id, name, location, description);
  return response(
    res,
    200,
    "Company updated successfully"
  );
}

export async function deleteCompany(req, res, next) {
  const { id } = req.params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Company tidak ditemukan"));
  }

  await companyRepositories.deleteCompany(id);
  return response(
    res,
    200,
    "Company deleted successfully"
  )
}