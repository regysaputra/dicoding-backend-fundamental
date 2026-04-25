import jwt from "jsonwebtoken";
import {InvariantError} from "../exceptions/index.js";
import AuthenticationError from "../exceptions/authentication-error.js";

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '15m' }),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: '1d' }),
  verifyRefreshToken: (refreshToken) => {
    try {
      return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError("Refresh token tidak valid");
    }
  },
  verifyAccessToken: (accessToken) => {
    try {
      return jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
    } catch (error) {
      throw new AuthenticationError("Access token tidak valid");
    }
  }
};

export default TokenManager;