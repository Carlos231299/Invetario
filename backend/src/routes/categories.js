import express from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate, validateCategory, validateId } from '../middlewares/validator.js';

const router = express.Router();

router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, validate(validateId), getCategory);
router.post('/', authenticate, authorize('Admin'), validate(validateCategory), createCategory);
router.put('/:id', authenticate, authorize('Admin'), validate([...validateId, ...validateCategory]), updateCategory);
router.delete('/:id', authenticate, authorize('Admin'), validate(validateId), deleteCategory);

export default router;

