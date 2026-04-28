import UserRepositories from "../../users/repositories/user-repositories.js";
import {InvariantError} from "../../../exceptions/index.js";
import AuthenticationError from "../../../exceptions/authentication-error.js";
import TokenManager from "../../../security/token-manager.js";
import AuthenticationRepositories from "../repositories/authentication-repositories.js";
import response from "../../../utils/response.js";
import bcrypt from "bcrypt";

const userRepositories = new UserRepositories();
const authRepositories = new AuthenticationRepositories();

export async function login(req, res, next) {
  const { email, password } = req.body;

  const userRecord = await userRepositories.getUserByEmail(email);

  if (!userRecord) {
    return next(new AuthenticationError("Kredensial tidak valid"));
  }

  const isValid = await bcrypt.compare(password, userRecord.password);

  if (!isValid) {
    return next(new AuthenticationError("Kredensial tidak valid"));
  }

  const accessToken = TokenManager.generateAccessToken({ id: userRecord.id });
  const refreshToken = TokenManager.generateRefreshToken({ id: userRecord.id });

  await authRepositories.addToken(refreshToken);

  return response(
    res,
    200,
    "Login berhasil",
    { accessToken, refreshToken }
  );
}

export async function logout(req, res, next) {
  const { refreshToken } = req.body;

  const tokenRecord = await authRepositories.getToken(refreshToken);
  if (!tokenRecord) {
    return next(new InvariantError("Refresh token tidak valid"));
  }

  await authRepositories.deleteToken(refreshToken);

  return response(res, 200, "Logout berhasil");
}

export async function refreshToken(req, res, next) {
  const { refreshToken } = req.body;

  const tokenRecord = await authRepositories.getToken(refreshToken);
  if (!tokenRecord) {
    return next(new InvariantError("Refresh token tidak valid"));
  }

  const { id } = TokenManager.verifyRefreshToken(refreshToken);
  const accessToken = TokenManager.generateAccessToken({ id });

  return response(res, 200, "Access token berhasil diperbarui", { accessToken });
}