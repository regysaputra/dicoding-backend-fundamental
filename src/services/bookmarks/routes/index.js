import express from 'express';
import { getAllUserBookmark } from "../controller/bookmark-controller.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getAllUserBookmark);

export default router;