import express from 'express';
import authenticateToken from "../../../middlewares/auth.js";
import {getApplicationByUserId, getBookmarkByUserId, getProfile} from "../controller/profile-controller.js";

const router = express.Router();

router.get("/", authenticateToken, getProfile);
router.get("/applications", authenticateToken, getApplicationByUserId);
router.get("/bookmarks", authenticateToken, getBookmarkByUserId);

export default router;