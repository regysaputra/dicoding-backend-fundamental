import UserRepositories from "../repositories/user-repositories.js";
import {InvariantError, NotFoundError} from "../../../exceptions/index.js";
import response from "../../../utils/response.js";

const userRepositories = new UserRepositories();

export async function createUser(req, res, next) {
  const { name, email, password, role } = req.body;

  const isEmailExists = await userRepositories.verifyNewEmail(email);
  if (isEmailExists) {
    return next(new InvariantError("Email telah terdaftar"));
  }

  const user = await userRepositories.createUser({ name, email, password, role });
  if (!user) {
    return next(new InvariantError("Gagal membuat user"));
  }

  return response(res, 201, "User berhasil ditambahkan", user);
}

export async function getUser(req, res, next) {
  const { id } = req.params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return next(new NotFoundError("User tidak ditemukan"));
  }

  const result = await userRepositories.getUserById(id);
  if (!result) {
    return next(new InvariantError("User tidak ditemukan"));
  }

  res.setHeader("X-Data-Source", result.source);

  return response(res, 200, "User ditemukan", result.user);
}