import express from 'express';
import {
  createEntry,
  getEntries,
  getEntry
} from '../controllers/entryController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, validateEntry, validateId } from '../middlewares/validator.js';

const router = express.Router();

router.get('/', authenticate, getEntries);
router.get('/:id', authenticate, validate(validateId), getEntry);
router.post('/', authenticate, validate(validateEntry), createEntry);

export default router;

