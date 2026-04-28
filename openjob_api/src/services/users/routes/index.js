import express from 'express';
import {createUser, getUser} from "../controller/user-controller.js";
import validate from "../../../middlewares/payload-validator.js";
import {parametersSchema, userPayloadSchema} from "../validator/schema.js";
import urlParamsValidator from "../../../middlewares/url-params-validator.js";

const router = express.Router();

router.get('/:id', getUser);
router.post('/', validate(userPayloadSchema), createUser);

export default router;