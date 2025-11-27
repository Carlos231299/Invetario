import express from 'express';
import { getMovementsController } from '../controllers/movementController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, getMovementsController);

export default router;

