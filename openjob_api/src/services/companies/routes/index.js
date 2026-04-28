import express from 'express';
import {
  addCompany,
  deleteCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany
} from "../controller/company-controller.js";
import authenticateToken from "../../../middlewares/auth.js";
import validate from "../../../middlewares/payload-validator.js";
import {companyPayloadSchema, companyUpdatePayloadSchema} from "../validator/schema.js";

const router = express.Router();

router.post('/', authenticateToken, validate(companyPayloadSchema), addCompany);
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', authenticateToken, validate(companyUpdatePayloadSchema), updateCompany);
router.delete('/:id', authenticateToken, deleteCompany);

export default router;