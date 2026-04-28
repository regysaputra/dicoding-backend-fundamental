import CategoryRepositories from "../repositories/category-repositories.js";
import response from "../../../utils/response.js";
import {NotFoundError} from "../../../exceptions/index.js";
import {uuidv7} from "uuidv7";

const categoryRepositories = new CategoryRepositories();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateCategoryId(id, next) {
  if (!uuidRegex.test(id)) {
    next(new NotFoundError("Category tidak ditemukan"));
    return false;
  }

  return true;
}

export async function getAllCategory(req, res) {
  const categories = await categoryRepositories.getAllCategory();

  return response(
    res,
    200,
    "Berhasil mendapatkan semua kategori",
    {
      categories,
    }
  );
}

export async function getCategoryById(req, res, next) {
  const { id } = req.params;

  if (!validateCategoryId(id, next)) {
    return;
  }

  const category = await categoryRepositories.getCategoryById(id);

  if (!category) {
    return response(res, 404, "Category not found");
  }

  return response(
    res,
    200,
    "Berhasil mendapatkan kategori",
    category
  );
}

export async function addCategory(req, res) {
  const { name } = req.body;
  const id = uuidv7();
  await categoryRepositories.addCategory(id, name);

  return response(
    res,
    201,
    "Berhasil menambahkan kategori",
    {
      id,
    }
  );
}

export async function updateCategory(req, res, next) {
  const { id } = req.params;
  const { name } = req.body;

  if (!validateCategoryId(id, next)) {
    return;
  }

  const updatedCount = await categoryRepositories.updateCategoryById(id, name);

  if (updatedCount === 0) {
    return response(res, 404, "Category not found");
  }

  return response(
    res,
    200,
    "Berhasil mengubah kategori",
    {
      id,
    }
  );
}

export async function deleteCategory(req, res, next) {
  const { id } = req.params;

  if (!validateCategoryId(id, next)) {
    return;
  }

  const deletedCount = await categoryRepositories.deleteCategoryById(id);

  if (deletedCount === 0) {
    return response(res, 404, "Category not found");
  }

  return response(
    res,
    200,
    "Berhasil menghapus kategori",
    {
      id,
    }
  );
}