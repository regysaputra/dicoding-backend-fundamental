import express from 'express';
import users from '../services/users/routes/index.js';
import auth from '../services/authentications/routes/index.js';
import companies from '../services/companies/routes/index.js';
import categories from '../services/categories/routes/index.js';
import jobs from '../services/jobs/routes/index.js';
import applications from '../services/applications/routes/index.js';
import bookmarks from '../services/bookmarks/routes/index.js';
import profiles from '../services/profiles/routes/index.js';

const router = express.Router();

router.use("/users", users);
router.use("/authentications", auth);
router.use("/companies", companies);
router.use("/categories", categories);
router.use("/jobs", jobs);
router.use("/applications", applications);
router.use("/bookmarks", bookmarks);
router.use("/profile", profiles);

export default router;