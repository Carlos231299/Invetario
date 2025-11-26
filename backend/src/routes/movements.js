import express from 'express';
import { getMovements } from '../controllers/movementController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, getMovements);

export default router;

