import express from 'express';
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory
} from "../controller/category-controller.js";
import authenticateToken from "../../../middlewares/auth.js";
import validate from "../../../middlewares/payload-validator.js";
import {categoryPayloadSchema, categoryUpdatePayloadSchema} from "../validator/schema.js";

const router = express.Router();

router.post("/", authenticateToken, validate(categoryPayloadSchema), addCategory);
router.get("/", getAllCategory);
router.get("/:id", getCategoryById);
router.put("/:id", authenticateToken, validate(categoryUpdatePayloadSchema), updateCategory);
router.delete("/:id", authenticateToken, deleteCategory);

export default router;