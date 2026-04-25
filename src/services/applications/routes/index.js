import express from 'express';
import validate from "../../../middlewares/payload-validator.js";
import {applicationPayloadSchema, applicationUpdatePayloadSchema} from "../validator/schema.js";
import {
  addApplication, deleteApplication,
  getAllApplication,
  getApplicationById, getApplicationByJobId,
  getApplicationByUserId, updateApplication
} from "../controller/application-controller.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticateToken, validate(applicationPayloadSchema), addApplication);
router.get("/", authenticateToken, getAllApplication);
router.get("/:id", authenticateToken, getApplicationById);
router.get("/user/:userId", authenticateToken, getApplicationByUserId);
router.get("/job/:jobId", authenticateToken, getApplicationByJobId);
router.put("/:id", authenticateToken, validate(applicationUpdatePayloadSchema), updateApplication);
router.delete("/:id", authenticateToken, deleteApplication);

export default router;