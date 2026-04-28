import express from 'express';
import {deleteDocument, getAllDocument, getDocumentById, uploadDocument} from "../controller/upload-controller.js";
import authenticateToken from "../../../middlewares/auth.js";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },

  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

router.post("/", authenticateToken, upload.single("document"), uploadDocument);
router.get("/", getAllDocument);
router.get("/:id", getDocumentById);
router.delete("/:id", authenticateToken, deleteDocument);

export default router;