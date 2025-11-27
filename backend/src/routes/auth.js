import express from 'express';
import { login, register, forgotPassword, verifyCode, resetPasswordController, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, validateLogin, validateRegister, validateForgotPassword, validateResetPassword, validateVerifyCode } from '../middlewares/validator.js';

const router = express.Router();

router.post('/login', validate(validateLogin), login);
router.post('/register', validate(validateRegister), register);
router.post('/forgot-password', validate(validateForgotPassword), forgotPassword);
router.post('/verify-code', validate(validateVerifyCode), verifyCode);
router.post('/reset-password', validate(validateResetPassword), resetPasswordController);
router.get('/profile', authenticate, getProfile);

export default router;

