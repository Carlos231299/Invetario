import express from 'express';
import {
  createExit,
  getExits,
  getExit
} from '../controllers/exitController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, validateExit, validateId } from '../middlewares/validator.js';

const router = express.Router();

router.get('/', authenticate, getExits);
router.get('/:id', authenticate, validate(validateId), getExit);
router.post('/', authenticate, validate(validateExit), createExit);

export default router;

