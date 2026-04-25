import TokenManager from "../security/token-manager.js";
import response from "../utils/response.js";

export default async function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  console.log("token: ", token);
  if(token && token.startsWith('Bearer ')) {
    try {
      req.user = await TokenManager.verifyAccessToken(token.split(' ')[1]);
      return next();
    } catch(err) {
      console.error("authenticateToken: ", err);
      return next(err);
    }
  }

  return response(
    res,
    401,
    'Unauthorized',
    null
  );
}