import express from 'express';
import authenticateToken from "../../../middlewares/auth.js";
import validate from "../../../middlewares/payload-validator.js";
import validateQueryParams from "../../../middlewares/query-params-validator.js";
import urlParamsValidator from "../../../middlewares/url-params-validator.js";
import {jobCategoryParamsSchema, jobCompanyParamsSchema, jobPayloadSchema, jobQueryParamsSchema, jobUpdatePayloadSchema} from "../validator/schema.js";
import {addJob, deleteJob, getAllJob, getJobByCategoryId, getJobByCompanyId, getJobById, updateJob} from "../controller/job-controller.js";
import {addBookmark, deleteBookmark, getBookmarkById} from "../../bookmarks/controller/bookmark-controller.js";

const router = express.Router();

router.post('/', authenticateToken, validate(jobPayloadSchema), addJob);
router.get('/', validateQueryParams(jobQueryParamsSchema), getAllJob);
router.get('/company/:jobCompanyId', urlParamsValidator(jobCompanyParamsSchema), getJobByCompanyId);
router.get('/category/:jobCategoryId', urlParamsValidator(jobCategoryParamsSchema), getJobByCategoryId);
router.get('/:id', getJobById);
router.put('/:id', authenticateToken, validate(jobUpdatePayloadSchema), updateJob);
router.delete('/:id', authenticateToken, deleteJob);

router.post("/:jobId/bookmark", authenticateToken, addBookmark);
router.get("/:jobId/bookmark/:id", authenticateToken, getBookmarkById);
router.delete("/:jobId/bookmark", authenticateToken, deleteBookmark);

export default router;