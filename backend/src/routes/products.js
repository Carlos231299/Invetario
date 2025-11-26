import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate, validateProduct, validateId } from '../middlewares/validator.js';

const router = express.Router();

router.get('/', authenticate, getProducts);
router.get('/low-stock', authenticate, getLowStockProducts);
router.get('/:id', authenticate, validate(validateId), getProduct);
router.post('/', authenticate, validate(validateProduct), createProduct);
router.put('/:id', authenticate, validate([...validateId, ...validateProduct]), updateProduct);
router.delete('/:id', authenticate, authorize('Admin'), validate(validateId), deleteProduct);

export default router;

