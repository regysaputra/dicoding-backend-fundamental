import express from 'express';
import {login, logout, refreshToken} from "../controller/authentication-controller.js";
import validate from "../../../middlewares/payload-validator.js";
import {loginSchema, tokenSchema} from "../validator/schema.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = express.Router();

router.post('/', validate(loginSchema), login);
router.delete('/', authenticateToken, validate(tokenSchema), logout);
router.put('/', validate(tokenSchema), refreshToken);

export default router;