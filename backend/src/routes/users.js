import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate, validateUser, validateId } from '../middlewares/validator.js';

const router = express.Router();

// Solo Admin puede gestionar usuarios
router.use(authenticate, authorize('Admin'));

router.get('/', getUsers);
router.get('/:id', validate(validateId), getUser);
router.post('/', validate(validateUser), createUser);
router.put('/:id', validate([...validateId, ...validateUser]), updateUser);
router.delete('/:id', validate(validateId), deleteUser);

export default router;

