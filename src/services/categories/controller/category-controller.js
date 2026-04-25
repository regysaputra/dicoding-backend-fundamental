import CategoryRepositories from "../repositories/category-repositories.js";
import response from "../../../utils/response.js";
import {NotFoundError} from "../../../exceptions/index.js";
import {uuidv7} from "uuidv7";

const categoryRepositories = new CategoryRepositories();

export async function getAllCategory(req, res, next) {
  const categories = await categoryRepositories.getAllCategory();

  return response(
    res,
    200,
    "Berhasil mendapatkan semua kategori",
    {
      categories
    }
  );
}

export async function getCategoryById(req, res, next) {
  const { id } = req.params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Category tidak ditemukan"));
  }

  const category = await categoryRepositories.getCategoryById(id);

  return response(
    res,
    200,
    "Berhasil mendapatkan kategori",
    category
  );
}

export async function addCategory(req, res, next) {
  const { name } = req.body;
  const id = uuidv7();
  await categoryRepositories.addCategory(id, name);

  return response(
    res,
    201,
    "Berhasil menambahkan kategori",
    {
      id
    }
  );
}

export async function updateCategory(req, res, next) {
  const { id } = req.params;
  const { name } = req.body;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Category tidak ditemukan"));
  }

  await categoryRepositories.updateCategoryById(id, name);

  return response(
    res,
    200,
    "Berhasil mengubah kategori",
    {
      id
    }
  );
}

export async function deleteCategory(req, res, next) {
  const { id } = req.params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("Category tidak ditemukan"));
  }

  await categoryRepositories.deleteCategoryById(id);

  return response(
    res,
    200,
    "Berhasil menghapus kategori",
    {
      id
    }
  );
}