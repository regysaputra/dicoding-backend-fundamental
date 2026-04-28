import express from 'express';
import {deleteDocument, getAllDocument, getDocumentById, uploadDocument} from "../controller/upload-controller.js";
import authenticateToken from "../../../middlewares/auth.js";
import multer from "multer";
const upload = multer({ dest: "uploads/"});

const router = express.Router();

router.post("/", authenticateToken, upload.single("document"), uploadDocument);
router.get("/", getAllDocument);
router.get("/:id", getDocumentById);
router.delete("/:id", authenticateToken, deleteDocument);

export default router;