import express from 'express';
import {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate, validateSupplier, validateId } from '../middlewares/validator.js';

const router = express.Router();

router.get('/', authenticate, getSuppliers);
router.get('/:id', authenticate, validate(validateId), getSupplier);
router.post('/', authenticate, authorize('Admin'), validate(validateSupplier), createSupplier);
router.put('/:id', authenticate, authorize('Admin'), validate([...validateId, ...validateSupplier]), updateSupplier);
router.delete('/:id', authenticate, authorize('Admin'), validate(validateId), deleteSupplier);

export default router;

